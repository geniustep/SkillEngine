import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { CourseStatus, CourseLevel } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class CourseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'تصفية حسب الحالة',
    enum: CourseStatus,
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'تصفية حسب المستوى',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'تصفية حسب التصنيف',
  })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'تصفية حسب المدرب',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  instructorId?: string;

  @ApiPropertyOptional({
    description: 'تصفية حسب الدورات المميزة',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;
}

