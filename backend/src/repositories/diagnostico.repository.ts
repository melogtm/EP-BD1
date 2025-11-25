import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { diagnostico } from "../db/schemas/schemas";
import type {
  Diagnostico,
  DiagnosticoInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class DiagnosticoRepository {
  async create(data: DiagnosticoInsert): Promise<Diagnostico> {
    const [result] = await db.insert(diagnostico).values(data).returning();
    if (!result) throw new Error("Falha ao criar diagnóstico");
    return result;
  }

  async findAll(): Promise<Diagnostico[]> {
    return await db.select().from(diagnostico);
  }

  async findById(cid: string): Promise<Diagnostico | null> {
    const results = await db
      .select()
      .from(diagnostico)
      .where(eq(diagnostico.cid, cid));
    return results[0] ?? null;
  }

  async update(
    cid: string,
    data: Partial<DiagnosticoInsert>
  ): Promise<Diagnostico> {
    const results = await db
      .update(diagnostico)
      .set(data)
      .where(eq(diagnostico.cid, cid))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Diagnóstico com CID ${cid} não encontrado`);
    return results[0];
  }

  async delete(cid: string): Promise<Diagnostico> {
    const results = await db
      .delete(diagnostico)
      .where(eq(diagnostico.cid, cid))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Diagnóstico com CID ${cid} não encontrado`);
    return results[0];
  }
}
