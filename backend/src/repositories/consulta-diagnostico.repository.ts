import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { consultaDiagnostico } from "../db/schemas/schemas";
import type { ConsultaDiagnostico, ConsultaDiagnosticoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ConsultaDiagnosticoRepository {
  async create(data: ConsultaDiagnosticoInsert): Promise<ConsultaDiagnostico> {
    const [result] = await db.insert(consultaDiagnostico).values(data).returning();
    if (!result) throw new Error("Falha ao criar diagnóstico da consulta");
    return result;
  }

  async findAll(): Promise<ConsultaDiagnostico[]> {
    return await db.select().from(consultaDiagnostico);
  }

  async findByConsulta(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string): Promise<ConsultaDiagnostico[]> {
    return await db
      .select()
      .from(consultaDiagnostico)
      .where(
        and(
          eq(consultaDiagnostico.dataHoraAgendada, dataHoraAgendada),
          eq(consultaDiagnostico.cpfFuncSaude, cpfFuncSaude),
          eq(consultaDiagnostico.cpfPaciente, cpfPaciente)
        )
      );
  }

  async delete(dataHoraAgendada: Date, cpfFuncSaude: string, cpfPaciente: string, codigoDiagnostico: string): Promise<ConsultaDiagnostico> {
    const results = await db
      .delete(consultaDiagnostico)
      .where(
        and(
          eq(consultaDiagnostico.dataHoraAgendada, dataHoraAgendada),
          eq(consultaDiagnostico.cpfFuncSaude, cpfFuncSaude),
          eq(consultaDiagnostico.cpfPaciente, cpfPaciente),
          eq(consultaDiagnostico.codigoDiagnostico, codigoDiagnostico)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Diagnóstico não encontrado");
    return results[0];
  }
}
