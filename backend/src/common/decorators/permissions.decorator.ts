import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Permission constants
export const Permission = {
  // Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_BULK: 'users:bulk',

  // Courses
  COURSES_VIEW: 'courses:view',
  COURSES_CREATE: 'courses:create',
  COURSES_EDIT: 'courses:edit',
  COURSES_DELETE: 'courses:delete',
  COURSES_PUBLISH: 'courses:publish',

  // Sessions
  SESSIONS_VIEW: 'sessions:view',
  SESSIONS_CREATE: 'sessions:create',
  SESSIONS_MANAGE: 'sessions:manage',
  SESSIONS_ATTENDANCE: 'sessions:attendance',

  // Instructors
  INSTRUCTORS_VIEW: 'instructors:view',
  INSTRUCTORS_CREATE: 'instructors:create',
  INSTRUCTORS_EDIT: 'instructors:edit',
  INSTRUCTORS_DELETE: 'instructors:delete',

  // Content
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',

  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  ANALYTICS_ADVANCED: 'analytics:advanced',

  // Enrollments
  ENROLLMENTS_VIEW: 'enrollments:view',
  ENROLLMENTS_CREATE: 'enrollments:create',
  ENROLLMENTS_EDIT: 'enrollments:edit',
  ENROLLMENTS_DELETE: 'enrollments:delete',

  // Notifications
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_CREATE: 'notifications:create',

  // Tenants
  TENANTS_VIEW: 'tenants:view',
  TENANTS_CREATE: 'tenants:create',
  TENANTS_EDIT: 'tenants:edit',
  TENANTS_DELETE: 'tenants:delete',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  SETTINGS_INTEGRATIONS: 'settings:integrations',
  SETTINGS_ROLES: 'settings:roles',

  // System
  SYSTEM_HEALTH: 'system:health',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_AUDIT: 'system:audit',
  SYSTEM_MAINTENANCE: 'system:maintenance',
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];

// Role-based permissions mapping
export const RolePermissions: Record<string, string[]> = {
  super_admin: Object.values(Permission),
  admin: [
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    Permission.COURSES_VIEW,
    Permission.COURSES_CREATE,
    Permission.COURSES_EDIT,
    Permission.COURSES_DELETE,
    Permission.COURSES_PUBLISH,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_MANAGE,
    Permission.SESSIONS_ATTENDANCE,
    Permission.INSTRUCTORS_VIEW,
    Permission.INSTRUCTORS_CREATE,
    Permission.INSTRUCTORS_EDIT,
    Permission.INSTRUCTORS_DELETE,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.ENROLLMENTS_VIEW,
    Permission.ENROLLMENTS_CREATE,
    Permission.ENROLLMENTS_EDIT,
    Permission.ENROLLMENTS_DELETE,
    Permission.NOTIFICATIONS_VIEW,
    Permission.NOTIFICATIONS_CREATE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
  ],
  pedagogic_manager: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.COURSES_CREATE,
    Permission.COURSES_EDIT,
    Permission.COURSES_PUBLISH,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_MANAGE,
    Permission.INSTRUCTORS_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.ENROLLMENTS_VIEW,
    Permission.ENROLLMENTS_CREATE,
    Permission.NOTIFICATIONS_VIEW,
  ],
  content_manager: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.COURSES_CREATE,
    Permission.COURSES_EDIT,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
    Permission.NOTIFICATIONS_VIEW,
  ],
  instructor: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.COURSES_EDIT,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_MANAGE,
    Permission.SESSIONS_ATTENDANCE,
    Permission.INSTRUCTORS_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.ENROLLMENTS_VIEW,
    Permission.NOTIFICATIONS_VIEW,
  ],
  student: [
    Permission.COURSES_VIEW,
    Permission.SESSIONS_VIEW,
    Permission.INSTRUCTORS_VIEW,
    Permission.ENROLLMENTS_VIEW,
    Permission.NOTIFICATIONS_VIEW,
  ],
  viewer: [
    Permission.COURSES_VIEW,
    Permission.SESSIONS_VIEW,
    Permission.INSTRUCTORS_VIEW,
  ],
};

