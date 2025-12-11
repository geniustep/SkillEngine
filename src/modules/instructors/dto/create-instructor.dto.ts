import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstructorDto {
  @ApiProperty({
    description: 'معرف المستخدم',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف المستخدم غير صالح' })
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب' })
  userId: string;

  @ApiPropertyOptional({
    description: 'اللقب (دكتور، مهندس، ...)',
    example: 'دكتور',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'السيرة الذاتية',
    example: 'خبير في تطوير البرمجيات مع 10 سنوات من الخبرة',
  })
  @IsString()
  @IsNotEmpty({ message: 'السيرة الذاتية مطلوبة' })
  biography: string;

  @ApiPropertyOptional({
    description: 'التخصصات',
    type: [String],
    example: ['برمجة', 'تطوير ويب'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @ApiPropertyOptional({
    description: 'الخبرات',
    type: [String],
    example: ['JavaScript', 'Python', 'React'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @ApiPropertyOptional({
    description: 'الشهادات',
    type: 'array',
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

