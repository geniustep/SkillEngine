import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'معرف المستخدم' })
  id: string;

  @ApiProperty({ description: 'البريد الإلكتروني' })
  email: string;

  @ApiProperty({ description: 'الاسم الأول' })
  firstName: string;

  @ApiProperty({ description: 'الاسم الأخير' })
  lastName: string;

  @ApiPropertyOptional({ description: 'رقم الهاتف' })
  phone?: string;

  @ApiPropertyOptional({ description: 'صورة الملف الشخصي' })
  avatar?: string;

  @ApiProperty({ description: 'الدور', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'الحالة', enum: UserStatus })
  status: UserStatus;

  @ApiPropertyOptional({ description: 'نبذة عن المستخدم' })
  bio?: string;

  @ApiPropertyOptional({ description: 'آخر تسجيل دخول' })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'تاريخ الإنشاء' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'عدد التسجيلات' })
  enrollmentsCount?: number;
}

