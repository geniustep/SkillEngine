import { TenantStatus, SubscriptionPlan } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class TenantQueryDto extends PaginationQueryDto {
    status?: TenantStatus;
    subscriptionPlan?: SubscriptionPlan;
}
