import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsBoolean,
  MaxLength,
  Min,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

class CourseMetadataDto {
  @ApiPropertyOptional({ description: 'المتطلبات السابقة', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @ApiPropertyOptional({ description: 'مخرجات التعلم', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningOutcomes?: string[];

  @ApiPropertyOptional({ description: 'الجمهور المستهدف' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'المتطلبات التقنية', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

export class CreateCourseDto {
  @ApiProperty({
    description: 'عنوان الدورة',
    example: 'أساسيات البرمجة بلغة Python',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'عنوان الدورة مطلوب' })
  @MaxLength(200, { message: 'العنوان يجب ألا يتجاوز 200 حرف' })
  title: string;

  @ApiProperty({
    description: 'وصف الدورة',
    example: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة Python',
  })
  @IsString()
  @IsNotEmpty({ message: 'وصف الدورة مطلوب' })
  description: string;

  @ApiPropertyOptional({
    description: 'وصف مختصر',
    example: 'دورة شاملة لتعلم Python',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'الوصف المختصر يجب ألا يتجاوز 200 حرف' })
  shortDescription?: string;

  @ApiProperty({
    description: 'معرف المدرب',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف المدرب غير صالح' })
  @IsNotEmpty({ message: 'معرف المدرب مطلوب' })
  instructorId: string;

  @ApiPropertyOptional({
    description: 'مستوى الدورة',
    enum: CourseLevel,
    default: 'beginner',
  })
  @IsOptional()
  @IsEnum(CourseLevel, { message: 'المستوى غير صالح' })
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'سعر الدورة',
    example: 199.99,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
  price?: number;

  @ApiPropertyOptional({
    description: 'السعر بعد الخصم',
    example: 149.99,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'مدة الدورة بالدقائق',
    example: 600,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'المدة يجب أن تكون رقماً' })
  @Min(0, { message: 'المدة لا يمكن أن تكون سالبة' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'التصنيف',
    example: 'programming',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'اللغة',
    example: 'ar',
    default: 'ar',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'دورة مميزة',
    default: false,
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

