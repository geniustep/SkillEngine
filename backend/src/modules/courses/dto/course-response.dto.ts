import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseStatus, CourseLevel } from '@prisma/client';

class InstructorInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  avatar?: string;
}

export class CourseResponseDto {
  @ApiProperty({ description: 'معرف الدورة' })
  id: string;

  @ApiProperty({ description: 'عنوان الدورة' })
  title: string;

  @ApiProperty({ description: 'الرابط المختصر' })
  slug: string;

  @ApiPropertyOptional({ description: 'وصف مختصر' })
  shortDescription?: string;

  @ApiProperty({ description: 'وصف الدورة' })
  description: string;

  @ApiPropertyOptional({ description: 'الصورة المصغرة' })
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'صورة الغلاف' })
  coverImage?: string;

  @ApiPropertyOptional({ description: 'التصنيف' })
  category?: string;

  @ApiProperty({ description: 'المستوى', enum: CourseLevel })
  level: CourseLevel;

  @ApiProperty({ description: 'اللغة' })
  language: string;

  @ApiProperty({ description: 'السعر' })
  price: number;

  @ApiPropertyOptional({ description: 'السعر بعد الخصم' })
  discountPrice?: number;

  @ApiProperty({ description: 'المدة بالدقائق' })
  duration: number;

  @ApiProperty({ description: 'الحالة', enum: CourseStatus })
  status: CourseStatus;

  @ApiProperty({ description: 'دورة مميزة' })
  featured: boolean;

  @ApiProperty({ description: 'بيانات المدرب', type: InstructorInfo })
  instructor: InstructorInfo;

  @ApiPropertyOptional({ description: 'عدد المسجلين' })
  enrollmentsCount?: number;

  @ApiPropertyOptional({ description: 'التقييم' })
  rating?: number;

  @ApiPropertyOptional({ description: 'عدد التقييمات' })
  reviewCount?: number;

  @ApiPropertyOptional({ description: 'تاريخ النشر' })
  publishedAt?: Date;

  @ApiProperty({ description: 'تاريخ الإنشاء' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث' })
  updatedAt: Date;
}

