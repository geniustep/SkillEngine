import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from '@/lib/types/user.types';
import type { PaginatedResponse } from '@/lib/types/common.types';

export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>(
      endpoints.users.list,
      { params }
    );
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(endpoints.users.get(id));
    return data;
  },

  createUser: async (input: CreateUserInput): Promise<User> => {
    const { data } = await apiClient.post<User>(endpoints.users.create, input);
    return data;
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<User> => {
    const { data } = await apiClient.patch<User>(
      endpoints.users.update(id),
      input
    );
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.users.delete(id));
  },
};
