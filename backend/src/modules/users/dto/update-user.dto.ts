import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'البريد الإلكتروني',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email?: string;

  @ApiPropertyOptional({
    description: 'الاسم الأول',
    example: 'أحمد',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأول يجب ألا يتجاوز 50 حرف' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'الاسم الأخير',
    example: 'محمد',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'الاسم الأخير يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأخير يجب ألا يتجاوز 50 حرف' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'رقم الهاتف',
    example: '+966501234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'رابط صورة الملف الشخصي',
    example: 'https://cdn.example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'رابط الصورة غير صالح' })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'نبذة عن المستخدم',
    example: 'مطور برمجيات متخصص في تطوير الويب',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'النبذة يجب ألا تتجاوز 500 حرف' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'دور المستخدم',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'الدور غير صالح' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'حالة المستخدم',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'الحالة غير صالحة' })
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'العنوان',
    example: 'شارع الملك فهد',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'المدينة',
    example: 'الرياض',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'الدولة',
    example: 'المملكة العربية السعودية',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'الرمز البريدي',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;
}

