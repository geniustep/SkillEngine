import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsObject,
  IsUrl,
} from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateTenantDto {
  @ApiProperty({
    description: 'اسم المؤسسة',
    example: 'أكاديمية التعليم',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم المؤسسة مطلوب' })
  name: string;

  @ApiPropertyOptional({
    description: 'النطاق المخصص',
    example: 'academy.example.com',
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

  @ApiProperty({
    description: 'معرف مالك المؤسسة',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف المالك غير صالح' })
  @IsNotEmpty({ message: 'معرف المالك مطلوب' })
  ownerId: string;

  @ApiPropertyOptional({
    description: 'خطة الاشتراك',
    enum: SubscriptionPlan,
    default: 'free',
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan, { message: 'خطة الاشتراك غير صالحة' })
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({
    description: 'إعدادات المؤسسة',
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}

