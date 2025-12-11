import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

interface OptimisticMutationOptions<TData, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  onMutate?: (variables: TVariables) => TContext | Promise<TContext>;
  updateCache: (oldData: any, variables: TVariables) => any;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (error: Error, variables: TVariables, context: TContext) => void;
}

/**
 * Custom hook for optimistic mutations with automatic cache updates
 */
export function useOptimisticMutation<TData, TVariables, TContext = unknown>({
  mutationFn,
  queryKey,
  updateCache,
  successMessage = 'تمت العملية بنجاح',
  errorMessage = 'حدث خطأ أثناء العملية',
  onMutate,
  onSuccess,
  onError,
}: OptimisticMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (oldData: any) =>
        updateCache(oldData, variables)
      );

      // Call custom onMutate if provided
      const customContext = onMutate ? await onMutate(variables) : undefined;

      // Return context object with snapshotted value
      return { previousData, customContext } as TContext;
    },
    onSuccess: (data, variables, context: any) => {
      toast.success(successMessage);
      onSuccess?.(data, variables, context?.customContext);
    },
    onError: (error: Error, variables, context: any) => {
      // Rollback to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(errorMessage);
      onError?.(error, variables, context?.customContext);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook for optimistic create operations
 */
export function useOptimisticCreate<TData, TVariables extends object>(
  options: Omit<OptimisticMutationOptions<TData, TVariables, any>, 'updateCache'> & {
    tempIdField?: string;
  }
) {
  const { tempIdField = 'id', ...rest } = options;

  return useOptimisticMutation({
    ...rest,
    updateCache: (oldData, variables) => {
      if (!oldData?.data) return oldData;

      const tempItem = {
        ...variables,
        [tempIdField]: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...oldData,
        data: [tempItem, ...oldData.data],
        meta: {
          ...oldData.meta,
          total: (oldData.meta?.total || 0) + 1,
        },
      };
    },
    successMessage: options.successMessage || 'تم الإنشاء بنجاح',
  });
}

/**
 * Hook for optimistic update operations
 */
export function useOptimisticUpdate<TData, TVariables extends { id: string }>(
  options: Omit<OptimisticMutationOptions<TData, TVariables, any>, 'updateCache'>
) {
  return useOptimisticMutation({
    ...options,
    updateCache: (oldData, variables) => {
      if (!oldData?.data) return oldData;

      return {
        ...oldData,
        data: oldData.data.map((item: any) =>
          item.id === variables.id ? { ...item, ...variables } : item
        ),
      };
    },
    successMessage: options.successMessage || 'تم التحديث بنجاح',
  });
}

/**
 * Hook for optimistic delete operations
 */
export function useOptimisticDelete<TData>(
  options: Omit<OptimisticMutationOptions<TData, string, any>, 'updateCache'>
) {
  return useOptimisticMutation({
    ...options,
    updateCache: (oldData, id) => {
      if (!oldData?.data) return oldData;

      return {
        ...oldData,
        data: oldData.data.filter((item: any) => item.id !== id),
        meta: {
          ...oldData.meta,
          total: Math.max(0, (oldData.meta?.total || 0) - 1),
        },
      };
    },
    successMessage: options.successMessage || 'تم الحذف بنجاح',
  });
}
