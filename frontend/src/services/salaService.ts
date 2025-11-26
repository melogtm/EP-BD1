import { api } from './api';
import { LocalSala, ApiListResponse } from '@/types';

export const salaService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<LocalSala>>('/salas');
    return response.data;
  },

  getById: async (numeroSala: number) => {
    const response = await api.get<LocalSala>(`/salas/${numeroSala}`);
    return response.data;
  },

  create: async (data: LocalSala) => {
    const response = await api.post<LocalSala>('/salas', data);
    return response.data;
  },

  update: async (numeroSala: number, data: Partial<LocalSala>) => {
    const response = await api.patch<LocalSala>(`/salas/${numeroSala}`, data);
    return response.data;
  },

  delete: async (numeroSala: number) => {
    await api.delete(`/salas/${numeroSala}`);
  },
};
