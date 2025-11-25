import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { funcionario } from "../db/schemas/schemas";
import type { Funcionario, FuncionarioInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioRepository {
  async create(data: FuncionarioInsert): Promise<Funcionario> {
    const [result] = await db.insert(funcionario).values(data).returning();
    if (!result) throw new Error("Falha ao criar funcionário");
    return result;
  }

  async findAll(): Promise<Funcionario[]> {
    return await db.select().from(funcionario);
  }

  async findById(cpf: string): Promise<Funcionario | null> {
    const results = await db
      .select()
      .from(funcionario)
      .where(eq(funcionario.cpf, cpf));
    return results[0] ?? null;
  }

  async update(cpf: string, data: Partial<FuncionarioInsert>): Promise<Funcionario> {
    const results = await db
      .update(funcionario)
      .set(data)
      .where(eq(funcionario.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário ${cpf} não encontrado`);
    return results[0];
  }

  async delete(cpf: string): Promise<Funcionario> {
    const results = await db
      .delete(funcionario)
      .where(eq(funcionario.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário ${cpf} não encontrado`);
    return results[0];
  }
}
