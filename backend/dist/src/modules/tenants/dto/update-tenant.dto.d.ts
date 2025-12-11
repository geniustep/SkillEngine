import { TenantStatus, SubscriptionPlan } from '@prisma/client';
export declare class UpdateTenantDto {
    name?: string;
    domain?: string;
    logo?: string;
    status?: TenantStatus;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionExpiresAt?: string;
    settings?: Record<string, unknown>;
}
