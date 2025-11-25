import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { plantao } from "../db/schemas/schemas";
import type { Plantao, PlantaoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PlantaoRepository {
  async create(data: PlantaoInsert): Promise<Plantao> {
    try {
      // Converte strings ISO em Date se necessário
      const processedData = {
        ...data,
        dataHoraInicio: data.dataHoraInicio
          ? new Date(data.dataHoraInicio)
          : null,
        dataHoraFim: data.dataHoraFim ? new Date(data.dataHoraFim) : null,
      };

      const [result] = await db
        .insert(plantao)
        .values(processedData)
        .returning();
      if (!result) throw new Error("Falha ao criar plantão");
      return result;
    } catch (error) {
      console.error("Erro ao criar plantão:", error);
      throw error;
    }
  }

  async findAll(): Promise<Plantao[]> {
    return await db.select().from(plantao);
  }

  async findById(plantaoId: number): Promise<Plantao | null> {
    const results = await db
      .select()
      .from(plantao)
      .where(eq(plantao.plantaoId, plantaoId));
    return results[0] ?? null;
  }

  async update(
    plantaoId: number,
    data: Partial<PlantaoInsert>
  ): Promise<Plantao> {
    try {
      // Converte strings ISO em Date se necessário
      const processedData: any = { ...data };
      if (data.dataHoraInicio) {
        processedData.dataHoraInicio = new Date(data.dataHoraInicio);
      }
      if (data.dataHoraFim) {
        processedData.dataHoraFim = new Date(data.dataHoraFim);
      }

      const results = await db
        .update(plantao)
        .set(processedData)
        .where(eq(plantao.plantaoId, plantaoId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Plantão ${plantaoId} não encontrado`);
      return results[0];
    } catch (error) {
      console.error(`Erro ao atualizar plantão ${plantaoId}:`, error);
      throw error;
    }
  }

  async delete(plantaoId: number): Promise<Plantao> {
    const results = await db
      .delete(plantao)
      .where(eq(plantao.plantaoId, plantaoId))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Plantão ${plantaoId} não encontrado`);
    return results[0];
  }
}
