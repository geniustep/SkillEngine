import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EnrollmentQueryDto } from './dto/enrollment-query.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    findAll(query: EnrollmentQueryDto, tenantId: string): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
        course: {
            instructor: {
                id: string;
                firstName: string;
                lastName: string;
            };
            level: import(".prisma/client").$Enums.CourseLevel;
            title: string;
            id: string;
            slug: string;
            thumbnail: string | null;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
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
    }>>;
    findOne(params: IdParamDto, tenantId: string): Promise<{
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
            curriculum: {
                type: import(".prisma/client").$Enums.CurriculumType;
                title: string;
                id: string;
                duration: number | null;
            }[];
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
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
    }>;
    create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        course: {
            title: string;
            id: string;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
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
    }>;
    updateProgress(params: IdParamDto, updateProgressDto: UpdateProgressDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    }>;
    markComplete(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        course: {
            title: string;
            id: string;
        };
        student: {
            id: string;
            firstName: string;
            lastName: string;
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
    }>;
    remove(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    getCertificate(params: IdParamDto, tenantId: string): Promise<{
        certificateUrl: string;
        studentName: string;
        courseName: string;
        completedAt: Date | null;
    }>;
}
