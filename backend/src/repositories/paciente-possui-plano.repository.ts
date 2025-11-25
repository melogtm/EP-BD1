import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { pacientePossuiPlano } from "../db/schemas/schemas";
import type { PacientePossuiPlano, PacientePossuiPlanoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PacientePossuiPlanoRepository {
  async create(data: PacientePossuiPlanoInsert): Promise<PacientePossuiPlano> {
    const [result] = await db.insert(pacientePossuiPlano).values(data).returning();
    if (!result) throw new Error("Falha ao criar plano do paciente");
    return result;
  }

  async findAll(): Promise<PacientePossuiPlano[]> {
    return await db.select().from(pacientePossuiPlano);
  }

  async findByPaciente(cpfPaciente: string): Promise<PacientePossuiPlano[]> {
    return await db
      .select()
      .from(pacientePossuiPlano)
      .where(eq(pacientePossuiPlano.cpfPaciente, cpfPaciente));
  }

  async delete(cpfPaciente: string, planoId: number): Promise<PacientePossuiPlano> {
    const results = await db
      .delete(pacientePossuiPlano)
      .where(
        and(
          eq(pacientePossuiPlano.cpfPaciente, cpfPaciente),
          eq(pacientePossuiPlano.planoId, planoId)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Plano do paciente não encontrado");
    return results[0];
  }
}
