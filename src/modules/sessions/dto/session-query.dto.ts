import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { SessionStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class SessionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'تصفية حسب الحالة',
    enum: SessionStatus,
  })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'تصفية حسب المدرب',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  instructorId?: string;

  @ApiPropertyOptional({
    description: 'تصفية حسب الدورة',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  courseId?: string;

  @ApiPropertyOptional({
    description: 'تاريخ البداية',
    example: '2025-12-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'تاريخ النهاية',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

