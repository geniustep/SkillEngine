import { BaseEntity } from './common.types';
import { Course } from './course.types';
import { User } from './user.types';

export type SessionStatus =
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';
export type LivePlatform = 'daily' | 'bbb' | 'zoom' | 'teams';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Session extends BaseEntity {
  courseId: string;
  course?: Course;
  instructorId: string;
  instructor?: User;
  title: string;
  description?: string;
  scheduledAt: string;
  endTime?: string;
  duration: number; // minutes
  status: SessionStatus;
  platform: LivePlatform;
  roomUrl?: string;
  roomId?: string;
  recordingUrl?: string;
  maxParticipants?: number;
  attendees?: Attendance[];
  attendeeCount?: number;
  metadata?: Record<string, unknown>;
}

export interface Attendance extends BaseEntity {
  sessionId: string;
  session?: Session;
  userId: string;
  user?: User;
  joinedAt?: string;
  leftAt?: string;
  duration?: number; // minutes
  status: AttendanceStatus;
  notes?: string;
}

export interface CreateSessionInput {
  courseId: string;
  instructorId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  platform: LivePlatform;
  maxParticipants?: number;
}

export interface UpdateSessionInput {
  title?: string;
  description?: string;
  scheduledAt?: string;
  duration?: number;
  status?: SessionStatus;
  maxParticipants?: number;
}
