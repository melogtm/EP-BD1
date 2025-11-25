import { ReceitaRepository } from "../repositories/receita.repository";
import type { Receita, ReceitaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ReceitaService {
  constructor(private repository = new ReceitaRepository()) {}

  async create(data: ReceitaInsert): Promise<Receita> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Receita[]> {
    return this.repository.findAll();
  }

  async getById(receitaId: number): Promise<Receita> {
    const receita = await this.repository.findById(receitaId);
    if (!receita) throw new NotFoundError("Receita não encontrada");
    return receita;
  }

  async getByPaciente(cpfPaciente: string): Promise<Receita[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async update(receitaId: number, data: Partial<ReceitaInsert>): Promise<Receita> {
    return this.repository.update(receitaId, data);
  }

  async delete(receitaId: number): Promise<Receita> {
    return this.repository.delete(receitaId);
  }
}
