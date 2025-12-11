import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel, CourseStatus } from '@prisma/client';

class CourseMetadataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningOutcomes?: string[];

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'عنوان الدورة',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'العنوان يجب ألا يتجاوز 200 حرف' })
  title?: string;

  @ApiPropertyOptional({
    description: 'وصف الدورة',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'وصف مختصر',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'الوصف المختصر يجب ألا يتجاوز 200 حرف' })
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'مستوى الدورة',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel, { message: 'المستوى غير صالح' })
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'حالة الدورة',
    enum: CourseStatus,
  })
  @IsOptional()
  @IsEnum(CourseStatus, { message: 'الحالة غير صالحة' })
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'سعر الدورة',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
  price?: number;

  @ApiPropertyOptional({
    description: 'السعر بعد الخصم',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'مدة الدورة بالدقائق',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'المدة يجب أن تكون رقماً' })
  @Min(0, { message: 'المدة لا يمكن أن تكون سالبة' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'التصنيف',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'اللغة',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'دورة مميزة',
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'رابط الصورة المصغرة',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'رابط صورة الغلاف',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'بيانات إضافية',
    type: CourseMetadataDto,
  })
  @IsOptional()
  @IsObject()
  metadata?: CourseMetadataDto;
}

