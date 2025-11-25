import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { exame } from "../db/schemas/schemas";
import type { Exame, ExameInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ExameRepository {
  async create(data: ExameInsert): Promise<Exame> {
    try {
      const processedData = {
        ...data,
        // dataPedido é date, mantém como string
        // dataHoraRealiz é timestamp, converte se for string
        dataHoraRealiz:
          data.dataHoraRealiz && typeof data.dataHoraRealiz === "string"
            ? new Date(data.dataHoraRealiz)
            : data.dataHoraRealiz,
        // dataHoraCons é timestamp (FK composta), converte se for string
        dataHoraCons:
          data.dataHoraCons && typeof data.dataHoraCons === "string"
            ? new Date(data.dataHoraCons)
            : data.dataHoraCons,
      };

      const [result] = await db
        .insert(exame)
        .values(processedData as any)
        .returning();
      if (!result) throw new Error("Falha ao criar exame");
      return result;
    } catch (error) {
      console.error("Erro ao criar exame:", error);
      throw error;
    }
  }

  async findAll(): Promise<Exame[]> {
    return await db.select().from(exame);
  }

  async findById(exameId: number): Promise<Exame | null> {
    const results = await db
      .select()
      .from(exame)
      .where(eq(exame.exameId, exameId));
    return results[0] ?? null;
  }

  async findByPaciente(cpfPaciente: string): Promise<Exame[]> {
    return await db
      .select()
      .from(exame)
      .where(eq(exame.cpfPaciente, cpfPaciente));
  }

  async update(exameId: number, data: Partial<ExameInsert>): Promise<Exame> {
    try {
      // Filtra apenas campos que NÃO são FKs compostas
      const processedData: any = {};

      // Campos que podem ser atualizados (não são FKs compostas)
      if (data.tipoExame !== undefined)
        processedData.tipoExame = data.tipoExame;
      if (data.dataPedido !== undefined)
        processedData.dataPedido = data.dataPedido; // string
      if (data.dataHoraRealiz !== undefined) {
        processedData.dataHoraRealiz =
          typeof data.dataHoraRealiz === "string"
            ? new Date(data.dataHoraRealiz)
            : data.dataHoraRealiz;
      }
      if (data.valorExame !== undefined)
        processedData.valorExame = data.valorExame;
      if (data.laudo !== undefined) processedData.laudo = data.laudo;
      if (data.statusResultado !== undefined)
        processedData.statusResultado = data.statusResultado;
      if (data.cpfFuncSaudeRealizou !== undefined)
        processedData.cpfFuncSaudeRealizou = data.cpfFuncSaudeRealizou;
      if (data.sala !== undefined) processedData.sala = data.sala;

      // NÃO atualiza: dataHoraCons, cpfFuncSaudeSolicitou, cpfPaciente (são FKs compostas)

      if (Object.keys(processedData).length === 0) {
        throw new NotFoundError("Nenhum campo válido para atualizar");
      }

      const results = await db
        .update(exame)
        .set(processedData)
        .where(eq(exame.exameId, exameId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Exame ${exameId} não encontrado`);
      return results[0];
    } catch (error) {
      console.error(`Erro ao atualizar exame ${exameId}:`, error);
      throw error;
    }
  }

  async delete(exameId: number): Promise<Exame> {
    const results = await db
      .delete(exame)
      .where(eq(exame.exameId, exameId))
      .returning();
    if (!results[0]) throw new NotFoundError(`Exame ${exameId} não encontrado`);
    return results[0];
  }
}
