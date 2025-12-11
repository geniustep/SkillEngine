import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
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
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsObject()
  quizData?: Record<string, unknown>;
}

export class UpdateCurriculumDto {
  @ApiPropertyOptional({
    description: 'عنوان العنصر',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'وصف العنصر',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'نوع العنصر',
    enum: CurriculumType,
  })
  @IsOptional()
  @IsEnum(CurriculumType, { message: 'النوع غير صالح' })
  type?: CurriculumType;

  @ApiPropertyOptional({
    description: 'معرف العنصر الأب',
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
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({
    description: 'منشور',
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

