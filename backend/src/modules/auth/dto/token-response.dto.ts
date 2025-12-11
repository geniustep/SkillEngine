import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty({ description: 'معرف المستخدم' })
  id: string;

  @ApiProperty({ description: 'البريد الإلكتروني' })
  email: string;

  @ApiProperty({ description: 'الاسم الأول' })
  firstName: string;

  @ApiProperty({ description: 'الاسم الأخير' })
  lastName: string;

  @ApiProperty({ description: 'الدور', enum: ['student', 'instructor', 'admin', 'super_admin'] })
  role: string;

  @ApiProperty({ description: 'صورة الملف الشخصي', nullable: true })
  avatar: string | null;

  @ApiProperty({ description: 'معرف المؤسسة' })
  tenantId: string;
}

export class TokenResponseDto {
  @ApiProperty({
    description: 'رمز الوصول',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'رمز التجديد',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'مدة صلاحية الرمز بالثواني',
    example: 900,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'نوع الرمز',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'بيانات المستخدم',
    type: UserInfo,
  })
  user: UserInfo;
}

