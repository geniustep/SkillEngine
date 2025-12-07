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

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EXPORT: 'reports:export',

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

export type PermissionValue = (typeof Permission)[keyof typeof Permission];
