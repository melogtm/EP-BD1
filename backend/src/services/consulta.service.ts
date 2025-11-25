import { ConsultaRepository } from "../repositories/consulta.repository";
import type { Consulta, ConsultaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ConsultaService {
  constructor(private repository = new ConsultaRepository()) {}

  async create(data: ConsultaInsert): Promise<Consulta> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Consulta[]> {
    return this.repository.findAll();
  }

  async getById(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string): Promise<Consulta> {
    const consulta = await this.repository.findById(dataHoraAgendada, cpfFuncSaude, cpfPaciente);
    if (!consulta) throw new NotFoundError("Consulta não encontrada");
    return consulta;
  }

  async getByPaciente(cpfPaciente: string): Promise<Consulta[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async getByMedico(cpfFuncSaude: string): Promise<Consulta[]> {
    return this.repository.findByMedico(cpfFuncSaude);
  }

  async update(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string,
    data: Partial<ConsultaInsert>
  ): Promise<Consulta> {
    return this.repository.update(dataHoraAgendada, cpfFuncSaude, cpfPaciente, data);
  }

  async delete(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string): Promise<Consulta> {
    return this.repository.delete(dataHoraAgendada, cpfFuncSaude, cpfPaciente);
  }
}
