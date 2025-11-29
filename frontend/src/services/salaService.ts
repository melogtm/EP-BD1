import { api } from "./api";
import { LocalSala, ApiListResponse } from "@/types";

export const salaService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<LocalSala>>("/salas");
    return response.data;
  },

  getById: async (numeroSala: number) => {
    const response = await api.get<LocalSala>(`/salas/${numeroSala}`);
    return response.data;
  },

  create: async (data: LocalSala) => {
    const response = await api.post<LocalSala>("/salas", data);
    return response.data;
  },

  update: async (numeroSala: number, data: Partial<LocalSala>) => {
    const response = await api.patch<LocalSala>(`/salas/${numeroSala}`, data);
    return response.data;
  },

  delete: async (numeroSala: number) => {
    await api.delete(`/salas/${numeroSala}`);
  },

  // Adicione no final do seu consultaService.ts para testes
  getOcupacaoSalas: async (dataInicio?: string, dataFim?: string) => {
    try {
      const response = await api.get<
        ApiListResponse<{
          salaId: 501;
          nome: "Consultório";
          totalConsultas: 3;
          ocupacaoPorcentagem: 12;
        }>
      >("/salas/ocupacao");
      return response.data;
    } catch (error) {
      return [
        {
          salaId: 502,
          nome: "Laboratório",
          totalConsultas: 8,
          ocupacaoPorcentagem: 32,
        },
        {
          salaId: 503,
          nome: "Farmácia",
          totalConsultas: 1,
          ocupacaoPorcentagem: 4,
        },
      ];
    }
  },
};
