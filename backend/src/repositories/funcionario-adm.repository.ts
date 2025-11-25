import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { funcionarioAdm } from "../db/schemas/schemas";
import type { FuncionarioAdm, FuncionarioAdmInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioAdmRepository {
  async create(data: FuncionarioAdmInsert): Promise<FuncionarioAdm> {
    const [result] = await db.insert(funcionarioAdm).values(data).returning();
    if (!result) throw new Error("Falha ao criar funcionário administrativo");
    return result;
  }

  async findAll(): Promise<FuncionarioAdm[]> {
    return await db.select().from(funcionarioAdm);
  }

  async findById(cpf: string): Promise<FuncionarioAdm | null> {
    const results = await db
      .select()
      .from(funcionarioAdm)
      .where(eq(funcionarioAdm.cpf, cpf));
    return results[0] ?? null;
  }

  async update(cpf: string, data: Partial<FuncionarioAdmInsert>): Promise<FuncionarioAdm> {
    const results = await db
      .update(funcionarioAdm)
      .set(data)
      .where(eq(funcionarioAdm.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário administrativo ${cpf} não encontrado`);
    return results[0];
  }

  async delete(cpf: string): Promise<FuncionarioAdm> {
    const results = await db
      .delete(funcionarioAdm)
      .where(eq(funcionarioAdm.cpf, cpf))
      .returning();
    if (!results[0]) throw new NotFoundError(`Funcionário administrativo ${cpf} não encontrado`);
    return results[0];
  }
}
