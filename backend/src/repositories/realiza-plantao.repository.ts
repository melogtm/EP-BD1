import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { realizaPlantao } from "../db/schemas/schemas";
import type { RealizaPlantao, RealizaPlantaoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class RealizaPlantaoRepository {
  async create(data: RealizaPlantaoInsert): Promise<RealizaPlantao> {
    const [result] = await db.insert(realizaPlantao).values(data).returning();
    if (!result) throw new Error("Falha ao criar plantão");
    return result;
  }

  async findAll(): Promise<RealizaPlantao[]> {
    return await db.select().from(realizaPlantao);
  }

  async findByFuncionario(cpf: string): Promise<RealizaPlantao[]> {
    return await db
      .select()
      .from(realizaPlantao)
      .where(eq(realizaPlantao.cpf, cpf));
  }

  async delete(cpf: string, plantaoId: number): Promise<RealizaPlantao> {
    const results = await db
      .delete(realizaPlantao)
      .where(
        and(
          eq(realizaPlantao.cpf, cpf),
          eq(realizaPlantao.plantaoId, plantaoId)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Plantão não encontrado");
    return results[0];
  }
}
