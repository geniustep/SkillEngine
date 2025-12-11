import { SubscriptionPlan } from '@prisma/client';
export declare class CreateTenantDto {
    name: string;
    domain?: string;
    logo?: string;
    ownerId: string;
    subscriptionPlan?: SubscriptionPlan;
    settings?: Record<string, unknown>;
}
