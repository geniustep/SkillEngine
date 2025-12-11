import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: UserQueryDto, tenantId: string): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
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
    findOne(params: IdParamDto, tenantId: string): Promise<{
        enrollmentsCount: number;
        sessionsCount: number;
        coursesCount: number;
        _count: undefined;
        instructor: {
            id: string;
            rating: import("@prisma/client/runtime/library").Decimal | null;
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    create(createUserDto: CreateUserDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    update(params: IdParamDto, updateUserDto: UpdateUserDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    updateStatus(params: IdParamDto, statusDto: UpdateUserStatusDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    remove(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    getUserEnrollments(params: IdParamDto, tenantId: string): Promise<({
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
        completedLessons: import("@prisma/client/runtime/library").JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getUserActivity(params: IdParamDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        resource: string;
        resourceId: string | null;
    }[]>;
}
