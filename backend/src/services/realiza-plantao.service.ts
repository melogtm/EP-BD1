import { RealizaPlantaoRepository } from "../repositories/realiza-plantao.repository";
import type { RealizaPlantao, RealizaPlantaoInsert } from "../db/schemas/schemas.types";

export class RealizaPlantaoService {
  constructor(private repository = new RealizaPlantaoRepository()) {}

  async create(data: RealizaPlantaoInsert): Promise<RealizaPlantao> {
    return this.repository.create(data);
  }

  async getAll(): Promise<RealizaPlantao[]> {
    return this.repository.findAll();
  }

  async getByFuncionario(cpf: string): Promise<RealizaPlantao[]> {
    return this.repository.findByFuncionario(cpf);
  }

  async delete(cpf: string, plantaoId: number): Promise<RealizaPlantao> {
    return this.repository.delete(cpf, plantaoId);
  }
}
