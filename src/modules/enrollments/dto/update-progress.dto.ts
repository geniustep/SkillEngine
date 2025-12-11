import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProgressDto {
  @ApiProperty({
    description: 'نسبة التقدم (0-100)',
    minimum: 0,
    maximum: 100,
    example: 75,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'النسبة لا يمكن أن تكون أقل من 0' })
  @Max(100, { message: 'النسبة لا يمكن أن تتجاوز 100' })
  progress: number;

  @ApiPropertyOptional({
    description: 'قائمة الدروس المكتملة',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedLessons?: string[];
}

