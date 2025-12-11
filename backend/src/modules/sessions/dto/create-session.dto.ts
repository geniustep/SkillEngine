import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LivePlatform } from '@prisma/client';

export class CreateSessionDto {
  @ApiProperty({
    description: 'عنوان الجلسة',
    example: 'مقدمة في البرمجة - الجلسة الأولى',
  })
  @IsString()
  @IsNotEmpty({ message: 'عنوان الجلسة مطلوب' })
  title: string;

  @ApiPropertyOptional({
    description: 'وصف الجلسة',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'معرف الدورة',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'معرف الدورة غير صالح' })
  courseId?: string;

  @ApiProperty({
    description: 'معرف المدرب',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف المدرب غير صالح' })
  @IsNotEmpty({ message: 'معرف المدرب مطلوب' })
  instructorId: string;

  @ApiProperty({
    description: 'وقت البدء المجدول',
    example: '2025-12-15T10:00:00Z',
  })
  @IsDateString({}, { message: 'تاريخ البدء غير صالح' })
  @IsNotEmpty({ message: 'وقت البدء مطلوب' })
  scheduledStart: Date;

  @ApiProperty({
    description: 'وقت الانتهاء المجدول',
    example: '2025-12-15T12:00:00Z',
  })
  @IsDateString({}, { message: 'تاريخ الانتهاء غير صالح' })
  @IsNotEmpty({ message: 'وقت الانتهاء مطلوب' })
  scheduledEnd: Date;

  @ApiPropertyOptional({
    description: 'منصة البث',
    enum: LivePlatform,
    default: 'daily',
  })
  @IsOptional()
  @IsEnum(LivePlatform, { message: 'المنصة غير صالحة' })
  platform?: LivePlatform;

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

