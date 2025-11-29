// src/services/adminService.ts
import { api } from "./api";

// Reaproveitando os tipos que você já usa em consultaService (copie de lá se quiser centralizar)
interface SalaOcupacao {
  salaId: number;
  nome: string;
  totalConsultas: number;
  ocupacaoPorcentagem: number;
}

interface PagamentoMes {
  total: number;
  porPaciente: Record<string, number>;
  porPlano: Record<string, number>;
}

interface FuncionarioPaciente {
  cpf: string;
  nome: string;
  totalGasto: number;
  totalConsultas: number;
}

interface PacienteCancelamento {
  cpf: string;
  nome: string;
  cancelamentos: number;
}

interface PacienteSemExame {
  cpf: string;
  nome: string;
  totalConsultas: number;
}

interface ConfirmacaoDia {
  data: string;
  medicoCpf: string;
  medicoNome: string;
  pacientes: Array<{
    cpf: string;
    nome: string;
    telefone: string;
    email: string;
  }>;
}

export const adminService = {
  getPagamentosTotais: async (dataInicio?: string, dataFim?: string) => {
    const response = await api.get<PagamentoMes>("/admin/pagamentos/total", {
      params: { dataInicio, dataFim },
    });
    return response.data;
  },

  getFuncionariosPacientes: async () => {
    const response = await api.get<FuncionarioPaciente[]>(
      "/admin/funcionarios-pacientes"
    );
    return response.data;
  },

  getPacientesCancelamentos: async () => {
    const response = await api.get<PacienteCancelamento[]>(
      "/admin/pacientes/cancelamentos"
    );
    return response.data;
  },

  getPacientesSemExames: async () => {
    const response = await api.get<PacienteSemExame[]>(
      "/admin/pacientes/sem-exames"
    );
    return response.data;
  },

  getConfirmacoesDiaMedico: async (data?: string, medicoCpf?: string) => {
    const response = await api.get<ConfirmacaoDia[]>("/admin/confirmacoes", {
      params: { data, medicoCpf },
    });
    return response.data;
  },
};
