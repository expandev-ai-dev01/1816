import type { GradeListParams, Grade } from '../../types';

export interface UseGradeListOptions {
  filters?: GradeListParams;
}

export interface UseGradeListReturn {
  data: Grade[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  create: (data: any) => Promise<Grade>;
  update: (params: { id: number; data: any }) => Promise<Grade>;
  remove: (id: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
}
