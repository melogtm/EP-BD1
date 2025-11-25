import { PessoaRepository } from "../repositories/pessoa.repository";
import type { Pessoa, PessoaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PessoaService {
  constructor(private repository = new PessoaRepository()) {}

  async create(data: PessoaInsert) {
    return this.repository.create(data);
  }

  async getAll(): Promise<Pessoa[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<Pessoa> {
    const pessoa = await this.repository.findById(cpf);
    if (!pessoa) throw new NotFoundError("Pessoa não encontrada");
    return pessoa;
  }

  async update(cpf: string, data: Partial<PessoaInsert>) {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string) {
    return this.repository.delete(cpf);
  }
}
