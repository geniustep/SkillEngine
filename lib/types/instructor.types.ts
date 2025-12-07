import { BaseEntity } from './common.types';
import { User } from './user.types';

export interface Instructor extends BaseEntity {
  userId: string;
  user?: User;
  bio?: string;
  expertise: string[];
  hourlyRate?: number;
  availability?: AvailabilitySlot[];
  rating?: number;
  totalRatings?: number;
  coursesCount?: number;
  studentsCount?: number;
  sessionsCount?: number;
  certifications?: Certification[];
  socialLinks?: SocialLinks;
  isVerified?: boolean;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface Certification extends BaseEntity {
  instructorId: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface CreateInstructorInput {
  userId: string;
  bio?: string;
  expertise: string[];
  hourlyRate?: number;
}

export interface UpdateInstructorInput {
  bio?: string;
  expertise?: string[];
  hourlyRate?: number;
  availability?: AvailabilitySlot[];
  socialLinks?: SocialLinks;
}
