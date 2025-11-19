import { authenticatedClient } from '@/core/lib/api';
import type { Grade, GradeCreateDto, GradeUpdateDto, GradeListParams } from '../types';

export const gradeService = {
  async list(params?: GradeListParams): Promise<Grade[]> {
    const response = await authenticatedClient.get('/grade', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Grade> {
    const response = await authenticatedClient.get(`/grade/${id}`);
    return response.data.data;
  },

  async create(data: GradeCreateDto): Promise<Grade> {
    const response = await authenticatedClient.post('/grade', data);
    return response.data.data;
  },

  async update(id: number, data: GradeUpdateDto): Promise<Grade> {
    const response = await authenticatedClient.put(`/grade/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/grade/${id}`);
  },
};
