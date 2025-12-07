import { BaseEntity } from './common.types';
import { Course } from './course.types';
import { User } from './user.types';

export type EnrollmentStatus =
  | 'active'
  | 'completed'
  | 'dropped'
  | 'expired'
  | 'suspended';

export interface Enrollment extends BaseEntity {
  userId: string;
  user?: User;
  courseId: string;
  course?: Course;
  status: EnrollmentStatus;
  progress: number; // 0-100
  enrolledAt: string;
  completedAt?: string;
  expiresAt?: string;
  certificateId?: string;
  certificate?: Certificate;
  lastAccessedAt?: string;
}

export interface Certificate extends BaseEntity {
  enrollmentId: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl?: string;
}

export interface Progress extends BaseEntity {
  enrollmentId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  timeSpent?: number; // minutes
  score?: number;
}

export interface CreateEnrollmentInput {
  userId: string;
  courseId: string;
}
