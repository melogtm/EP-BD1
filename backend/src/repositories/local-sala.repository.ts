import { and, eq, gte, lt } from "drizzle-orm";
import { db } from "../db/index";
import { localSala } from "../db/schemas/schemas";
import { consulta } from "../db/schemas/schemas";
import type { LocalSala, LocalSalaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class LocalSalaRepository {
  async create(data: LocalSalaInsert): Promise<LocalSala> {
    const [result] = await db.insert(localSala).values(data).returning();
    if (!result) throw new Error("Falha ao criar sala");
    return result;
  }

  async findAll(): Promise<LocalSala[]> {
    return await db.select().from(localSala);
  }

  async findById(numeroSala: number): Promise<LocalSala | null> {
    const results = await db
      .select()
      .from(localSala)
      .where(eq(localSala.numeroSala, numeroSala));
    return results[0] ?? null;
  }

  async update(
    numeroSala: number,
    data: Partial<LocalSalaInsert>
  ): Promise<LocalSala> {
    const results = await db
      .update(localSala)
      .set(data)
      .where(eq(localSala.numeroSala, numeroSala))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Sala ${numeroSala} não encontrada`);
    return results[0];
  }

  async delete(numeroSala: number): Promise<LocalSala> {
    const results = await db
      .delete(localSala)
      .where(eq(localSala.numeroSala, numeroSala))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Sala ${numeroSala} não encontrada`);
    return results[0];
  }

  async countConsultasBySala(
    numeroSala: number,
    dateIso?: string
  ): Promise<number> {
    // count consultas with status "Agendado" for the given sala
    let whereCondition: any = eq(consulta.sala, numeroSala);
    whereCondition = and(whereCondition, eq(consulta.statusAtendimento, "Agendado"));

    if (dateIso) {
      const start = new Date(dateIso + "T00:00:00");
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      whereCondition = and(
        whereCondition,
        gte(consulta.dataHoraAgendada, start),
        lt(consulta.dataHoraAgendada, end)
      );
    }

    const rows = await db.select().from(consulta).where(whereCondition);
    return rows.length;
  }
}
