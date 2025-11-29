import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { funcionarioSaude } from "../db/schemas/schemas";
import type { FuncionarioSaude, FuncionarioSaudeInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioSaudeRepository {
  async create(data: FuncionarioSaudeInsert): Promise<FuncionarioSaude> {
    const [result] = await db.insert(funcionarioSaude).values(data).returning();
    if (!result) throw new Error("Falha ao criar funcionário de saúde");
    return result;
  }

  async findAll(): Promise<FuncionarioSaude[]> {
    return await db.select().from(funcionarioSaude);
  }

  async findByEspecialidade(especialidade: string): Promise<FuncionarioSaude[]> {
    const results = await db
      .select()
      .from(funcionarioSaude)
      .where(eq(funcionarioSaude.especialidade, especialidade));
    return results;
  }

  async findById(cpf: string): Promise<FuncionarioSaude | null> {
    const results = await db
      .select()
      .from(funcionarioSaude)
      .where(eq(funcionarioSaude.cpf, cpf));
    return results[0] ?? null;
  }

  async update(cpf: string, data: Partial<FuncionarioSaudeInsert>): Promise<FuncionarioSaude> {
    const results = await db
      .update(funcionarioSaude)
      .set(data)
      .where(eq(funcionarioSaude.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário de saúde ${cpf} não encontrado`);
    return results[0];
  }

  async delete(cpf: string): Promise<FuncionarioSaude> {
    const results = await db
      .delete(funcionarioSaude)
      .where(eq(funcionarioSaude.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário de saúde ${cpf} não encontrado`);
    return results[0];
  }
}
