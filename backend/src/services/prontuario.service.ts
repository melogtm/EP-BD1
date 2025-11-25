import { ProntuarioRepository } from "../repositories/prontuario.repository";
import type { Prontuario, ProntuarioInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ProntuarioService {
  constructor(private repository = new ProntuarioRepository()) {}

  async create(data: ProntuarioInsert): Promise<Prontuario> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Prontuario[]> {
    return this.repository.findAll();
  }

  async getById(cpfPaciente: string): Promise<Prontuario> {
    const prontuario = await this.repository.findById(cpfPaciente);
    if (!prontuario) throw new NotFoundError("Prontuário não encontrado");
    return prontuario;
  }

  async update(cpfPaciente: string, data: Partial<ProntuarioInsert>): Promise<Prontuario> {
    return this.repository.update(cpfPaciente, data);
  }

  async delete(cpfPaciente: string): Promise<Prontuario> {
    return this.repository.delete(cpfPaciente);
  }
}
