import { api } from './api';
import { Medicamento, ApiListResponse } from '@/types';

export const medicamentoService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Medicamento>>('/medicamentos');
    return response.data;
  },

  getById: async (nome: string) => {
    const response = await api.get<Medicamento>(`/medicamentos/${nome}`);
    return response.data;
  },

  create: async (data: Medicamento) => {
    const response = await api.post<Medicamento>('/medicamentos', data);
    return response.data;
  },

  update: async (nome: string, data: Partial<Medicamento>) => {
    const response = await api.patch<Medicamento>(`/medicamentos/${nome}`, data);
    return response.data;
  },

  delete: async (nome: string) => {
    await api.delete(`/medicamentos/${nome}`);
  },
};
