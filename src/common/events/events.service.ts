import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Event types for type safety
 */
export enum EventType {
  // User events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_STATUS_CHANGED = 'user.status.changed',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',

  // Course events
  COURSE_CREATED = 'course.created',
  COURSE_UPDATED = 'course.updated',
  COURSE_DELETED = 'course.deleted',
  COURSE_PUBLISHED = 'course.published',
  COURSE_UNPUBLISHED = 'course.unpublished',

  // Session events
  SESSION_CREATED = 'session.created',
  SESSION_STARTED = 'session.started',
  SESSION_ENDED = 'session.ended',
  SESSION_CANCELLED = 'session.cancelled',

  // Enrollment events
  ENROLLMENT_CREATED = 'enrollment.created',
  ENROLLMENT_COMPLETED = 'enrollment.completed',
  ENROLLMENT_PROGRESS_UPDATED = 'enrollment.progress.updated',

  // Notification events
  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_SENT = 'notification.sent',

  // System events
  SYSTEM_ERROR = 'system.error',
  SYSTEM_WARNING = 'system.warning',
}

/**
 * Base event payload interface
 */
export interface EventPayload<T = any> {
  type: EventType;
  timestamp: Date;
  tenantId: string;
  userId?: string;
  data: T;
  metadata?: Record<string, any>;
}

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Emit an event with payload
   */
  emit<T>(type: EventType, payload: Omit<EventPayload<T>, 'type' | 'timestamp'>): void {
    const fullPayload: EventPayload<T> = {
      type,
      timestamp: new Date(),
      ...payload,
    };

    this.eventEmitter.emit(type, fullPayload);

    // Also emit to wildcard listeners
    this.eventEmitter.emit('*', fullPayload);
  }

  /**
   * Emit user event
   */
  emitUserEvent(
    eventType: EventType,
    userId: string,
    tenantId: string,
    data: any,
    metadata?: Record<string, any>
  ): void {
    this.emit(eventType, {
      tenantId,
      userId,
      data,
      metadata,
    });
  }

  /**
   * Emit course event
   */
  emitCourseEvent(
    eventType: EventType,
    courseId: string,
    tenantId: string,
    userId: string,
    data: any
  ): void {
    this.emit(eventType, {
      tenantId,
      userId,
      data: { courseId, ...data },
    });
  }

  /**
   * Emit session event
   */
  emitSessionEvent(
    eventType: EventType,
    sessionId: string,
    tenantId: string,
    userId: string,
    data: any
  ): void {
    this.emit(eventType, {
      tenantId,
      userId,
      data: { sessionId, ...data },
    });
  }

  /**
   * Emit system event
   */
  emitSystemEvent(
    eventType: EventType,
    tenantId: string,
    error: Error | string,
    metadata?: Record<string, any>
  ): void {
    this.emit(eventType, {
      tenantId,
      data: {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      },
      metadata,
    });
  }
}
