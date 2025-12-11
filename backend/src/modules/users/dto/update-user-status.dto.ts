import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'حالة المستخدم',
    enum: UserStatus,
    example: 'active',
  })
  @IsEnum(UserStatus, { message: 'الحالة غير صالحة' })
  @IsNotEmpty({ message: 'الحالة مطلوبة' })
  status: UserStatus;
}

