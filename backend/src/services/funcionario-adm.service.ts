import { FuncionarioAdmRepository } from "../repositories/funcionario-adm.repository";
import type { FuncionarioAdm, FuncionarioAdmInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioAdmService {
  constructor(private repository = new FuncionarioAdmRepository()) {}

  async create(data: FuncionarioAdmInsert): Promise<FuncionarioAdm> {
    return this.repository.create(data);
  }

  async getAll(): Promise<FuncionarioAdm[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<FuncionarioAdm> {
    const funcionarioAdm = await this.repository.findById(cpf);
    if (!funcionarioAdm) throw new NotFoundError("Funcionário administrativo não encontrado");
    return funcionarioAdm;
  }

  async update(cpf: string, data: Partial<FuncionarioAdmInsert>): Promise<FuncionarioAdm> {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string): Promise<FuncionarioAdm> {
    return this.repository.delete(cpf);
  }
}
