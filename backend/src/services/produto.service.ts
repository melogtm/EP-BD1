import { ProdutoRepository } from "../repositories/produto.repository";
import type { Produto, ProdutoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ProdutoService {
  constructor(private repository = new ProdutoRepository()) {}

  async create(data: ProdutoInsert) {
    return this.repository.create(data);
  }

  async getAll(): Promise<Produto[]> {
    return this.repository.findAll();
  }

  async getById(prodId: number): Promise<Produto> {
    const produto = await this.repository.findById(prodId);
    if (!produto) throw new NotFoundError("Produto não encontrado");
    return produto;
  }

  async update(prodId: number, data: Partial<ProdutoInsert>) {
    return this.repository.update(prodId, data);
  }

  async delete(prodId: number) {
    return this.repository.delete(prodId);
  }
}
