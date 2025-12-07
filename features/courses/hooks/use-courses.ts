import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/courses-api';
import { toast } from 'sonner';

export function useCourses(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => coursesApi.getCourses({ page, limit }),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getCourse(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('تم إنشاء الدورة بنجاح');
    },
    onError: () => {
      toast.error('فشل إنشاء الدورة');
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      coursesApi.updateCourse(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
      toast.success('تم تحديث الدورة بنجاح');
    },
    onError: () => {
      toast.error('فشل تحديث الدورة');
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('تم حذف الدورة بنجاح');
    },
    onError: () => {
      toast.error('فشل حذف الدورة');
    },
  });
}
