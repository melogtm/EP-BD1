import { PlantaoRepository } from "../repositories/plantao.respository";
import type { Plantao, PlantaoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PlantaoService {
  constructor(private repository = new PlantaoRepository()) {}

  async create(data: PlantaoInsert): Promise<Plantao> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Plantao[]> {
    return this.repository.findAll();
  }

  async getById(plantaoId: number): Promise<Plantao> {
    const plantao = await this.repository.findById(plantaoId);
    if (!plantao) throw new NotFoundError("Plantão não encontrado");
    return plantao;
  }

  async update(
    plantaoId: number,
    data: Partial<PlantaoInsert>
  ): Promise<Plantao> {
    return this.repository.update(plantaoId, data);
  }

  async delete(plantaoId: number): Promise<Plantao> {
    return this.repository.delete(plantaoId);
  }
}
