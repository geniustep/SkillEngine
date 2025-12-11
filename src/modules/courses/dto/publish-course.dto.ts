import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CourseStatus } from '@prisma/client';

export class PublishCourseDto {
  @ApiProperty({
    description: 'حالة الدورة',
    enum: CourseStatus,
    example: 'published',
  })
  @IsEnum(CourseStatus, { message: 'الحالة غير صالحة' })
  @IsNotEmpty({ message: 'الحالة مطلوبة' })
  status: CourseStatus;
}

