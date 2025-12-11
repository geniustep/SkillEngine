import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserStatus, Prisma } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, query: UserQueryDto): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
        enrollmentsCount: number;
        _count: undefined;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        phone: string | null;
        bio: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        enrollmentsCount: number;
        sessionsCount: number;
        coursesCount: number;
        _count: undefined;
        instructor: {
            id: string;
            rating: Prisma.Decimal | null;
            totalStudents: number;
            totalCourses: number;
            isVerified: boolean;
        } | null;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        tenantId: string;
        keycloakId: string;
        phone: string | null;
        bio: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        city: string | null;
        country: string | null;
        zipCode: string | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    create(createUserDto: CreateUserDto, tenantId: string, createdBy: string): Promise<{
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        phone: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, tenantId: string, updatedBy: string): Promise<{
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        phone: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: UserStatus, tenantId: string, updatedBy: string): Promise<{
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    remove(id: string, tenantId: string, deletedBy: string): Promise<void>;
    getUserEnrollments(userId: string, tenantId: string): Promise<({
        course: {
            instructor: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
            level: import(".prisma/client").$Enums.CourseLevel;
            title: string;
            id: string;
            slug: string;
            thumbnail: string | null;
            duration: number;
        };
    } & {
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expiresAt: Date | null;
        studentId: string;
        courseId: string;
        progress: number;
        completedLessons: Prisma.JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: Prisma.Decimal | null;
    })[]>;
    getUserActivity(userId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        resource: string;
        resourceId: string | null;
    }[]>;
    private logAudit;
}
