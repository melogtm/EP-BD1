import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { planoDeSaude } from "../db/schemas/schemas";
import type {
  PlanoDeSaude,
  PlanoDeSaudeInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PlanoDeSaudeRepository {
  async create(data: PlanoDeSaudeInsert): Promise<PlanoDeSaude> {
    const [result] = await db.insert(planoDeSaude).values(data).returning();
    if (!result) throw new Error("Falha ao criar plano de saúde");
    return result;
  }

  async findAll(): Promise<PlanoDeSaude[]> {
    return await db.select().from(planoDeSaude);
  }

  async findById(planoId: number): Promise<PlanoDeSaude | null> {
    const results = await db
      .select()
      .from(planoDeSaude)
      .where(eq(planoDeSaude.planoId, planoId));
    return results[0] ?? null;
  }

  async update(
    planoId: number,
    data: Partial<PlanoDeSaudeInsert>
  ): Promise<PlanoDeSaude> {
    const results = await db
      .update(planoDeSaude)
      .set(data)
      .where(eq(planoDeSaude.planoId, planoId))
      .returning();
    if (!results[0]) throw new NotFoundError(`Plano ${planoId} não encontrado`);
    return results[0];
  }

  async delete(planoId: number): Promise<PlanoDeSaude> {
    const results = await db
      .delete(planoDeSaude)
      .where(eq(planoDeSaude.planoId, planoId))
      .returning();
    if (!results[0]) throw new NotFoundError(`Plano ${planoId} não encontrado`);
    return results[0];
  }
}
