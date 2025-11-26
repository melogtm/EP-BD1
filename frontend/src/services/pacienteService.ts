import { api } from './api';
import { Paciente, Pessoa, ApiListResponse } from '@/types';

export const pacienteService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Paciente>>('/pacientes');
    return response.data;
  },

  getById: async (cpf: string) => {
    const response = await api.get<Paciente>(`/pacientes/${cpf}`);
    return response.data;
  },

  create: async (data: Paciente) => {
    const response = await api.post<Paciente>('/pacientes', data);
    return response.data;
  },

  update: async (cpf: string, data: Partial<Paciente>) => {
    const response = await api.patch<Paciente>(`/pacientes/${cpf}`, data);
    return response.data;
  },

  delete: async (cpf: string) => {
    await api.delete(`/pacientes/${cpf}`);
  },
};

export const pessoaService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Pessoa>>('/pessoas');
    return response.data;
  },

  getById: async (cpf: string) => {
    const response = await api.get<Pessoa>(`/pessoas/${cpf}`);
    return response.data;
  },

  create: async (data: Pessoa) => {
    const response = await api.post<Pessoa>('/pessoas', data);
    return response.data;
  },

  update: async (cpf: string, data: Partial<Pessoa>) => {
    const response = await api.patch<Pessoa>(`/pessoas/${cpf}`, data);
    return response.data;
  },

  delete: async (cpf: string) => {
    await api.delete(`/pessoas/${cpf}`);
  },
};
