import { api } from "./api";
import { Diagnostico, ApiListResponse } from "@/types";

export const diagnosticoService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Diagnostico>>(
      "/diagnosticos"
    );
    return response.data;
  },

  getById: async (cid: string) => {
    const response = await api.get<Diagnostico>(`/diagnosticos/${cid}`);
    return response.data;
  },

  create: async (data: Diagnostico) => {
    const response = await api.post<Diagnostico>("/diagnosticos", data);
    return response.data;
  },

  update: async (cid: string, data: Partial<Diagnostico>) => {
    const response = await api.patch<Diagnostico>(`/diagnosticos/${cid}`, data);
    return response.data;
  },

  delete: async (cid: string) => {
    await api.delete(`/diagnosticos/${cid}`);
  },
};
