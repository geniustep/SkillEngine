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
var KeycloakService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let KeycloakService = KeycloakService_1 = class KeycloakService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(KeycloakService_1.name);
        this.keycloakUrl = this.configService.get('KEYCLOAK_URL', '');
        this.realm = this.configService.get('KEYCLOAK_REALM', 'academy-lms');
        this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID', 'admin-dashboard');
        this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET', '');
    }
    async authenticate(email, password) {
        if (!this.keycloakUrl) {
            this.logger.warn('Keycloak URL not configured, using mock authentication');
            return this.mockAuthenticate(email, password);
        }
        const tokenUrl = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'password',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    username: email,
                    password: password,
                    scope: 'openid profile email',
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                this.logger.error(`Keycloak authentication failed: ${JSON.stringify(error)}`);
                throw new common_1.UnauthorizedException('بيانات الاعتماد غير صحيحة');
            }
            return response.json();
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Keycloak error: ${error}`);
            throw new common_1.UnauthorizedException('فشل الاتصال بخدمة المصادقة');
        }
    }
    async getUserInfo(accessToken) {
        if (!this.keycloakUrl) {
            return this.mockGetUserInfo(accessToken);
        }
        const userInfoUrl = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;
        try {
            const response = await fetch(userInfoUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new common_1.UnauthorizedException('فشل الحصول على بيانات المستخدم');
            }
            return response.json();
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Keycloak userinfo error: ${error}`);
            throw new common_1.UnauthorizedException('فشل الاتصال بخدمة المصادقة');
        }
    }
    async refreshToken(refreshToken) {
        if (!this.keycloakUrl) {
            throw new common_1.UnauthorizedException('Keycloak not configured');
        }
        const tokenUrl = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: refreshToken,
                }),
            });
            if (!response.ok) {
                throw new common_1.UnauthorizedException('رمز التجديد غير صالح');
            }
            return response.json();
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Keycloak refresh error: ${error}`);
            throw new common_1.UnauthorizedException('فشل تجديد الرمز');
        }
    }
    async logout(refreshToken) {
        if (!this.keycloakUrl) {
            return;
        }
        const logoutUrl = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`;
        try {
            await fetch(logoutUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: refreshToken,
                }),
            });
        }
        catch (error) {
            this.logger.error(`Keycloak logout error: ${error}`);
        }
    }
    mockAuthenticate(_email, _password) {
        return {
            access_token: 'mock_access_token_' + Date.now(),
            expires_in: 900,
            refresh_expires_in: 604800,
            refresh_token: 'mock_refresh_token_' + Date.now(),
            token_type: 'Bearer',
            session_state: 'mock_session_' + Date.now(),
            scope: 'openid profile email',
        };
    }
    mockGetUserInfo(_accessToken) {
        return {
            sub: 'mock_keycloak_id_' + Date.now(),
            email_verified: true,
            name: 'Test User',
            preferred_username: 'testuser',
            given_name: 'Test',
            family_name: 'User',
            email: 'test@example.com',
        };
    }
};
exports.KeycloakService = KeycloakService;
exports.KeycloakService = KeycloakService = KeycloakService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KeycloakService);
//# sourceMappingURL=keycloak.service.js.map