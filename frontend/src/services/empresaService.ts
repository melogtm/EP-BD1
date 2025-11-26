import { api } from './api';
import { Empresa, ApiListResponse } from '@/types';

export const empresaService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Empresa>>('/empresas');
    return response.data;
  },

  getById: async (cnpj: string) => {
    const response = await api.get<Empresa>(`/empresas/${cnpj}`);
    return response.data;
  },

  create: async (data: Empresa) => {
    const response = await api.post<Empresa>('/empresas', data);
    return response.data;
  },

  update: async (cnpj: string, data: Partial<Empresa>) => {
    const response = await api.patch<Empresa>(`/empresas/${cnpj}`, data);
    return response.data;
  },

  delete: async (cnpj: string) => {
    await api.delete(`/empresas/${cnpj}`);
  },
};
