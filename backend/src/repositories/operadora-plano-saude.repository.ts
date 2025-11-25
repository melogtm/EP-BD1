import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { operadoraPlanoSaude } from "../db/schemas/schemas";
import type {
  OperadoraPlanoSaude,
  OperadoraPlanoSaudeInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class OperadoraPlanoSaudeRepository {
  async create(data: OperadoraPlanoSaudeInsert): Promise<OperadoraPlanoSaude> {
    const [result] = await db
      .insert(operadoraPlanoSaude)
      .values(data)
      .returning();
    if (!result) throw new Error("Falha ao criar operadora de plano de saúde");
    return result;
  }

  async findAll(): Promise<OperadoraPlanoSaude[]> {
    return await db.select().from(operadoraPlanoSaude);
  }

  async findById(cnpj: string): Promise<OperadoraPlanoSaude | null> {
    const results = await db
      .select()
      .from(operadoraPlanoSaude)
      .where(eq(operadoraPlanoSaude.cnpj, cnpj));
    return results[0] ?? null;
  }

  async update(
    cnpj: string,
    data: Partial<OperadoraPlanoSaudeInsert>
  ): Promise<OperadoraPlanoSaude> {
    const results = await db
      .update(operadoraPlanoSaude)
      .set(data)
      .where(eq(operadoraPlanoSaude.cnpj, cnpj))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Operadora ${cnpj} não encontrada`);
    return results[0];
  }

  async delete(cnpj: string): Promise<OperadoraPlanoSaude> {
    const results = await db
      .delete(operadoraPlanoSaude)
      .where(eq(operadoraPlanoSaude.cnpj, cnpj))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Operadora ${cnpj} não encontrada`);
    return results[0];
  }
}
