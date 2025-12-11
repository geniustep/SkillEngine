import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { KeycloakService } from './services/keycloak.service';
import { LoginDto } from './dto/login.dto';
import { SetupDto } from './dto/setup.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { RolePermissions } from '../../common/decorators/permissions.decorator';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly useLocalAuth: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly keycloakService: KeycloakService,
  ) {
    // Use local auth if Keycloak URL is not configured
    this.useLocalAuth = !this.configService.get<string>('KEYCLOAK_URL');
    if (this.useLocalAuth) {
      this.logger.log('Using local authentication (Keycloak not configured)');
    }
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    try {
      let user;

      if (this.useLocalAuth) {
        // Local authentication
        user = await this.localAuthenticate(loginDto.email, loginDto.password);
      } else {
        // Keycloak authentication
        const keycloakTokens = await this.keycloakService.authenticate(
          loginDto.email,
          loginDto.password,
        );

        const keycloakUser = await this.keycloakService.getUserInfo(keycloakTokens.access_token);

        user = await this.prisma.user.findUnique({
          where: { keycloakId: keycloakUser.sub },
          include: { tenant: true },
        });

        if (!user) {
          throw new BadRequestException('المستخدم غير مسجل في النظام');
        }
      }

      if (user.status !== 'active') {
        throw new UnauthorizedException('الحساب غير نشط');
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Store refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      // Log audit
      await this.logAudit(user.tenantId, user.id, 'login', 'auth');

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: this.getExpiresInSeconds(),
        tokenType: 'Bearer',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          tenantId: user.tenantId,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('بيانات الاعتماد غير صحيحة');
    }
  }

  private async localAuthenticate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('بيانات الاعتماد غير صحيحة');
    }

    if (!user.password) {
      throw new UnauthorizedException('هذا الحساب يتطلب تسجيل الدخول عبر SSO');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الاعتماد غير صحيحة');
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getSetupStatus(): Promise<{ isSetup: boolean }> {
    const userCount = await this.prisma.user.count();
    return { isSetup: userCount > 0 };
  }

  async setup(setupDto: SetupDto): Promise<TokenResponseDto> {
    // Check if already setup
    const { isSetup } = await this.getSetupStatus();
    if (isSetup) {
      throw new BadRequestException('النظام مُعد مسبقاً. استخدم صفحة تسجيل الدخول.');
    }

    // Create default tenant
    const tenantId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await this.hashPassword(setupDto.password);

    // Create tenant first (without owner), then user, then update tenant with owner
    const user = await this.prisma.$transaction(async (tx) => {
      // Create tenant first without owner (ownerId is optional)
      await tx.tenant.create({
        data: {
          id: tenantId,
          name: setupDto.organizationName || 'SkillEngine Academy',
          slug: 'default',
          status: 'active',
          subscriptionPlan: 'enterprise',
        },
      });

      // Create super admin user with tenant reference
      await tx.user.create({
        data: {
          id: userId,
          email: setupDto.email,
          password: hashedPassword,
          firstName: setupDto.firstName,
          lastName: setupDto.lastName,
          role: 'super_admin',
          status: 'active',
          tenantId: tenantId,
          emailVerifiedAt: new Date(),
        },
      });

      // Update tenant with owner
      await tx.tenant.update({
        where: { id: tenantId },
        data: { ownerId: userId },
      });

      // Return user with tenant
      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: { tenant: true },
      });
    });

    this.logger.log(`System setup completed. Super admin created: ${user.email}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Log audit
    await this.logAudit(user.tenantId, user.id, 'setup', 'system');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.getExpiresInSeconds(),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        tenantId: user.tenantId,
      },
    };
  }

  async logout(userId: string): Promise<void> {
    // Revoke all refresh tokens for user
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (user) {
      await this.logAudit(user.tenantId, userId, 'logout', 'auth');
    }
  }

  async refreshToken(token: string): Promise<TokenResponseDto> {
    // Find refresh token
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('رمز التجديد غير صالح أو منتهي الصلاحية');
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
      include: { tenant: true },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('المستخدم غير موجود أو غير نشط');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Store new refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.getExpiresInSeconds(),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        tenantId: user.tenantId,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        instructor: {
          select: {
            id: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      tenantId: user.tenantId,
      tenant: user.tenant,
      isInstructor: !!user.instructor,
      instructorId: user.instructor?.id,
      permissions: RolePermissions[user.role] || [],
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      return false;
    }
  }

  async validateUser(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { tenant: true },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('المستخدم غير موجود أو غير نشط');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      keycloakId: user.keycloakId,
      permissions: RolePermissions[user.role] || [],
    };
  }

  private async generateTokens(user: { id: string; email: string; role: string; tenantId: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      permissions: RolePermissions[user.role] || [],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { sub: user.id, type: 'refresh' },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        token,
        userId,
        expiresAt,
      },
    });
  }

  private calculateExpiry(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }

  private getExpiresInSeconds(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '15m');
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * multipliers[unit];
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          id: uuidv4(),
          tenantId,
          userId,
          action,
          resource,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error.message}`);
    }
  }
}

