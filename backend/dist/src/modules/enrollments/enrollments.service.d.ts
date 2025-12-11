import { PrismaService } from '../../database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EnrollmentQueryDto } from './dto/enrollment-query.dto';
import { Prisma } from '@prisma/client';
export declare class EnrollmentsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, query: EnrollmentQueryDto): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
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
        completedLessons: Prisma.JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: Prisma.Decimal | null;
    }>>;
    findOne(id: string, tenantId: string): Promise<{
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
        completedLessons: Prisma.JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: Prisma.Decimal | null;
    }>;
    create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, createdBy: string): Promise<{
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
        completedLessons: Prisma.JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: Prisma.Decimal | null;
    }>;
    updateProgress(id: string, updateProgressDto: UpdateProgressDto, tenantId: string, updatedBy: string): Promise<{
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
    }>;
    markComplete(id: string, tenantId: string, completedBy: string): Promise<{
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
        completedLessons: Prisma.JsonValue;
        lastAccessedAt: Date | null;
        completedAt: Date | null;
        enrolledAt: Date;
        certificateUrl: string | null;
        grade: Prisma.Decimal | null;
    }>;
    remove(id: string, tenantId: string, deletedBy: string): Promise<void>;
    getCertificate(id: string, tenantId: string): Promise<{
        certificateUrl: string;
        studentName: string;
        courseName: string;
        completedAt: Date | null;
    }>;
    private logAudit;
}
