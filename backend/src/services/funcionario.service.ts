import { FuncionarioRepository } from "../repositories/funcionario.repository";
import type { Funcionario, FuncionarioInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioService {
  constructor(private repository = new FuncionarioRepository()) {}

  async create(data: FuncionarioInsert): Promise<Funcionario> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Funcionario[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<Funcionario> {
    const funcionario = await this.repository.findById(cpf);
    if (!funcionario) throw new NotFoundError("Funcionário não encontrado");
    return funcionario;
  }

  async update(cpf: string, data: Partial<FuncionarioInsert>): Promise<Funcionario> {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string): Promise<Funcionario> {
    return this.repository.delete(cpf);
  }
}
