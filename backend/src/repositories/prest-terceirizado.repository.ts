import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { prestTerceirizado } from "../db/schemas/schemas";
import type { PrestTerceirizado, PrestTerceirizadoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PrestTerceirizadoRepository {
  async create(data: PrestTerceirizadoInsert): Promise<PrestTerceirizado> {
    const [result] = await db.insert(prestTerceirizado).values(data).returning();
    if (!result) throw new Error("Falha ao criar prestador terceirizado");
    return result;
  }

  async findAll(): Promise<PrestTerceirizado[]> {
    return await db.select().from(prestTerceirizado);
  }

  async findById(cpf: string): Promise<PrestTerceirizado | null> {
    const results = await db
      .select()
      .from(prestTerceirizado)
      .where(eq(prestTerceirizado.cpf, cpf));
    return results[0] ?? null;
  }

  async update(cpf: string, data: Partial<PrestTerceirizadoInsert>): Promise<PrestTerceirizado> {
    const results = await db
      .update(prestTerceirizado)
      .set(data)
      .where(eq(prestTerceirizado.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Prestador ${cpf} não encontrado`);
    return results[0];
  }

  async delete(cpf: string): Promise<PrestTerceirizado> {
    const results = await db
      .delete(prestTerceirizado)
      .where(eq(prestTerceirizado.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Prestador ${cpf} não encontrado`);
    return results[0];
  }
}
