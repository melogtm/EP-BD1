import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { produto } from "../db/schemas/schemas";
import type { Produto, ProdutoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ProdutoRepository {
  async create(data: ProdutoInsert): Promise<Produto> {
    try {
      const [result] = await db.insert(produto).values(data).returning();
      if (!result) throw new Error("Falha ao criar produto");
      return result;
    } catch (error: any) {
      console.error("Erro completo:", error);
      console.error("Tem propriedade code?", error.code);
      console.error("Tem propriedade detail?", error.detail);
      throw error;
    }
  }

  async findAll(): Promise<Produto[]> {
    try {
      return await db.select().from(produto);
    } catch (error) {
      console.error("Erro no findAll Produto:", error);
      throw error;
    }
  }

  async findById(prodId: number): Promise<Produto | null> {
    try {
      const results = await db
        .select()
        .from(produto)
        .where(eq(produto.prodId, prodId));
      return results[0] ?? null;
    } catch (error) {
      console.error(`Erro no findById Produto com ID=${prodId}:`, error);
      throw error;
    }
  }

  async update(prodId: number, data: Partial<ProdutoInsert>): Promise<Produto> {
    try {
      const results = await db
        .update(produto)
        .set(data)
        .where(eq(produto.prodId, prodId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Produto com ID ${prodId} não encontrado`);
      return results[0];
    } catch (error) {
      console.error(`Erro no update Produto com ID=${prodId}:`, error);
      throw error;
    }
  }

  async delete(prodId: number): Promise<Produto> {
    try {
      const results = await db
        .delete(produto)
        .where(eq(produto.prodId, prodId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Produto com ID ${prodId} não encontrado`);
      return results[0];
    } catch (error) {
      console.error(`Erro no delete Produto com ID=${prodId}:`, error);
      throw error;
    }
  }
}
