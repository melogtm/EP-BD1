import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { paciente } from "../db/schemas/schemas";
import type { Paciente, PacienteInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PacienteRepository {
  async create(data: PacienteInsert): Promise<Paciente> {
    const [result] = await db.insert(paciente).values(data).returning();
    if (!result) throw new Error("Falha ao criar paciente");
    return result;
  }

  async findAll(): Promise<Paciente[]> {
    return await db.select().from(paciente);
  }

  async findById(cpf: string): Promise<Paciente | null> {
    const results = await db
      .select()
      .from(paciente)
      .where(eq(paciente.cpf, cpf));
    return results[0] ?? null;
  }

  async update(cpf: string, data: Partial<PacienteInsert>): Promise<Paciente> {
    const results = await db
      .update(paciente)
      .set(data)
      .where(eq(paciente.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Paciente ${cpf} não encontrado`);
    return results[0];
  }

  async delete(cpf: string): Promise<Paciente> {
    const results = await db
      .delete(paciente)
      .where(eq(paciente.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Paciente ${cpf} não encontrado`);
    return results[0];
  }
}
