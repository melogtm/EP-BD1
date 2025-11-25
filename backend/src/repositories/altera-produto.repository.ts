import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { alteraProduto } from "../db/schemas/schemas";
import type { AlteraProduto, AlteraProdutoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class AlteraProdutoRepository {
  async create(data: AlteraProdutoInsert): Promise<AlteraProduto> {
    const [result] = await db.insert(alteraProduto).values(data).returning();
    if (!result) throw new Error("Falha ao criar alteração de produto");
    return result;
  }

  async findAll(): Promise<AlteraProduto[]> {
    return await db.select().from(alteraProduto);
  }

  async findByProduto(codigoProduto: string): Promise<AlteraProduto[]> {
    return await db
      .select()
      .from(alteraProduto)
      .where(eq(alteraProduto.codigoProduto, codigoProduto));
  }

  async delete(codigoProduto: string, cpf: string): Promise<AlteraProduto> {
    const results = await db
      .delete(alteraProduto)
      .where(
        and(
          eq(alteraProduto.codigoProduto, codigoProduto),
          eq(alteraProduto.cpf, cpf)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Alteração de produto não encontrada");
    return results[0];
  }
}
