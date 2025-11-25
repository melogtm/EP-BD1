import { OperadoraPlanoSaudeRepository } from "../repositories/operadora-plano-saude.repository";
import type {
  OperadoraPlanoSaude,
  OperadoraPlanoSaudeInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class OperadoraPlanoSaudeService {
  constructor(private repository = new OperadoraPlanoSaudeRepository()) {}

  async create(data: OperadoraPlanoSaudeInsert): Promise<OperadoraPlanoSaude> {
    return this.repository.create(data);
  }

  async getAll(): Promise<OperadoraPlanoSaude[]> {
    return this.repository.findAll();
  }

  async getById(cnpj: string): Promise<OperadoraPlanoSaude> {
    const operadora = await this.repository.findById(cnpj);
    if (!operadora) throw new NotFoundError("Operadora não encontrada");
    return operadora;
  }

  async update(
    cnpj: string,
    data: Partial<OperadoraPlanoSaudeInsert>
  ): Promise<OperadoraPlanoSaude> {
    return this.repository.update(cnpj, data);
  }

  async delete(cnpj: string): Promise<OperadoraPlanoSaude> {
    return this.repository.delete(cnpj);
  }
}
