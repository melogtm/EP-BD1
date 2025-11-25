import { ConsultaDiagnosticoRepository } from "../repositories/consulta-diagnostico.repository";
import type { ConsultaDiagnostico, ConsultaDiagnosticoInsert } from "../db/schemas/schemas.types";

export class ConsultaDiagnosticoService {
  constructor(private repository = new ConsultaDiagnosticoRepository()) {}

  async create(data: ConsultaDiagnosticoInsert): Promise<ConsultaDiagnostico> {
    return this.repository.create(data);
  }

  async getAll(): Promise<ConsultaDiagnostico[]> {
    return this.repository.findAll();
  }

  async getByConsulta(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string): Promise<ConsultaDiagnostico[]> {
    return this.repository.findByConsulta(dataHoraAgendada, cpfFuncSaude, cpfPaciente);
  }

  async delete(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string, codigoDiagnostico: string): Promise<ConsultaDiagnostico> {
    return this.repository.delete(dataHoraAgendada, cpfFuncSaude, cpfPaciente, codigoDiagnostico);
  }
}
