import { FuncionarioSaudeRepository } from "../repositories/funcionario-saude.repository";
import type { FuncionarioSaude, FuncionarioSaudeInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioSaudeService {
  constructor(private repository = new FuncionarioSaudeRepository()) {}

  async create(data: FuncionarioSaudeInsert): Promise<FuncionarioSaude> {
    return this.repository.create(data);
  }

  async getAll(): Promise<FuncionarioSaude[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<FuncionarioSaude> {
    const funcionarioSaude = await this.repository.findById(cpf);
    if (!funcionarioSaude) throw new NotFoundError("Funcionário de saúde não encontrado");
    return funcionarioSaude;
  }

  async update(cpf: string, data: Partial<FuncionarioSaudeInsert>): Promise<FuncionarioSaude> {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string): Promise<FuncionarioSaude> {
    return this.repository.delete(cpf);
  }

  async getEspecialidades(): Promise<string[]> {
    return this.repository.getEspecialidades();
  }
}
