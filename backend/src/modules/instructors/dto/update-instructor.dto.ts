import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInstructorDto {
  @ApiPropertyOptional({
    description: 'اللقب',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'السيرة الذاتية',
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({
    description: 'التخصصات',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @ApiPropertyOptional({
    description: 'الخبرات',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @ApiPropertyOptional({
    description: 'الشهادات',
  })
  @IsOptional()
  @IsArray()
  certifications?: Record<string, unknown>[];

  @ApiPropertyOptional({
    description: 'روابط التواصل الاجتماعي',
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'السعر بالساعة',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'أوقات التوفر',
  })
  @IsOptional()
  @IsObject()
  availability?: Record<string, unknown>;
}

