import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { telefoneEmpresa } from "../db/schemas/schemas";
import type { TelefoneEmpresa, TelefoneEmpresaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class TelefoneEmpresaRepository {
  async create(data: TelefoneEmpresaInsert): Promise<TelefoneEmpresa> {
    const [result] = await db.insert(telefoneEmpresa).values(data).returning();
    if (!result) throw new Error("Falha ao criar telefone");
    return result;
  }

  async findAll(): Promise<TelefoneEmpresa[]> {
    return await db.select().from(telefoneEmpresa);
  }

  async findByEmpresa(cnpj: string): Promise<TelefoneEmpresa[]> {
    return await db
      .select()
      .from(telefoneEmpresa)
      .where(eq(telefoneEmpresa.cnpj, cnpj));
  }

  async delete(cnpj: string, codPais: string, ddd: string, telefone: string): Promise<TelefoneEmpresa> {
    const results = await db
      .delete(telefoneEmpresa)
      .where(
        and(
          eq(telefoneEmpresa.cnpj, cnpj),
          eq(telefoneEmpresa.codPais, codPais),
          eq(telefoneEmpresa.ddd, ddd),
          eq(telefoneEmpresa.telefone, telefone)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Telefone não encontrado");
    return results[0];
  }
}
