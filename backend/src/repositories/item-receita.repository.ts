import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { itemReceita } from "../db/schemas/schemas";
import type {
  ItemReceita,
  ItemReceitaInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ItemReceitaRepository {
  async create(data: ItemReceitaInsert): Promise<ItemReceita> {
    const [result] = await db.insert(itemReceita).values(data).returning();
    if (!result) throw new Error("Falha ao criar item receita");
    return result;
  }

  async findAll(): Promise<ItemReceita[]> {
    return await db.select().from(itemReceita);
  }

  async findByReceita(receitaId: number): Promise<ItemReceita[]> {
    return await db
      .select()
      .from(itemReceita)
      .where(eq(itemReceita.receitaId, receitaId));
  }

  async delete(
    receitaId: number,
    nomeMedicamento: string
  ): Promise<ItemReceita> {
    const results = await db
      .delete(itemReceita)
      .where(
        and(
          eq(itemReceita.receitaId, receitaId),
          eq(itemReceita.nomeMedicamentoGenerico, nomeMedicamento)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Item receita não encontrado");
    return results[0];
  }
}
