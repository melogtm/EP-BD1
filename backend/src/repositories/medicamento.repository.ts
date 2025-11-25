import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { medicamento } from "../db/schemas/schemas";
import type {
  Medicamento,
  MedicamentoInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class MedicamentoRepository {
  async create(data: MedicamentoInsert): Promise<Medicamento> {
    const [result] = await db.insert(medicamento).values(data).returning();
    if (!result) throw new Error("Falha ao criar medicamento");
    return result;
  }

  async findAll(): Promise<Medicamento[]> {
    return await db.select().from(medicamento);
  }

  async findById(nome: string): Promise<Medicamento | null> {
    const results = await db
      .select()
      .from(medicamento)
      .where(eq(medicamento.nome, nome));
    return results[0] ?? null;
  }

  async update(
    nome: string,
    data: Partial<MedicamentoInsert>
  ): Promise<Medicamento> {
    const results = await db
      .update(medicamento)
      .set(data)
      .where(eq(medicamento.nome, nome))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Medicamento ${nome} não encontrado`);
    return results[0];
  }

  async delete(nome: string): Promise<Medicamento> {
    const results = await db
      .delete(medicamento)
      .where(eq(medicamento.nome, nome))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Medicamento ${nome} não encontrado`);
    return results[0];
  }
}
