import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { empresa } from "../db/schemas/schemas";
import type { Empresa, EmpresaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class EmpresaRepository {
  async create(data: EmpresaInsert): Promise<Empresa> {
    try {
      const [result] = await db.insert(empresa).values(data).returning();
      if (!result) throw new Error("Falha ao criar empresa");
      return result;
    } catch (error) {
      console.error("Erro no create Empresa:", error);
      throw error;
    }
  }

  async findAll(): Promise<Empresa[]> {
    try {
      return await db.select().from(empresa);
    } catch (error) {
      console.error("Erro no findAll Empresa:", error);
      throw error;
    }
  }

  async findById(cnpj: string): Promise<Empresa | null> {
    try {
      const results = await db
        .select()
        .from(empresa)
        .where(eq(empresa.cnpj, cnpj));
      return results[0] ?? null;
    } catch (error) {
      console.error(`Erro no findById Empresa com CNPJ=${cnpj}:`, error);
      throw error;
    }
  }

  async update(cnpj: string, data: Partial<EmpresaInsert>): Promise<Empresa> {
    try {
      const results = await db
        .update(empresa)
        .set(data)
        .where(eq(empresa.cnpj, cnpj))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Empresa com CNPJ ${cnpj} não encontrada`);
      return results[0];
    } catch (error) {
      console.error(`Erro no update Empresa com CNPJ=${cnpj}:`, error);
      throw error;
    }
  }

  async delete(cnpj: string): Promise<Empresa> {
    try {
      const results = await db
        .delete(empresa)
        .where(eq(empresa.cnpj, cnpj))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Empresa com CNPJ ${cnpj} não encontrada`);
      return results[0];
    } catch (error) {
      console.error(`Erro no delete Empresa com CNPJ=${cnpj}:`, error);
      throw error;
    }
  }
}
