import type { GradeFormData, Grade } from '../../types';

export interface GradeFormProps {
  initialData?: Grade;
  onSubmit: (data: GradeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
