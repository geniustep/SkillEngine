"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../database/prisma.service");
const keycloak_service_1 = require("./services/keycloak.service");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, keycloakService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.keycloakService = keycloakService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(loginDto) {
        try {
            const keycloakTokens = await this.keycloakService.authenticate(loginDto.email, loginDto.password);
            const keycloakUser = await this.keycloakService.getUserInfo(keycloakTokens.access_token);
            let user = await this.prisma.user.findUnique({
                where: { keycloakId: keycloakUser.sub },
                include: { tenant: true },
            });
            if (!user) {
                throw new common_1.BadRequestException('المستخدم غير مسجل في النظام');
            }
            if (user.status !== 'active') {
                throw new common_1.UnauthorizedException('الحساب غير نشط');
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });
            const tokens = await this.generateTokens(user);
            await this.storeRefreshToken(user.id, tokens.refreshToken);
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
        }
        catch (error) {
            this.logger.error(`Login failed: ${error.message}`);
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('بيانات الاعتماد غير صحيحة');
        }
    }
    async logout(userId) {
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
    async refreshToken(token) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('رمز التجديد غير صالح أو منتهي الصلاحية');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: storedToken.userId },
            include: { tenant: true },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('المستخدم غير موجود أو غير نشط');
        }
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        const tokens = await this.generateTokens(user);
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
    async getCurrentUser(userId) {
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
            throw new common_1.UnauthorizedException('المستخدم غير موجود');
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
            permissions: permissions_decorator_1.RolePermissions[user.role] || [],
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        };
    }
    async verifyToken(token) {
        try {
            await this.jwtService.verifyAsync(token);
            return true;
        }
        catch {
            return false;
        }
    }
    async validateUser(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { tenant: true },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('المستخدم غير موجود أو غير نشط');
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            tenantId: user.tenantId,
            keycloakId: user.keycloakId,
            permissions: permissions_decorator_1.RolePermissions[user.role] || [],
        };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            permissions: permissions_decorator_1.RolePermissions[user.role] || [],
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync({ sub: user.id, type: 'refresh' }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, token) {
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
        const expiresAt = this.calculateExpiry(expiresIn);
        await this.prisma.refreshToken.create({
            data: {
                id: (0, uuid_1.v4)(),
                token,
                userId,
                expiresAt,
            },
        });
    }
    calculateExpiry(duration) {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match) {
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return new Date(Date.now() + value * multipliers[unit]);
    }
    getExpiresInSeconds() {
        const expiresIn = this.configService.get('JWT_EXPIRES_IN', '15m');
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match)
            return 900;
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers = {
            s: 1,
            m: 60,
            h: 3600,
            d: 86400,
        };
        return value * multipliers[unit];
    }
    async logAudit(tenantId, userId, action, resource) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    tenantId,
                    userId,
                    action,
                    resource,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to log audit: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        keycloak_service_1.KeycloakService])
], AuthService);
//# sourceMappingURL=auth.service.js.map