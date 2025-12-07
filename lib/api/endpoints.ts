export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    bulk: '/users/bulk',
    enrollments: (id: string) => `/users/${id}/enrollments`,
    progress: (id: string) => `/users/${id}/progress`,
    activity: (id: string) => `/users/${id}/activity`,
  },

  courses: {
    list: '/courses',
    create: '/courses',
    get: (id: string) => `/courses/${id}`,
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
    publish: (id: string) => `/courses/${id}/publish`,
    curriculum: (id: string) => `/courses/${id}/curriculum`,
    students: (id: string) => `/courses/${id}/students`,
    sessions: (id: string) => `/courses/${id}/sessions`,
    materials: (id: string) => `/courses/${id}/materials`,
    analytics: (id: string) => `/courses/${id}/analytics`,
  },

  modules: {
    list: (courseId: string) => `/courses/${courseId}/modules`,
    create: (courseId: string) => `/courses/${courseId}/modules`,
    get: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}`,
    update: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}`,
    delete: (courseId: string, moduleId: string) =>
      `/courses/${courseId}/modules/${moduleId}`,
    reorder: (courseId: string) => `/courses/${courseId}/modules/reorder`,
  },

  lessons: {
    list: (moduleId: string) => `/modules/${moduleId}/lessons`,
    create: (moduleId: string) => `/modules/${moduleId}/lessons`,
    get: (moduleId: string, lessonId: string) =>
      `/modules/${moduleId}/lessons/${lessonId}`,
    update: (moduleId: string, lessonId: string) =>
      `/modules/${moduleId}/lessons/${lessonId}`,
    delete: (moduleId: string, lessonId: string) =>
      `/modules/${moduleId}/lessons/${lessonId}`,
    reorder: (moduleId: string) => `/modules/${moduleId}/lessons/reorder`,
  },

  sessions: {
    list: '/sessions',
    create: '/sessions',
    get: (id: string) => `/sessions/${id}`,
    update: (id: string) => `/sessions/${id}`,
    delete: (id: string) => `/sessions/${id}`,
    start: (id: string) => `/sessions/${id}/start`,
    end: (id: string) => `/sessions/${id}/end`,
    attendance: (id: string) => `/sessions/${id}/attendance`,
    recording: (id: string) => `/sessions/${id}/recording`,
  },

  instructors: {
    list: '/instructors',
    create: '/instructors',
    get: (id: string) => `/instructors/${id}`,
    update: (id: string) => `/instructors/${id}`,
    delete: (id: string) => `/instructors/${id}`,
    availability: (id: string) => `/instructors/${id}/availability`,
    schedule: (id: string) => `/instructors/${id}/schedule`,
    performance: (id: string) => `/instructors/${id}/performance`,
    payroll: (id: string) => `/instructors/${id}/payroll`,
  },

  enrollments: {
    list: '/enrollments',
    create: '/enrollments',
    get: (id: string) => `/enrollments/${id}`,
    update: (id: string) => `/enrollments/${id}`,
    delete: (id: string) => `/enrollments/${id}`,
    progress: (id: string) => `/enrollments/${id}/progress`,
    certificate: (id: string) => `/enrollments/${id}/certificate`,
  },

  analytics: {
    dashboard: '/analytics/dashboard',
    students: '/analytics/students',
    courses: '/analytics/courses',
    revenue: '/analytics/revenue',
    sessions: '/analytics/sessions',
    trends: '/analytics/trends',
  },

  reports: {
    list: '/reports',
    generate: '/reports/generate',
    export: '/reports/export',
    attendance: '/reports/attendance',
    completion: '/reports/completion',
    engagement: '/reports/engagement',
    financial: '/reports/financial',
  },

  integrations: {
    health: '/integrations/health',
    odoo: {
      sync: '/integrations/odoo/sync',
      status: '/integrations/odoo/status',
      test: '/integrations/odoo/test',
    },
    live: {
      daily: '/integrations/live/daily',
      bbb: '/integrations/live/bbb',
      zoom: '/integrations/live/zoom',
      teams: '/integrations/live/teams',
    },
    storage: {
      upload: '/integrations/storage/upload',
      delete: '/integrations/storage/delete',
    },
  },

  notifications: {
    list: '/notifications',
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
    preferences: '/notifications/preferences',
  },

  settings: {
    general: '/settings/general',
    appearance: '/settings/appearance',
    localization: '/settings/localization',
    notifications: '/settings/notifications',
    integrations: '/settings/integrations',
    roles: '/settings/roles',
  },

  tenant: {
    current: '/tenant',
    list: '/tenant/list',
    switch: (id: string) => `/tenant/switch/${id}`,
    settings: '/tenant/settings',
  },
} as const;
