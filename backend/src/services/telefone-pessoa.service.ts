import { TelefonePessoaRepository } from "../repositories/telefone-pessoa.repository";
import type { TelefonePessoa, TelefonePessoaInsert } from "../db/schemas/schemas.types";

export class TelefonePessoaService {
  constructor(private repository = new TelefonePessoaRepository()) {}

  async create(data: TelefonePessoaInsert): Promise<TelefonePessoa> {
    return this.repository.create(data);
  }

  async getAll(): Promise<TelefonePessoa[]> {
    return this.repository.findAll();
  }

  async getByPessoa(cpf: string): Promise<TelefonePessoa[]> {
    return this.repository.findByPessoa(cpf);
  }

  async delete(cpf: string, codPais: string, ddd: string, telefone: string): Promise<TelefonePessoa> {
    return this.repository.delete(cpf, codPais, ddd, telefone);
  }
}
