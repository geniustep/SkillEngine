import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus, LivePlatform } from '@prisma/client';

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

class CourseInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;
}

export class SessionResponseDto {
  @ApiProperty({ description: 'معرف الجلسة' })
  id: string;

  @ApiProperty({ description: 'عنوان الجلسة' })
  title: string;

  @ApiPropertyOptional({ description: 'وصف الجلسة' })
  description?: string;

  @ApiPropertyOptional({ description: 'معرف الدورة' })
  courseId?: string;

  @ApiPropertyOptional({ description: 'بيانات الدورة', type: CourseInfo })
  course?: CourseInfo;

  @ApiProperty({ description: 'معرف المدرب' })
  instructorId: string;

  @ApiProperty({ description: 'بيانات المدرب', type: InstructorInfo })
  instructor: InstructorInfo;

  @ApiProperty({ description: 'وقت البدء المجدول' })
  scheduledStart: Date;

  @ApiProperty({ description: 'وقت الانتهاء المجدول' })
  scheduledEnd: Date;

  @ApiPropertyOptional({ description: 'وقت البدء الفعلي' })
  actualStart?: Date;

  @ApiPropertyOptional({ description: 'وقت الانتهاء الفعلي' })
  actualEnd?: Date;

  @ApiProperty({ description: 'حالة الجلسة', enum: SessionStatus })
  status: SessionStatus;

  @ApiProperty({ description: 'منصة البث', enum: LivePlatform })
  platform: LivePlatform;

  @ApiPropertyOptional({ description: 'رابط الاجتماع' })
  meetingUrl?: string;

  @ApiPropertyOptional({ description: 'الحد الأقصى للمشاركين' })
  maxParticipants?: number;

  @ApiProperty({ description: 'عدد المشاركين الحاليين' })
  currentParticipants: number;

  @ApiPropertyOptional({ description: 'رابط التسجيل' })
  recordingUrl?: string;

  @ApiProperty({ description: 'تاريخ الإنشاء' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث' })
  updatedAt: Date;
}

