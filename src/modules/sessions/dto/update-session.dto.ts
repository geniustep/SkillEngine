import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionStatus } from '@prisma/client';

export class UpdateSessionDto {
  @ApiPropertyOptional({
    description: 'عنوان الجلسة',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'وصف الجلسة',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'وقت البدء المجدول',
  })
  @IsOptional()
  @IsDateString({}, { message: 'تاريخ البدء غير صالح' })
  scheduledStart?: Date;

  @ApiPropertyOptional({
    description: 'وقت الانتهاء المجدول',
  })
  @IsOptional()
  @IsDateString({}, { message: 'تاريخ الانتهاء غير صالح' })
  scheduledEnd?: Date;

  @ApiPropertyOptional({
    description: 'حالة الجلسة',
    enum: SessionStatus,
  })
  @IsOptional()
  @IsEnum(SessionStatus, { message: 'الحالة غير صالحة' })
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'الحد الأقصى للمشاركين',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'الحد الأقصى يجب أن يكون 1 على الأقل' })
  maxParticipants?: number;

  @ApiPropertyOptional({
    description: 'بيانات إضافية',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

