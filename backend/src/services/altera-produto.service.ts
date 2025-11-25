import { AlteraProdutoRepository } from "../repositories/altera-produto.repository";
import type { AlteraProduto, AlteraProdutoInsert } from "../db/schemas/schemas.types";

export class AlteraProdutoService {
  constructor(private repository = new AlteraProdutoRepository()) {}

  async create(data: AlteraProdutoInsert): Promise<AlteraProduto> {
    return this.repository.create(data);
  }

  async getAll(): Promise<AlteraProduto[]> {
    return this.repository.findAll();
  }

  async getByProduto(codigoProduto: string): Promise<AlteraProduto[]> {
    return this.repository.findByProduto(codigoProduto);
  }

  async delete(codigoProduto: string, cpf: string): Promise<AlteraProduto> {
    return this.repository.delete(codigoProduto, cpf);
  }
}
