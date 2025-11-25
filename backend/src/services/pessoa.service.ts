import { PessoaRepository } from "../repositories/pessoa.repository";
import type { pessoa } from "../db/schemas/schemas";

type PessoaUpdate = Partial<Omit<typeof pessoa.$inferSelect, "cpf">>;

export class PessoaService {
  constructor(private repository = new PessoaRepository()) {}

  async create(data: {
    cpf: string;
    nome: string;
    email?: string;
    genero?: string;
    dataNascDia?: number;
    dataNascMes?: number;
    dataNascAno?: number;
    endRua?: string;
    endNum?: string;
    endBairro?: string;
    endCidade?: string;
    endUf?: string;
    endPais?: string;
    endCep?: string;
    endComplem?: string;
  }) {
    const pessoaExistente = await this.repository.findById(data.cpf);
    if (pessoaExistente) {
      throw new Error("Pessoa com esse CPF já existe");
    }
    return this.repository.create(data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(cpf: string) {
    const pessoa = await this.repository.findById(cpf);
    if (!pessoa) {
      throw new Error("Pessoa não encontrada");
    }
    return pessoa;
  }

  async update(cpf: string, data: PessoaUpdate) {
    const pessoa = await this.repository.findById(cpf);
    if (!pessoa) {
      throw new Error("Pessoa não encontrada");
    }
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string) {
    const pessoa = await this.repository.findById(cpf);
    if (!pessoa) {
      throw new Error("Pessoa não encontrada");
    }
    return this.repository.delete(cpf);
  }
}
