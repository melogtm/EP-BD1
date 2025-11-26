import { api } from "./api";
import {
  Funcionario,
  FuncionarioSaude,
  FuncionarioAdm,
  ApiListResponse,
} from "@/types";

export const funcionarioService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Funcionario>>(
      "/funcionarios"
    );

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    return data.map((f) => ({
      ...f,
      salarioBase:
        typeof f.salarioBase === "string"
          ? parseFloat(f.salarioBase)
          : f.salarioBase,
      salaAlocacao:
        typeof f.salaAlocacao === "string"
          ? parseInt(f.salaAlocacao)
          : f.salaAlocacao,
    }));
  },

  getById: async (cpf: string) => {
    const response = await api.get<Funcionario>(`/funcionarios/${cpf}`);
    return response.data;
  },

  create: async (data: Funcionario) => {
    const response = await api.post<Funcionario>("/funcionarios", data);
    return response.data;
  },

  update: async (cpf: string, data: Partial<Funcionario>) => {
    const response = await api.patch<Funcionario>(`/funcionarios/${cpf}`, data);
    return response.data;
  },

  delete: async (cpf: string) => {
    await api.delete(`/funcionarios/${cpf}`);
  },
};

export const funcionarioSaudeService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<FuncionarioSaude>>(
      "/funcionarios-saude"
    );
    return response.data;
  },

  getById: async (cpf: string) => {
    const response = await api.get<FuncionarioSaude>(
      `/funcionarios-saude/${cpf}`
    );
    return response.data;
  },

  create: async (data: FuncionarioSaude) => {
    const response = await api.post<FuncionarioSaude>(
      "/funcionarios-saude",
      data
    );
    return response.data;
  },

  update: async (cpf: string, data: Partial<FuncionarioSaude>) => {
    const response = await api.patch<FuncionarioSaude>(
      `/funcionarios-saude/${cpf}`,
      data
    );
    return response.data;
  },

  delete: async (cpf: string) => {
    await api.delete(`/funcionarios-saude/${cpf}`);
  },
};

export const funcionarioAdmService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<FuncionarioAdm>>(
      "/funcionarios-adm"
    );
    return response.data;
  },

  create: async (data: FuncionarioAdm) => {
    const response = await api.post<FuncionarioAdm>("/funcionarios-adm", data);
    return response.data;
  },

  delete: async (cpf: string) => {
    await api.delete(`/funcionarios-adm/${cpf}`);
  },
};
