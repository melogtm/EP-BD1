import { ConsultaRepository } from "../repositories/consulta.repository";
import { FuncionarioSaudeRepository } from "../repositories/funcionario-saude.repository";
import { PacienteRepository } from "../repositories/paciente.repository";
import type { Consulta, ConsultaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";
import { db } from "../db/index";
import { consulta, funcionarioSaude, funcionario } from "../db/schemas/schemas";
import { and, eq, gte, lt, or } from "drizzle-orm";

export class ConsultaService {
  constructor(private repository = new ConsultaRepository()) {}

  private funcionarioRepo = new FuncionarioSaudeRepository();
  private pacienteRepo = new PacienteRepository();

  async create(data: ConsultaInsert): Promise<Consulta> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Consulta[]> {
    return this.repository.findAll();
  }

  async getById(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string
  ): Promise<Consulta> {
    const consulta = await this.repository.findById(
      dataHoraAgendada,
      cpfFuncSaude,
      cpfPaciente
    );
    if (!consulta) throw new NotFoundError("Consulta não encontrada");
    return consulta;
  }

  async getByPaciente(cpfPaciente: string): Promise<Consulta[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async getByMedico(cpfFuncSaude: string): Promise<Consulta[]> {
    return this.repository.findByMedico(cpfFuncSaude);
  }

  async update(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string,
    data: Partial<ConsultaInsert>
  ): Promise<Consulta> {
    return this.repository.update(
      dataHoraAgendada,
      cpfFuncSaude,
      cpfPaciente,
      data
    );
  }

  async delete(
    dataHoraAgendada: Date,
    cpfFuncSaude: string,
    cpfPaciente: string
  ): Promise<Consulta> {
    return this.repository.delete(dataHoraAgendada, cpfFuncSaude, cpfPaciente);
  }

  async getConsultasPassadas(cpfPaciente: string): Promise<Consulta[]> {
    const rows = (await this.repository.findPastByPaciente(
      cpfPaciente
    )) as any[];
    return rows.map((r: any, idx: number) => ({
      id: idx + 1,
      dataHoraAgendada: r.dataHoraAgendada
        ? new Date(r.dataHoraAgendada).toISOString().split(".")[0]
        : null,
      cpfFuncSaude: r.cpfFuncSaude,
      medico: { nome: r.funcionarioSaude?.funcionario?.pessoa?.nome ?? null },
      cpfPaciente: r.cpfPaciente,
      status: r.statusAtendimento
        ? String(r.statusAtendimento).toLowerCase()
        : null,
    })) as any;
  }

  async getConsultasFuturas(cpfPaciente: string): Promise<Consulta[]> {
    const rows = (await this.repository.findFutureByPaciente(
      cpfPaciente
    )) as any[];
    return rows.map((r: any, idx: number) => ({
      id: idx + 1,
      dataHoraAgendada: r.dataHoraAgendada
        ? new Date(r.dataHoraAgendada).toISOString().split(".")[0]
        : null,
      cpfFuncSaude: r.cpfFuncSaude,
      medico: { nome: r.funcionarioSaude?.funcionario?.pessoa?.nome ?? null },
      cpfPaciente: r.cpfPaciente,
      status: r.statusAtendimento
        ? String(r.statusAtendimento).toLowerCase()
        : null,
    })) as any;
  }

  async getHorariosDisponiveis(
    cpfPaciente: string,
    especialidade: string,
    data: string
  ): Promise<string[]> {
    // Validate patient
    const paciente = await this.pacienteRepo.findById(cpfPaciente);
    if (!paciente) throw new NotFoundError("Paciente não encontrado");

    // Find medics with the specialty
    const medicos = await this.funcionarioRepo.findByEspecialidade(
      especialidade
    );
    if (!medicos || medicos.length === 0) return [];

    const medicosCpfs = medicos.map((m: any) => m.cpf);

    // Build start/end of the requested day
    const start = new Date(data + "T00:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // Build OR condition for medics CPFs
    let medicosCondition: any = null;
    for (const cpf of medicosCpfs) {
      const c = eq(consulta.cpfFuncSaude, cpf);
      medicosCondition = medicosCondition ? or(medicosCondition, c) : c;
    }

    // Query booked consultations for that day for these medics or for the patient
    const booked = await db.select().from(consulta).where(
      and(
        gte(consulta.dataHoraAgendada, start),
        lt(consulta.dataHoraAgendada, end),
        eq(consulta.statusAtendimento, "Agendado"),
        or(medicosCondition, eq(consulta.cpfPaciente, cpfPaciente))
      )
    );

    const bookedSet = new Set<string>();
    for (const b of booked) {
      if (!b.dataHoraAgendada) continue;
      const d = new Date(b.dataHoraAgendada);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      bookedSet.add(`${hh}:${mm}`);
    }

    // Assumptions: working hours 08:00 - 17:00, 30-minute slots
    const slots: string[] = [];
    const SLOT_MINUTES = 30;
    const WORK_START_HOUR = 8;
    const WORK_END_HOUR = 17; // exclusive

    const cursor = new Date(start);
    cursor.setHours(WORK_START_HOUR, 0, 0, 0);
    const endWork = new Date(start);
    endWork.setHours(WORK_END_HOUR, 0, 0, 0);

    while (cursor < endWork) {
      const hh = String(cursor.getHours()).padStart(2, "0");
      const mm = String(cursor.getMinutes()).padStart(2, "0");
      const slot = `${hh}:${mm}`;
      if (!bookedSet.has(slot)) slots.push(slot);
      cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
    }

    return slots;
  }

  async getAgendaMedicoDia(
    cpfMedico: string,
    data: string
  ): Promise<any[]> {
    // validate medico
    const medico = await this.funcionarioRepo.findById(cpfMedico);
    if (!medico) throw new NotFoundError("Médico não encontrado");

    const rows = (await this.repository.findByMedicoDia(
      cpfMedico,
      data
    )) as any[];

    // sort by scheduled time ascending
    rows.sort((a: any, b: any) => {
      const da = a.dataHoraAgendada ? new Date(a.dataHoraAgendada).getTime() : 0;
      const db = b.dataHoraAgendada ? new Date(b.dataHoraAgendada).getTime() : 0;
      return da - db;
    });

    return rows.map((r: any, idx: number) => ({
      id: idx + 1,
      dataHoraAgendada: r.dataHoraAgendada
        ? new Date(r.dataHoraAgendada).toISOString().split(".")[0]
        : null,
      cpfFuncSaude: r.cpfFuncSaude,
      paciente: {
        cpf: r.paciente?.cpf ?? null,
        nome: r.paciente?.pessoa?.nome ?? null,
      },
      status: r.statusAtendimento
        ? String(r.statusAtendimento).toLowerCase()
        : null,
    }));
  }

  async getMedicoDisponivel(
    cpfPaciente: string,
    especialidade: string,
    data: string,
    horario: string
  ): Promise<any> {
    // validate patient
    const paciente = await this.pacienteRepo.findById(cpfPaciente);
    if (!paciente) throw new NotFoundError("Paciente não encontrado");

    // find medics by specialty
    const medicos = await this.funcionarioRepo.findByEspecialidade(especialidade);
    if (!medicos || medicos.length === 0) {
      return { disponivel: false };
    }

    const dateTime = new Date(`${data}T${horario}`);

    // check patient double-booking
    const patientBusy = await db
      .select()
      .from(consulta)
      .where(
        and(
          eq(consulta.cpfPaciente, cpfPaciente),
          eq(consulta.dataHoraAgendada, dateTime),
          eq(consulta.statusAtendimento, "Agendado")
        )
      );
    if (patientBusy.length > 0) {
      return { disponivel: false, reason: "Paciente já possui consulta neste horário" };
    }

    // find first medic without an Agendado consulta at this datetime
    for (const m of medicos) {
      const busy = await db
        .select()
        .from(consulta)
        .where(
          and(
            eq(consulta.cpfFuncSaude, m.cpf),
            eq(consulta.dataHoraAgendada, dateTime),
            eq(consulta.statusAtendimento, "Agendado")
          )
        );
      if (busy.length === 0) {
        // fetch funcionario to get name and sala
        const func = await db.query.funcionario
          .findFirst({ where: eq(funcionario.cpf, m.cpf), with: { pessoa: true } })
          .catch(() => null as any);

        const nome = func?.pessoa?.nome ?? null;
        const salaDisponivel = func?.salaAlocacao ?? null;

        return {
          cpfFuncSaude: m.cpf,
          nomeMedico: nome,
          salaDisponivel,
          disponivel: true,
        };
      }
    }

    return { disponivel: false };
  }
}
