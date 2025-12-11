import { UserRole, UserStatus } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    bio?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    enrollmentsCount?: number;
}
