import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class SetupDto {
  @ApiProperty({
    description: 'البريد الإلكتروني للمسؤول',
    example: 'admin@example.com',
  })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'Admin@123456',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  password: string;

  @ApiProperty({
    description: 'الاسم الأول',
    example: 'مدير',
  })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @ApiProperty({
    description: 'اسم العائلة',
    example: 'النظام',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  lastName: string;

  @ApiProperty({
    description: 'اسم المؤسسة',
    example: 'SkillEngine Academy',
    required: false,
  })
  @IsString()
  @IsOptional()
  organizationName?: string;
}


