import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<TokenResponseDto>;
    logout(user: CurrentUserData): Promise<{
        message: string;
    }>;
    refresh(refreshDto: RefreshTokenDto): Promise<TokenResponseDto>;
    me(user: CurrentUserData): Promise<{
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
    verifyToken(token: string): Promise<{
        valid: boolean;
    }>;
}
