import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'معرف الطالب',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف الطالب غير صالح' })
  @IsNotEmpty({ message: 'معرف الطالب مطلوب' })
  studentId: string;

  @ApiProperty({
    description: 'معرف الدورة',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف الدورة غير صالح' })
  @IsNotEmpty({ message: 'معرف الدورة مطلوب' })
  courseId: string;
}

