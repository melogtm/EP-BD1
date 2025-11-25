import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { pessoa } from "../db/schemas/schemas";

type Pessoa = typeof pessoa.$inferSelect;
type NewPessoa = typeof pessoa.$inferInsert;

export class PessoaRepository {
  async create(data: NewPessoa): Promise<Pessoa> {
    try {
      const [result] = await db.insert(pessoa).values(data).returning();
      if (!result) throw new Error("Falha ao criar pessoa");
      return result;
    } catch (error) {
      console.error("Erro no create Pessoa:", error);
      throw error;
    }
  }

  async findAll(): Promise<Pessoa[]> {
    try {
      return await db.select().from(pessoa);
    } catch (error) {
      console.error("Erro no findAll Pessoa:", error);
      throw error;
    }
  }

  async findById(cpf: string): Promise<Pessoa | null> {
    try {
      const results = await db.select().from(pessoa).where(eq(pessoa.cpf, cpf));
      return results[0] ?? null;
    } catch (error) {
      console.error(`Erro no findById Pessoa com CPF=${cpf}:`, error);
      throw error;
    }
  }

  async update(cpf: string, data: Partial<NewPessoa>): Promise<Pessoa> {
    try {
      const results = await db
        .update(pessoa)
        .set(data)
        .where(eq(pessoa.cpf, cpf))
        .returning();
      if (!results[0]) throw new Error(`Pessoa com CPF ${cpf} não encontrada`);
      return results[0];
    } catch (error) {
      console.error(`Erro no update Pessoa com CPF=${cpf}:`, error);
      throw error;
    }
  }

  async delete(cpf: string): Promise<Pessoa> {
    try {
      const results = await db
        .delete(pessoa)
        .where(eq(pessoa.cpf, cpf))
        .returning();
      if (!results[0]) throw new Error(`Pessoa com CPF ${cpf} não encontrada`);
      return results[0];
    } catch (error) {
      console.error(`Erro no delete Pessoa com CPF=${cpf}:`, error);
      throw error;
    }
  }
}
