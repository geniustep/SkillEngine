import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from '@/lib/types/course.types';
import type { PaginatedResponse } from '@/lib/types/common.types';

export const coursesApi = {
  getCourses: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Course>> => {
    const { data } = await apiClient.get<PaginatedResponse<Course>>(
      endpoints.courses.list,
      { params }
    );
    return data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<Course>(endpoints.courses.get(id));
    return data;
  },

  createCourse: async (input: CreateCourseInput): Promise<Course> => {
    const { data } = await apiClient.post<Course>(
      endpoints.courses.create,
      input
    );
    return data;
  },

  updateCourse: async (
    id: string,
    input: UpdateCourseInput
  ): Promise<Course> => {
    const { data } = await apiClient.patch<Course>(
      endpoints.courses.update(id),
      input
    );
    return data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.courses.delete(id));
  },

  publishCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.post<Course>(
      endpoints.courses.publish(id)
    );
    return data;
  },
};
