import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurriculumType } from '@prisma/client';

class CurriculumContentDto {
  @ApiPropertyOptional({ description: 'رابط الفيديو' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'رابط المستند' })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiPropertyOptional({ description: 'المحتوى النصي' })
  @IsOptional()
  @IsString()
  textContent?: string;

  @ApiPropertyOptional({ description: 'بيانات الاختبار' })
  @IsOptional()
  @IsObject()
  quizData?: Record<string, unknown>;
}

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'عنوان العنصر',
    example: 'مقدمة في البرمجة',
  })
  @IsString()
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  title: string;

  @ApiPropertyOptional({
    description: 'وصف العنصر',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'نوع العنصر',
    enum: CurriculumType,
    example: 'lesson',
  })
  @IsEnum(CurriculumType, { message: 'النوع غير صالح' })
  @IsNotEmpty({ message: 'النوع مطلوب' })
  type: CurriculumType;

  @ApiPropertyOptional({
    description: 'معرف العنصر الأب (للعناصر الفرعية)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'معرف العنصر الأب غير صالح' })
  parentId?: string;

  @ApiPropertyOptional({
    description: 'ترتيب العنصر',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    description: 'المدة بالدقائق',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    description: 'محتوى العنصر',
    type: CurriculumContentDto,
  })
  @IsOptional()
  @IsObject()
  content?: CurriculumContentDto;

  @ApiPropertyOptional({
    description: 'متاح مجاناً',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({
    description: 'منشور',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

