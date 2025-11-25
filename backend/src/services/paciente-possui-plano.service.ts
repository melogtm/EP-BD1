import { PacientePossuiPlanoRepository } from "../repositories/paciente-possui-plano.repository";
import type { PacientePossuiPlano, PacientePossuiPlanoInsert } from "../db/schemas/schemas.types";

export class PacientePossuiPlanoService {
  constructor(private repository = new PacientePossuiPlanoRepository()) {}

  async create(data: PacientePossuiPlanoInsert): Promise<PacientePossuiPlano> {
    return this.repository.create(data);
  }

  async getAll(): Promise<PacientePossuiPlano[]> {
    return this.repository.findAll();
  }

  async getByPaciente(cpfPaciente: string): Promise<PacientePossuiPlano[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async delete(cpfPaciente: string, planoId: number): Promise<PacientePossuiPlano> {
    return this.repository.delete(cpfPaciente, planoId);
  }
}
