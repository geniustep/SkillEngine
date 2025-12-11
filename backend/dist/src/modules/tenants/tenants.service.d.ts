import { PrismaService } from '../../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { Prisma } from '@prisma/client';
export declare class TenantsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(query: TenantQueryDto): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
        usersCount: number;
        coursesCount: number;
        _count: undefined;
        owner: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: Prisma.JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>>;
    findOne(id: string): Promise<{
        usersCount: number;
        coursesCount: number;
        sessionsCount: number;
        enrollmentsCount: number;
        _count: undefined;
        owner: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: Prisma.JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    create(createTenantDto: CreateTenantDto, createdBy: string): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: Prisma.JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto, updatedBy: string): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: Prisma.JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    updateStatus(id: string, status: string, updatedBy: string): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: Prisma.JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    getTenantStats(id: string): Promise<{
        users: number;
        courses: number;
        sessions: number;
        enrollments: {
            total: number;
            active: number;
            completed: number;
        };
        completionRate: number;
    }>;
    private getDefaultSettings;
    private logAudit;
}
