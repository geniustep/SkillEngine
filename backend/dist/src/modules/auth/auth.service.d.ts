import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { KeycloakService } from './services/keycloak.service';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly keycloakService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, keycloakService: KeycloakService);
    login(loginDto: LoginDto): Promise<TokenResponseDto>;
    logout(userId: string): Promise<void>;
    refreshToken(token: string): Promise<TokenResponseDto>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        avatar: string | null;
        phone: string | null;
        bio: string | null;
        tenantId: string;
        tenant: {
            name: string;
            id: string;
            slug: string;
            logo: string | null;
        };
        isInstructor: boolean;
        instructorId: string | undefined;
        permissions: string[];
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    verifyToken(token: string): Promise<boolean>;
    validateUser(payload: {
        sub: string;
        email: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        tenantId: string;
        keycloakId: string;
        permissions: string[];
    }>;
    private generateTokens;
    private storeRefreshToken;
    private calculateExpiry;
    private getExpiresInSeconds;
    private logAudit;
}
