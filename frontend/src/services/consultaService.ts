import { api } from "./api";
import { Consulta, ApiListResponse } from "@/types";

// Tipos auxiliares para responses mockados
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

export const consultaService = {
  // Métodos existentes
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

  getConsultasPacientePassadas: async (cpfPaciente: string) => {
    try {
      const response = await api.get<ApiListResponse<Consulta>>(
        `/consultas/getConsultasPassadas/${cpfPaciente}`
      );
      return response.data || [];
    } catch {
      // Mock data para demo
      return [
        {
          id: 1,
          dataHoraAgendada: "2025-11-20T10:00:00",
          cpfFuncSaude: "123.456.789-01",
          medico: { nome: "Dr. João Silva" },
          cpfPaciente: cpfPaciente,
          status: "Realizado",
        },
        {
          id: 2,
          dataHoraAgendada: "2025-11-25T14:30:00",
          cpfFuncSaude: "987.654.321-00",
          medico: { nome: "Dra. Maria Santos" },
          cpfPaciente: cpfPaciente,
          status: "Realizado",
        },
      ];
    }
  },

  getConsultasPacienteFuturas: async (cpfPaciente: string) => {
    try {
      const response = await api.get<ApiListResponse<Consulta>>(
        `/consultas/getConsultasFuturas/${cpfPaciente}`
      );
      return response.data || [];
    } catch {
      // Mock data
      return [
        {
          id: 3,
          dataHoraAgendada: "2025-12-05T09:00:00",
          cpfFuncSaude: "123.456.789-01",
          medico: { nome: "Dr. João Silva" },
          cpfPaciente: cpfPaciente,
          status: "Agendado",
        },
      ];
    }
  },

  getHorariosDisponiveis: async (
    cpfPaciente: string,
    especialidade: string,
    data: string
  ) => {
    try {
      const response = await api.get<ApiListResponse<Consulta>>(
        `/consultas/${cpfPaciente}/${especialidade}/${data}`
      );
      return response.data || [];
    } catch {
      // Mock data
      return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    }
  },

  getMedicoDisponivel: async (
    cpfPaciente: string,
    especialidade: string,
    data: string,
    horario: string
  ) => {
    try {
      const response = await api.get(
        `/consultas/disponiveis/${cpfPaciente}/${especialidade}/${data}/${horario}`
      );
      return response.data;
    } catch {
      // Mock baseado no seed script
      const medicosPorEspecialidade: Record<string, string> = {
        ortopedia: "10000036",
        cardiologia: "10000033",
        pediatria: "10000035",
        dermatologia: "10000038",
        neurologia: "10000037",
      };

      const cpfMedico = medicosPorEspecialidade[especialidade] || "10000036";
      return {
        cpfFuncSaude: cpfMedico,
        nomeMedico: `Dr(a) ${
          especialidade.charAt(0).toUpperCase() + especialidade.slice(1)
        }`,
        salaDisponivel: 504,
        disponivel: true,
      };
    }
  },

  getAgendaMedicoDia: async (cpfMedico: string, data: string) => {
    try {
      const response = await api.get<ApiListResponse<Consulta>>(
        `/consultas/medico/${cpfMedico}/dia/${data}`
      );
      return response.data || [];
    } catch {
      // Mock agenda do dia
      return [
        {
          id: 4,
          dataHoraAgendada: "2025-11-29T09:00:00",
          cpfFuncSaude: cpfMedico,
          paciente: { cpf: "111.222.333-44", nome: "Ana Costa" },
          status: "Agendado",
        },
        {
          id: 5,
          dataHoraAgendada: "2025-11-29T10:30:00",
          cpfFuncSaude: cpfMedico,
          paciente: { cpf: "555.666.777-88", nome: "Pedro Almeida" },
          status: "Agendado",
        },
        {
          id: 6,
          dataHoraAgendada: "2025-11-29T14:00:00",
          cpfFuncSaude: cpfMedico,
          paciente: { cpf: "999.888.777-66", nome: "Carla Souza" },
          status: "Agendado",
        },
      ];
    }
  },

  getOcupacaoSalas: async (dataInicio?: string, dataFim?: string) => {
    // Mock salas menos usadas
    return [
      {
        salaId: 1,
        nome: "Sala 101",
        totalConsultas: 5,
        ocupacaoPorcentagem: 20,
      },
      {
        salaId: 2,
        nome: "Sala 102",
        totalConsultas: 12,
        ocupacaoPorcentagem: 48,
      },
      {
        salaId: 3,
        nome: "Sala 103",
        totalConsultas: 3,
        ocupacaoPorcentagem: 12,
      },
    ] as SalaOcupacao[];
  },

  getPagamentosMes: async () => {
    // Mock pagamentos
    return {
      total: 125000.5,
      porPaciente: {
        "111.222.333-44": 2500,
        "555.666.777-88": 1800,
        "999.888.777-66": 3200,
      },
      porPlano: {
        Particular: 4500,
        "Convenio ABC": 7800,
        SUS: 200,
      },
    } as PagamentoMes;
  },

  getFuncionariosPacientes: async () => {
    // Mock funcionários que são pacientes
    return [
      {
        cpf: "123.456.789-01",
        nome: "Dr. João Silva",
        totalGasto: 4500,
        totalConsultas: 8,
      },
      {
        cpf: "987.654.321-00",
        nome: "Dra. Maria Santos",
        totalGasto: 2200,
        totalConsultas: 5,
      },
    ] as FuncionarioPaciente[];
  },

  getPacientesCancelamentos: async () => {
    // Mock pacientes que mais cancelaram
    return [
      { cpf: "111.222.333-44", nome: "Ana Costa", cancelamentos: 5 },
      { cpf: "555.666.777-88", nome: "Pedro Almeida", cancelamentos: 3 },
    ] as PacienteCancelamento[];
  },

  getPacientesSemExames: async () => {
    // Mock pacientes sem exames
    return [
      { cpf: "111.222.333-44", nome: "Ana Costa", totalConsultas: 12 },
      { cpf: "222.333.444-55", nome: "Lucas Pereira", totalConsultas: 8 },
    ] as PacienteSemExame[];
  },

  getConfirmacoesDiaMedico: async (data?: string, medicoCpf?: string) => {
    // Mock confirmações do dia
    return [
      {
        data: "2025-11-29",
        medicoCpf: "123.456.789-01",
        medicoNome: "Dr. João Silva",
        pacientes: [
          {
            cpf: "111.222.333-44",
            nome: "Ana Costa",
            telefone: "(11) 99999-1111",
            email: "ana@email.com",
          },
          {
            cpf: "555.666.777-88",
            nome: "Pedro Almeida",
            telefone: "(11) 99999-2222",
            email: "pedro@email.com",
          },
        ],
      },
    ] as ConfirmacaoDia[];
  },

  // Métodos CRUD existentes
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
