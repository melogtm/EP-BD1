import { ItemReceitaRepository } from "../repositories/item-receita.repository";
import type { ItemReceita, ItemReceitaInsert } from "../db/schemas/schemas.types";

export class ItemReceitaService {
  constructor(private repository = new ItemReceitaRepository()) {}

  async create(data: ItemReceitaInsert): Promise<ItemReceita> {
    return this.repository.create(data);
  }

  async getAll(): Promise<ItemReceita[]> {
    return this.repository.findAll();
  }

  async getByReceita(receitaId: number): Promise<ItemReceita[]> {
    return this.repository.findByReceita(receitaId);
  }

  async delete(receitaId: number, nomeMedicamento: string): Promise<ItemReceita> {
    return this.repository.delete(receitaId, nomeMedicamento);
  }
}
