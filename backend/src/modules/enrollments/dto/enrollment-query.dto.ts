import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { EnrollmentStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class EnrollmentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'تصفية حسب الطالب',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  studentId?: string;

  @ApiPropertyOptional({
    description: 'تصفية حسب الدورة',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  courseId?: string;

  @ApiPropertyOptional({
    description: 'تصفية حسب الحالة',
    enum: EnrollmentStatus,
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}

