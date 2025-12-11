import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsObject } from 'class-validator';
import { NotificationType, NotificationPriority } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'معرف المستخدم المستلم',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'معرف المستخدم غير صالح' })
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب' })
  userId: string;

  @ApiProperty({
    description: 'نوع الإشعار',
    enum: NotificationType,
  })
  @IsEnum(NotificationType, { message: 'نوع الإشعار غير صالح' })
  @IsNotEmpty({ message: 'نوع الإشعار مطلوب' })
  type: NotificationType;

  @ApiProperty({
    description: 'عنوان الإشعار',
    example: 'تم التسجيل بنجاح',
  })
  @IsString()
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  title: string;

  @ApiProperty({
    description: 'محتوى الإشعار',
    example: 'تم تسجيلك في دورة أساسيات البرمجة',
  })
  @IsString()
  @IsNotEmpty({ message: 'المحتوى مطلوب' })
  message: string;

  @ApiPropertyOptional({
    description: 'أولوية الإشعار',
    enum: NotificationPriority,
    default: 'medium',
  })
  @IsOptional()
  @IsEnum(NotificationPriority, { message: 'الأولوية غير صالحة' })
  priority?: NotificationPriority;

  @ApiPropertyOptional({
    description: 'بيانات إضافية',
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}

