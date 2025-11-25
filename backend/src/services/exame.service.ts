import { ExameRepository } from "../repositories/exame.repository";
import type { Exame, ExameInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ExameService {
  constructor(private repository = new ExameRepository()) {}

  async create(data: ExameInsert): Promise<Exame> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Exame[]> {
    return this.repository.findAll();
  }

  async getById(exameId: number): Promise<Exame> {
    const exame = await this.repository.findById(exameId);
    if (!exame) throw new NotFoundError("Exame não encontrado");
    return exame;
  }

  async getByPaciente(cpfPaciente: string): Promise<Exame[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async update(exameId: number, data: Partial<ExameInsert>): Promise<Exame> {
    return this.repository.update(exameId, data);
  }

  async delete(exameId: number): Promise<Exame> {
    return this.repository.delete(exameId);
  }
}
