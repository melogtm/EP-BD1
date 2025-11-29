import { and, eq, gte, lt, or } from "drizzle-orm";
import { db } from "../db/index";
import { consulta } from "../db/schemas/schemas";
import type { Consulta, ConsultaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class ConsultaRepository {
  async create(data: ConsultaInsert): Promise<Consulta> {
    try {
      const processedData: any = {
        ...data,
        dataHoraAgendada: data.dataHoraAgendada
          ? new Date(data.dataHoraAgendada)
          : null,
        dataHoraInicio: data.dataHoraInicio
          ? new Date(data.dataHoraInicio)
          : null,
        dataHoraFim: data.dataHoraFim ? new Date(data.dataHoraFim) : null,
      };

      const [result] = await db
        .insert(consulta)
        .values(processedData)
        .returning();
      if (!result) throw new Error("Falha ao criar consulta");
      return result;
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      throw error;
    }
  }

  async findAll(): Promise<Consulta[]> {
    return await db.select().from(consulta);
  }

  async findById(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string
  ): Promise<Consulta | null> {
    const results = await db
      .select()
      .from(consulta)
      .where(
        and(
          eq(consulta.dataHoraAgendada, dataHoraAgendada),
          eq(consulta.cpfFuncSaude, cpfFuncSaude),
          eq(consulta.cpfPaciente, cpfPaciente)
        )
      );
    return results[0] ?? null;
  }

  async findByPaciente(cpfPaciente: string): Promise<Consulta[]> {
    return await db
      .select()
      .from(consulta)
      .where(eq(consulta.cpfPaciente, cpfPaciente));
  }

  async findByMedico(cpfFuncSaude: string): Promise<Consulta[]> {
    return await db
      .select()
      .from(consulta)
      .where(eq(consulta.cpfFuncSaude, cpfFuncSaude));
  }

  async findPastByPaciente(cpfPaciente: string): Promise<Consulta[]> {
    const statuses = ["Cancelado", "Realizado"];

    let statusCondition: any = null;
    for (const s of statuses) {
      const cond = eq(consulta.statusAtendimento, s);
      statusCondition = statusCondition ? or(statusCondition, cond) : cond;
    }

    return await db.query.consulta.findMany({
      where: and(eq(consulta.cpfPaciente, cpfPaciente), statusCondition),
      with: {
        funcionarioSaude: {
          with: {
            funcionario: {
              with: {
                pessoa: true,
              },
            },
          },
        },
      },
    });
  }

  async findFutureByPaciente(cpfPaciente: string): Promise<Consulta[]> {
    const statuses = ["Agendado"];

    let statusCondition: any = null;
    for (const s of statuses) {
      const cond = eq(consulta.statusAtendimento, s);
      statusCondition = statusCondition ? or(statusCondition, cond) : cond;
    }

    return await db.query.consulta.findMany({
      where: and(eq(consulta.cpfPaciente, cpfPaciente), statusCondition),
      with: {
        funcionarioSaude: {
          with: {
            funcionario: {
              with: {
                pessoa: true,
              },
            },
          },
        },
      },
    });
  }

  async findByMedicoDia(cpfFuncSaude: string, dateIso: string): Promise<any[]> {
    // Build day range
    const start = new Date(dateIso + "T00:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return await db.query.consulta.findMany({
      where: and(
        eq(consulta.cpfFuncSaude, cpfFuncSaude),
        gte(consulta.dataHoraAgendada, start),
        lt(consulta.dataHoraAgendada, end)
      ),
      with: {
        paciente: {
          with: {
            pessoa: true,
          },
        },
      },
    });
  }


  async update(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string,
    data: Partial<ConsultaInsert>
  ): Promise<Consulta> {
    try {
      const processedData: any = { ...data };
      if (data.dataHoraAgendada) {
        processedData.dataHoraAgendada = new Date(data.dataHoraAgendada);
      }
      if (data.dataHoraInicio) {
        processedData.dataHoraInicio = new Date(data.dataHoraInicio);
      }
      if (data.dataHoraFim) {
        processedData.dataHoraFim = new Date(data.dataHoraFim);
      }

      const results = await db
        .update(consulta)
        .set(processedData)
        .where(
          and(
            eq(consulta.dataHoraAgendada, dataHoraAgendada),
            eq(consulta.cpfFuncSaude, cpfFuncSaude),
            eq(consulta.cpfPaciente, cpfPaciente)
          )
        )
        .returning();
      if (!results[0]) throw new NotFoundError("Consulta não encontrada");
      return results[0];
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      throw error;
    }
  }

  async delete(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string
  ): Promise<Consulta> {
    const results = await db
      .delete(consulta)
      .where(
        and(
          eq(consulta.dataHoraAgendada, dataHoraAgendada),
          eq(consulta.cpfFuncSaude, cpfFuncSaude),
          eq(consulta.cpfPaciente, cpfPaciente)
        )
      )
      .returning();
    if (!results[0]) throw new NotFoundError("Consulta não encontrada");
    return results[0];
  }
}
