import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { receita } from "../db/schemas/schemas";
import type { Receita, ReceitaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ReceitaRepository {
  async create(data: ReceitaInsert): Promise<Receita> {
    try {
      const processedData = {
        ...data,
        // Apenas converte dataHoraCons que é timestamp
        dataHoraCons: data.dataHoraCons ? new Date(data.dataHoraCons) : null,
        // validade e dataEmissao ficam como strings (formato YYYY-MM-DD)
      };

      const [result] = await db
        .insert(receita)
        .values(processedData)
        .returning();
      if (!result) throw new Error("Falha ao criar receita");
      return result;
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      throw error;
    }
  }

  async findAll(): Promise<Receita[]> {
    return await db.select().from(receita);
  }

  async findById(receitaId: number): Promise<Receita | null> {
    const results = await db
      .select()
      .from(receita)
      .where(eq(receita.receitaId, receitaId));
    return results[0] ?? null;
  }

  async findByPaciente(cpfPaciente: string): Promise<Receita[]> {
    return await db
      .select()
      .from(receita)
      .where(eq(receita.cpfPaciente, cpfPaciente));
  }

  async update(
    receitaId: number,
    data: Partial<ReceitaInsert>
  ): Promise<Receita> {
    try {
      const processedData: any = { ...data };
      // Apenas converte dataHoraCons que é timestamp
      if (data.dataHoraCons) {
        processedData.dataHoraCons = new Date(data.dataHoraCons);
      }
      // validade e dataEmissao ficam como strings

      const results = await db
        .update(receita)
        .set(processedData)
        .where(eq(receita.receitaId, receitaId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Receita ${receitaId} não encontrada`);
      return results[0];
    } catch (error) {
      console.error(`Erro ao atualizar receita ${receitaId}:`, error);
      throw error;
    }
  }

  async delete(receitaId: number): Promise<Receita> {
    const results = await db
      .delete(receita)
      .where(eq(receita.receitaId, receitaId))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Receita ${receitaId} não encontrada`);
    return results[0];
  }
}
