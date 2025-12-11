import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { TenantStatus, SubscriptionPlan } from '@prisma/client';

export class UpdateTenantDto {
  @ApiPropertyOptional({
    description: 'اسم المؤسسة',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'النطاق المخصص',
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'رابط الشعار',
  })
  @IsOptional()
  @IsUrl({}, { message: 'رابط الشعار غير صالح' })
  logo?: string;

  @ApiPropertyOptional({
    description: 'حالة المؤسسة',
    enum: TenantStatus,
  })
  @IsOptional()
  @IsEnum(TenantStatus, { message: 'الحالة غير صالحة' })
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'خطة الاشتراك',
    enum: SubscriptionPlan,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan, { message: 'خطة الاشتراك غير صالحة' })
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({
    description: 'تاريخ انتهاء الاشتراك',
  })
  @IsOptional()
  @IsDateString()
  subscriptionExpiresAt?: string;

  @ApiPropertyOptional({
    description: 'إعدادات المؤسسة',
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}

