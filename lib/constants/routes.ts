export const routes = {
  // Auth
  login: '/login',
  ssoCallback: '/sso-callback',
  unauthorized: '/unauthorized',

  // Dashboard
  home: '/',
  dashboard: '/',

  // Analytics
  analytics: {
    root: '/analytics',
    students: '/analytics/students',
    courses: '/analytics/courses',
    revenue: '/analytics/revenue',
    live: '/analytics/live',
  },

  // Users
  users: {
    root: '/users',
    new: '/users/new',
    view: (id: string) => `/users/${id}`,
    edit: (id: string) => `/users/${id}/edit`,
    enrollments: (id: string) => `/users/${id}/enrollments`,
    progress: (id: string) => `/users/${id}/progress`,
    activity: (id: string) => `/users/${id}/activity`,
    bulkActions: '/users/bulk-actions',
  },

  // Courses
  courses: {
    root: '/courses',
    new: '/courses/new',
    view: (id: string) => `/courses/${id}`,
    edit: (id: string) => `/courses/${id}/edit`,
    curriculum: (id: string) => `/courses/${id}/curriculum`,
    students: (id: string) => `/courses/${id}/students`,
    sessions: (id: string) => `/courses/${id}/sessions`,
    materials: (id: string) => `/courses/${id}/materials`,
    settings: (id: string) => `/courses/${id}/settings`,
  },

  // Sessions
  sessions: {
    root: '/sessions',
    new: '/sessions/new',
    schedule: '/sessions/schedule',
    view: (id: string) => `/sessions/${id}`,
    edit: (id: string) => `/sessions/${id}/edit`,
    attendance: (id: string) => `/sessions/${id}/attendance`,
    recording: (id: string) => `/sessions/${id}/recording`,
    templates: '/sessions/templates',
  },

  // Instructors
  instructors: {
    root: '/instructors',
    new: '/instructors/new',
    view: (id: string) => `/instructors/${id}`,
    edit: (id: string) => `/instructors/${id}/edit`,
    schedule: (id: string) => `/instructors/${id}/schedule`,
    performance: (id: string) => `/instructors/${id}/performance`,
    payroll: (id: string) => `/instructors/${id}/payroll`,
    availability: '/instructors/availability',
  },

  // Content
  content: {
    videos: '/content/videos',
    documents: '/content/documents',
    quizzes: '/content/quizzes',
    library: '/content/library',
  },

  // Communications
  communications: {
    announcements: '/communications/announcements',
    notifications: '/communications/notifications',
    emailCampaigns: '/communications/email-campaigns',
    templates: '/communications/templates',
  },

  // Reports
  reports: {
    root: '/reports',
    attendance: '/reports/attendance',
    completion: '/reports/completion',
    engagement: '/reports/engagement',
    financial: '/reports/financial',
    custom: '/reports/custom',
    exports: '/reports/exports',
  },

  // Settings
  settings: {
    root: '/settings',
    general: '/settings/general',
    integrations: {
      root: '/settings/integrations',
      odoo: '/settings/integrations/odoo',
      livePlatforms: '/settings/integrations/live-platforms',
      storage: '/settings/integrations/storage',
      email: '/settings/integrations/email',
      sms: '/settings/integrations/sms',
    },
    roles: '/settings/roles',
    appearance: '/settings/appearance',
    localization: '/settings/localization',
    advanced: '/settings/advanced',
  },

  // System
  system: {
    health: '/system/health',
    logs: '/system/logs',
    audit: '/system/audit',
    backups: '/system/backups',
    maintenance: '/system/maintenance',
  },

  // Support
  support: {
    tickets: '/support/tickets',
    faq: '/support/faq',
    documentation: '/support/documentation',
  },
} as const;
