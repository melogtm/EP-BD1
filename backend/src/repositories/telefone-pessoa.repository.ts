import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { telefonePessoa } from "../db/schemas/schemas";
import type { TelefonePessoa, TelefonePessoaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class TelefonePessoaRepository {
  async create(data: TelefonePessoaInsert): Promise<TelefonePessoa> {
    const [result] = await db.insert(telefonePessoa).values(data).returning();
    if (!result) throw new Error("Falha ao criar telefone");
    return result;
  }

  async findAll(): Promise<TelefonePessoa[]> {
    return await db.select().from(telefonePessoa);
  }

  async findByPessoa(cpf: string): Promise<TelefonePessoa[]> {
    return await db
      .select()
      .from(telefonePessoa)
      .where(eq(telefonePessoa.cpf, cpf));
  }

  async delete(cpf: string, codPais: string, ddd: string, telefone: string): Promise<TelefonePessoa> {
    const results = await db
      .delete(telefonePessoa)
      .where(
        and(
          eq(telefonePessoa.cpf, cpf),
          eq(telefonePessoa.codPais, codPais),
          eq(telefonePessoa.ddd, ddd),
          eq(telefonePessoa.telefone, telefone)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Telefone não encontrado");
    return results[0];
  }
}
