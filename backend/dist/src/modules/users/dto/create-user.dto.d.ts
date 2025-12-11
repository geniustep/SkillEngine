import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    bio?: string;
}
