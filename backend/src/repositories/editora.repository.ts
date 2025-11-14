import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { editora } from "../db/schemas/schemas";

type Editora = typeof editora.$inferSelect;
type NewEditora = typeof editora.$inferInsert;

export class EditoraRepository {
  async create(data: NewEditora): Promise<Editora> {
    const [result] = await db.insert(editora).values(data).returning();

    if (!result) {
      throw new Error("Falha ao criar editora");
    }

    return result;
  }

  async findAll(): Promise<Editora[]> {
    return db.select().from(editora);
  }

  async findById(id: number): Promise<Editora | null> {
    const results = await db.select().from(editora).where(eq(editora.id, id));

    return results[0] ?? null;
  }

  async findByName(nome: string): Promise<Editora | null> {
    const results = await db
      .select()
      .from(editora)
      .where(eq(editora.nome, nome))
      .limit(1);

    return results[0] ?? null;
  }

  async update(id: number, data: Partial<NewEditora>): Promise<Editora> {
    const results = await db
      .update(editora)
      .set(data)
      .where(eq(editora.id, id))
      .returning();

    if (!results[0]) {
      throw new Error(`Editora com id ${id} não encontrada`);
    }

    return results[0];
  }

  async delete(id: number): Promise<Editora> {
    const results = await db
      .delete(editora)
      .where(eq(editora.id, id))
      .returning();

    if (!results[0]) {
      throw new Error(`Editora com id ${id} não encontrada`);
    }

    return results[0];
  }
}
