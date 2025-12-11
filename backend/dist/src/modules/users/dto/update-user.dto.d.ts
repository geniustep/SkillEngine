import { UserRole, UserStatus } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    role?: UserRole;
    status?: UserStatus;
    address?: string;
    city?: string;
    country?: string;
    zipCode?: string;
}
