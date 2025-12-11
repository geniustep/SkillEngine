import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { TenantStatus, SubscriptionPlan } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class TenantQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'تصفية حسب الحالة',
    enum: TenantStatus,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'تصفية حسب خطة الاشتراك',
    enum: SubscriptionPlan,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;
}

