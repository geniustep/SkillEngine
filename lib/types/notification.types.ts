import { BaseEntity } from './common.types';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreference extends BaseEntity {
  userId: string;
  channels: NotificationChannel[];
  enrollmentUpdates: boolean;
  sessionReminders: boolean;
  courseUpdates: boolean;
  announcements: boolean;
  marketing: boolean;
}
