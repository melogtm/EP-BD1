import { api } from "./api";
import { Consulta, ApiListResponse } from "@/types";

export const consultaService = {
  getAll: async () => {
    const response = await api.get<ApiListResponse<Consulta>>("/consultas");
    return response.data;
  },

  getByPaciente: async (cpfPaciente: string) => {
    const response = await api.get<ApiListResponse<Consulta>>(
      `/consultas/paciente/${cpfPaciente}`
    );
    return response.data;
  },

  getByMedico: async (cpfFuncSaude: string) => {
    const response = await api.get<ApiListResponse<Consulta>>(
      `/consultas/medico/${cpfFuncSaude}`
    );
    return response.data;
  },

  create: async (data: Consulta) => {
    const response = await api.post<Consulta>("/consultas", data);
    return response.data;
  },

  update: async (
    dataHoraAgendada: string,
    cpfFuncSaude: string,
    cpfPaciente: string,
    data: Partial<Consulta>
  ) => {
    const response = await api.patch<Consulta>(
      `/consultas/${dataHoraAgendada}/${cpfFuncSaude}/${cpfPaciente}`,
      data
    );
    return response.data;
  },

  delete: async (
    dataHoraAgendada: string,
    cpfFuncSaude: string,
    cpfPaciente: string
  ) => {
    await api.delete(
      `/consultas/${dataHoraAgendada}/${cpfFuncSaude}/${cpfPaciente}`
    );
  },
};
