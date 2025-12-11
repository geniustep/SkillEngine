import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
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
        settings: import("@prisma/client/runtime/library").JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>>;
    findOne(params: IdParamDto): Promise<{
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
        settings: import("@prisma/client/runtime/library").JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    create(createTenantDto: CreateTenantDto, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    update(params: IdParamDto, updateTenantDto: UpdateTenantDto, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    updateStatus(params: IdParamDto, status: string, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.TenantStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        domain: string | null;
        logo: string | null;
        settings: import("@prisma/client/runtime/library").JsonValue;
        subscriptionPlan: import(".prisma/client").$Enums.SubscriptionPlan;
        subscriptionExpiresAt: Date | null;
        ownerId: string;
    }>;
    getStats(params: IdParamDto): Promise<{
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
}
