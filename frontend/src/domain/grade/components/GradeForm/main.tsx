import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { GradeFormProps } from './types';
import type { GradeFormData } from '../../types';

const gradeSchema = z.object({
  studentName: z
    .string()
    .min(3, 'O nome do aluno deve ter no mínimo 3 caracteres')
    .max(100, 'O nome do aluno deve ter no máximo 100 caracteres'),
  subject: z
    .string()
    .min(2, 'A matéria deve ter no mínimo 2 caracteres')
    .max(100, 'A matéria deve ter no máximo 100 caracteres'),
  gradeValue: z
    .number()
    .min(0, 'A nota deve ser no mínimo 0')
    .max(100, 'A nota deve ser no máximo 100'),
});

export const GradeForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GradeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: initialData
      ? {
          studentName: initialData.studentName,
          subject: initialData.subject,
          gradeValue: initialData.gradeValue,
        }
      : {
          studentName: '',
          subject: '',
          gradeValue: 0,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Aluno
        </label>
        <input
          id="studentName"
          type="text"
          {...register('studentName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.studentName && (
          <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Matéria
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="gradeValue" className="block text-sm font-medium text-gray-700 mb-1">
          Nota
        </label>
        <input
          id="gradeValue"
          type="number"
          step="0.01"
          {...register('gradeValue', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.gradeValue && (
          <p className="mt-1 text-sm text-red-600">{errors.gradeValue.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
