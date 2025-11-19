import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseGradeListOptions, UseGradeListReturn } from './types';

export const useGradeList = (options: UseGradeListOptions = {}): UseGradeListReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['grades', options.filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => gradeService.list(options.filters),
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => gradeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: gradeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isRemoving,
  };
};
