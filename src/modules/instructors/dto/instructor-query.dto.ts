import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class InstructorQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'تصفية حسب حالة التحقق',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'تصفية حسب التخصص',
  })
  @IsOptional()
  @IsString()
  specialization?: string;
}

