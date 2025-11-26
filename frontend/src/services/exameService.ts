import { api } from './api';
import { Exame, ApiListResponse } from '@/types';

export const exameService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Exame>>('/exames');
    return response.data;
  },

  getById: async (exameId: number) => {
    const response = await api.get<Exame>(`/exames/${exameId}`);
    return response.data;
  },

  getByPaciente: async (cpfPaciente: string) => {
    const response = await api.get<ApiListResponse<Exame>>(`/exames/paciente/${cpfPaciente}`);
    return response.data;
  },

  create: async (data: Exame) => {
    const response = await api.post<Exame>('/exames', data);
    return response.data;
  },

  update: async (exameId: number, data: Partial<Exame>) => {
    const response = await api.patch<Exame>(`/exames/${exameId}`, data);
    return response.data;
  },

  delete: async (exameId: number) => {
    await api.delete(`/exames/${exameId}`);
  },
};
