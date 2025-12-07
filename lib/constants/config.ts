export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Academy LMS Admin',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  },
  features: {
    realTime: process.env.NEXT_PUBLIC_FEATURE_REAL_TIME === 'true',
    advancedAnalytics:
      process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ADVANCED === 'true',
  },
  pusher: {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
} as const;
