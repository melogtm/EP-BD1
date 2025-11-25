import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { pagamento } from "../db/schemas/schemas";
import type { Pagamento, PagamentoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PagamentoRepository {
  async create(data: PagamentoInsert): Promise<Pagamento> {
    try {
      const processedData = {
        ...data,
        // dataPag é date, mantém como string
        // dataHoraCons é timestamp (FK composta), converte se for string
        dataHoraCons:
          data.dataHoraCons && typeof data.dataHoraCons === "string"
            ? new Date(data.dataHoraCons)
            : data.dataHoraCons,
      };

      const [result] = await db
        .insert(pagamento)
        .values(processedData as any)
        .returning();
      if (!result) throw new Error("Falha ao criar pagamento");
      return result;
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw error;
    }
  }

  async findAll(): Promise<Pagamento[]> {
    return await db.select().from(pagamento);
  }

  async findById(pagamentoId: number): Promise<Pagamento | null> {
    const results = await db
      .select()
      .from(pagamento)
      .where(eq(pagamento.pagamentoId, pagamentoId));
    return results[0] ?? null;
  }

  async findByPaciente(cpfPaciente: string): Promise<Pagamento[]> {
    return await db
      .select()
      .from(pagamento)
      .where(eq(pagamento.cpfPaciente, cpfPaciente));
  }

  async update(
    pagamentoId: number,
    data: Partial<PagamentoInsert>
  ): Promise<Pagamento> {
    try {
      const processedData: any = {};

      // Campos que podem ser atualizados (não são FKs compostas)
      if (data.valor !== undefined) processedData.valor = data.valor;
      if (data.dataPag !== undefined) processedData.dataPag = data.dataPag; // string
      if (data.coparticipacao !== undefined)
        processedData.coparticipacao = data.coparticipacao;
      if (data.statusPagamento !== undefined)
        processedData.statusPagamento = data.statusPagamento;
      if (data.desconto !== undefined) processedData.desconto = data.desconto;
      if (data.exameId !== undefined) processedData.exameId = data.exameId;
      if (data.planoId !== undefined) processedData.planoId = data.planoId;
      if (data.cpfPagador !== undefined)
        processedData.cpfPagador = data.cpfPagador;

      // NÃO atualiza: dataHoraCons, cpfFuncSaude, cpfPaciente (são FKs compostas)

      if (Object.keys(processedData).length === 0) {
        throw new NotFoundError("Nenhum campo válido para atualizar");
      }

      const results = await db
        .update(pagamento)
        .set(processedData)
        .where(eq(pagamento.pagamentoId, pagamentoId))
        .returning();
      if (!results[0])
        throw new NotFoundError(`Pagamento ${pagamentoId} não encontrado`);
      return results[0];
    } catch (error) {
      console.error(`Erro ao atualizar pagamento ${pagamentoId}:`, error);
      throw error;
    }
  }

  async delete(pagamentoId: number): Promise<Pagamento> {
    const results = await db
      .delete(pagamento)
      .where(eq(pagamento.pagamentoId, pagamentoId))
      .returning();
    if (!results[0])
      throw new NotFoundError(`Pagamento ${pagamentoId} não encontrado`);
    return results[0];
  }
}
