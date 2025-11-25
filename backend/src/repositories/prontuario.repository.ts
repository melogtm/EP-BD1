import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { prontuario } from "../db/schemas/schemas";
import type { Prontuario, ProntuarioInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ProntuarioRepository {
  async create(data: ProntuarioInsert): Promise<Prontuario> {
    try {
      // Converte strings ISO em Date se necessário
      const processedData = {
        ...data,
        dataHoraCriacao: data.dataHoraCriacao
          ? new Date(data.dataHoraCriacao)
          : null,
        dataHoraAtualizacao: data.dataHoraAtualizacao
          ? new Date(data.dataHoraAtualizacao)
          : null,
      };

      const [result] = await db
        .insert(prontuario)
        .values(processedData)
        .returning();
      if (!result) throw new Error("Falha ao criar prontuário");
      return result;
    } catch (error) {
      console.error("Erro ao criar prontuário:", error);
      throw error;
    }
  }

  async findAll(): Promise<Prontuario[]> {
    return await db.select().from(prontuario);
  }

  async findById(cpfPaciente: string): Promise<Prontuario | null> {
    const results = await db
      .select()
      .from(prontuario)
      .where(eq(prontuario.cpfPaciente, cpfPaciente));
    return results[0] ?? null;
  }

  async update(
    cpfPaciente: string,
    data: Partial<ProntuarioInsert>
  ): Promise<Prontuario> {
    try {
      // Converte strings ISO em Date se necessário
      const processedData: any = { ...data };
      if (data.dataHoraCriacao) {
        processedData.dataHoraCriacao = new Date(data.dataHoraCriacao);
      }
      if (data.dataHoraAtualizacao) {
        processedData.dataHoraAtualizacao = new Date(data.dataHoraAtualizacao);
      }

      const results = await db
        .update(prontuario)
        .set(processedData)
        .where(eq(prontuario.cpfPaciente, cpfPaciente))
        .returning();
      if (!results[0])
        throw new NotFoundError(
          `Prontuário do paciente ${cpfPaciente} não encontrado`
        );
      return results[0];
    } catch (error) {
      console.error(`Erro ao atualizar prontuário ${cpfPaciente}:`, error);
      throw error;
    }
  }

  async delete(cpfPaciente: string): Promise<Prontuario> {
    const results = await db
      .delete(prontuario)
      .where(eq(prontuario.cpfPaciente, cpfPaciente))
      .returning();
    if (!results[0])
      throw new NotFoundError(
        `Prontuário do paciente ${cpfPaciente} não encontrado`
      );
    return results[0];
  }
}
