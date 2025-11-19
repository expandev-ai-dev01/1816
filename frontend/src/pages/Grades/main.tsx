import { useState } from 'react';
import { useGradeList } from '@/domain/grade/hooks/useGradeList';
import { GradeForm } from '@/domain/grade/components/GradeForm';
import { GradeList } from '@/domain/grade/components/GradeList';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { Grade, GradeFormData } from '@/domain/grade/types';

export const GradesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | undefined>(undefined);
  const [filters, setFilters] = useState({ studentName: '', subject: '' });

  const {
    data: grades,
    isLoading,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isRemoving,
  } = useGradeList({
    filters: {
      studentName: filters.studentName || undefined,
      subject: filters.subject || undefined,
    },
  });

  const handleSubmit = async (data: GradeFormData) => {
    try {
      if (editingGrade) {
        await update({ id: editingGrade.id, data });
      } else {
        await create(data);
      }
      setIsFormOpen(false);
      setEditingGrade(undefined);
    } catch (error: unknown) {
      console.error('Error saving grade:', error);
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await remove(id);
      } catch (error: unknown) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGrade(undefined);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Notas</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nova Nota
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="filterStudent" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Aluno
            </label>
            <input
              id="filterStudent"
              type="text"
              value={filters.studentName}
              onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              placeholder="Digite o nome do aluno"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="filterSubject" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Matéria
            </label>
            <input
              id="filterSubject"
              type="text"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              placeholder="Digite a matéria"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isFormOpen && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingGrade ? 'Editar Nota' : 'Nova Nota'}
            </h3>
            <GradeForm
              initialData={editingGrade}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreating || isUpdating}
            />
          </div>
        )}

        <GradeList
          grades={grades || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isRemoving}
        />
      </div>
    </div>
  );
};

export default GradesPage;
