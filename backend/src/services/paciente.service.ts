import { PacienteRepository } from "../repositories/paciente.repository";
import type { Paciente, PacienteInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PacienteService {
  constructor(private repository = new PacienteRepository()) {}

  async create(data: PacienteInsert): Promise<Paciente> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Paciente[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<Paciente> {
    const paciente = await this.repository.findById(cpf);
    if (!paciente) throw new NotFoundError("Paciente não encontrado");
    return paciente;
  }

  async update(cpf: string, data: Partial<PacienteInsert>): Promise<Paciente> {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string): Promise<Paciente> {
    return this.repository.delete(cpf);
  }
}
