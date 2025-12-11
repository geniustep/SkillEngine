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
export declare class KeycloakService {
    private readonly configService;
    private readonly logger;
    private readonly keycloakUrl;
    private readonly realm;
    private readonly clientId;
    private readonly clientSecret;
    constructor(configService: ConfigService);
    authenticate(email: string, password: string): Promise<KeycloakTokenResponse>;
    getUserInfo(accessToken: string): Promise<KeycloakUserInfo>;
    refreshToken(refreshToken: string): Promise<KeycloakTokenResponse>;
    logout(refreshToken: string): Promise<void>;
    private mockAuthenticate;
    private mockGetUserInfo;
}
export {};
