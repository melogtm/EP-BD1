import { PlanoDeSaudeRepository } from "../repositories/plano-de-saude.repository";
import type {
  PlanoDeSaude,
  PlanoDeSaudeInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PlanoDeSaudeService {
  constructor(private repository = new PlanoDeSaudeRepository()) {}

  async create(data: PlanoDeSaudeInsert): Promise<PlanoDeSaude> {
    return this.repository.create(data);
  }

  async getAll(): Promise<PlanoDeSaude[]> {
    return this.repository.findAll();
  }

  async getById(planoId: number): Promise<PlanoDeSaude> {
    const plano = await this.repository.findById(planoId);
    if (!plano) throw new NotFoundError("Plano não encontrado");
    return plano;
  }

  async update(
    planoId: number,
    data: Partial<PlanoDeSaudeInsert>
  ): Promise<PlanoDeSaude> {
    return this.repository.update(planoId, data);
  }

  async delete(planoId: number): Promise<PlanoDeSaude> {
    return this.repository.delete(planoId);
  }
}
