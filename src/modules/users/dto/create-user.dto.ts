import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({
    description: 'الاسم الأول',
    example: 'أحمد',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأول يجب ألا يتجاوز 50 حرف' })
  firstName: string;

  @ApiProperty({
    description: 'الاسم الأخير',
    example: 'محمد',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  @MinLength(2, { message: 'الاسم الأخير يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأخير يجب ألا يتجاوز 50 حرف' })
  lastName: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: UserRole,
    example: 'student',
  })
  @IsEnum(UserRole, { message: 'الدور غير صالح' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'رقم الهاتف',
    example: '+966501234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'نبذة عن المستخدم',
    example: 'مطور برمجيات متخصص في تطوير الويب',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'النبذة يجب ألا تتجاوز 500 حرف' })
  bio?: string;
}

