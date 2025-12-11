import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL', '');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'academy-lms');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'admin-dashboard');
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET', '');
  }

  async authenticate(email: string, password: string): Promise<KeycloakTokenResponse> {
    if (!this.keycloakUrl) {
      // For development without Keycloak
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
        throw new UnauthorizedException('بيانات الاعتماد غير صحيحة');
      }

      return response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Keycloak error: ${error}`);
      throw new UnauthorizedException('فشل الاتصال بخدمة المصادقة');
    }
  }

  async getUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
    if (!this.keycloakUrl) {
      // For development without Keycloak
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
        throw new UnauthorizedException('فشل الحصول على بيانات المستخدم');
      }

      return response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Keycloak userinfo error: ${error}`);
      throw new UnauthorizedException('فشل الاتصال بخدمة المصادقة');
    }
  }

  async refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    if (!this.keycloakUrl) {
      throw new UnauthorizedException('Keycloak not configured');
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
        throw new UnauthorizedException('رمز التجديد غير صالح');
      }

      return response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Keycloak refresh error: ${error}`);
      throw new UnauthorizedException('فشل تجديد الرمز');
    }
  }

  async logout(refreshToken: string): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Keycloak logout error: ${error}`);
    }
  }

  // Mock methods for development without Keycloak
  private mockAuthenticate(_email: string, _password: string): KeycloakTokenResponse {
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

  private mockGetUserInfo(_accessToken: string): KeycloakUserInfo {
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
}

