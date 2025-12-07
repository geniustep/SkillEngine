import { Permission } from './permissions';

export const Role = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PEDAGOGIC_MANAGER: 'pedagogic_manager',
  CONTENT_MANAGER: 'content_manager',
  STAFF: 'staff',
  VIEWER: 'viewer',
} as const;

export type RoleValue = (typeof Role)[keyof typeof Role];

export const rolePermissions: Record<RoleValue, string[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.COURSES_VIEW,
    Permission.COURSES_CREATE,
    Permission.COURSES_EDIT,
    Permission.COURSES_PUBLISH,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_MANAGE,
    Permission.SESSIONS_ATTENDANCE,
    Permission.INSTRUCTORS_VIEW,
    Permission.INSTRUCTORS_CREATE,
    Permission.INSTRUCTORS_EDIT,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_CREATE,
    Permission.REPORTS_EXPORT,
    Permission.SETTINGS_VIEW,
  ],
  [Role.PEDAGOGIC_MANAGER]: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.COURSES_EDIT,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_MANAGE,
    Permission.SESSIONS_ATTENDANCE,
    Permission.INSTRUCTORS_VIEW,
    Permission.CONTENT_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.REPORTS_VIEW,
  ],
  [Role.CONTENT_MANAGER]: [
    Permission.COURSES_VIEW,
    Permission.COURSES_EDIT,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
  ],
  [Role.STAFF]: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_ATTENDANCE,
    Permission.INSTRUCTORS_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.REPORTS_VIEW,
  ],
  [Role.VIEWER]: [
    Permission.USERS_VIEW,
    Permission.COURSES_VIEW,
    Permission.SESSIONS_VIEW,
    Permission.ANALYTICS_VIEW,
  ],
};

export const roleLabels: Record<RoleValue, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.ADMIN]: 'Admin',
  [Role.PEDAGOGIC_MANAGER]: 'Pedagogic Manager',
  [Role.CONTENT_MANAGER]: 'Content Manager',
  [Role.STAFF]: 'Staff',
  [Role.VIEWER]: 'Viewer',
};
