import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { DashboardStats } from '@/lib/types/analytics.types';

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>(
      endpoints.analytics.dashboard
    );
    return data;
  },
};
