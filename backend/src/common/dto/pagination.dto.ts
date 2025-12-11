import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsIn } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'رقم الصفحة', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'عدد العناصر في الصفحة', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'الحقل المراد الترتيب حسبه' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'اتجاه الترتيب', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'نص البحث' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginationMeta {
  @ApiProperty({ description: 'رقم الصفحة الحالية' })
  page: number;

  @ApiProperty({ description: 'عدد العناصر في الصفحة' })
  limit: number;

  @ApiProperty({ description: 'إجمالي عدد العناصر' })
  total: number;

  @ApiProperty({ description: 'إجمالي عدد الصفحات' })
  totalPages: number;

  @ApiProperty({ description: 'هل يوجد صفحة تالية' })
  hasNext: boolean;

  @ApiProperty({ description: 'هل يوجد صفحة سابقة' })
  hasPrev: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

