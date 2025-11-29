import { db } from "../db/index";
import {
  pagamento,
  paciente,
  funcionario,
  funcionarioSaude,
  pessoa,
  consulta,
  exame,
  telefonePessoa,
} from "../db/schemas/schemas";
import { and, eq, gte, lt, inArray } from "drizzle-orm";

export class AnalyticsRepository {
  async getPagamentosAll(): Promise<any[]> {
    return await db.query.pagamento.findMany({
      with: {
        plano: true,
      },
    });
  }

  async getFuncionariosQueSaoPacientes(): Promise<any[]> {
    // pacientes that also exist in funcionario table
    const rows = await db
      .select({ cpf: paciente.cpf })
      .from(paciente)
      .innerJoin(funcionario, eq(paciente.cpf, funcionario.cpf));
    return rows.map((r: any) => r.cpf);
  }

  async getPagamentosByPacientes(cpfs: string[]): Promise<any[]> {
    if (cpfs.length === 0) return [];
    return await db.select().from(pagamento).where(inArray(pagamento.cpfPaciente, cpfs));
  }

  async countConsultasByPacientes(cpfs: string[]): Promise<any[]> {
    if (cpfs.length === 0) return [];
    const rows = await db.select({ cpf: consulta.cpfPaciente }).from(consulta).where(inArray(consulta.cpfPaciente, cpfs));
    return rows.map((r: any) => r.cpfPaciente ?? r.cpf);
  }

  async getPessoasByCpfs(cpfs: string[]) {
    if (cpfs.length === 0) return [];
    return await db.select().from(pessoa).where(inArray(pessoa.cpf, cpfs));
  }

  async getTelefonesByCpfs(cpfs: string[]) {
    if (cpfs.length === 0) return [];
    return await db.select().from(telefonePessoa).where(inArray(telefonePessoa.cpf, cpfs));
  }

  async getPacientesComMaisCancelamentos(limit = 10): Promise<any[]> {
    // fetch consultas with status Cancelado and aggregate in JS
    const rows = await db.select().from(consulta).where(eq(consulta.statusAtendimento, 'Cancelado'));
    return rows;
  }

  async getPacientesComConsultasSemExames(): Promise<any[]> {
    // fetch pacientes that have consultas but no exames
    const pacientesWithConsultas = await db.select({ cpf: consulta.cpfPaciente }).from(consulta);
    const cpfs = Array.from(new Set(pacientesWithConsultas.map((r: any) => r.cpfPaciente || r.cpf)));
    if (cpfs.length === 0) return [];
    const exames = await db.select({ cpf: exame.cpfPaciente }).from(exame).where(inArray(exame.cpfPaciente, cpfs));
    const examesSet = new Set(exames.map((e: any) => e.cpf));
    const result: string[] = [];
    for (const c of cpfs) if (!examesSet.has(c)) result.push(c);
    return result;
  }

  async findConsultasByDateAndMedico(start: Date, end: Date, medicoCpf?: string) {
    const conds: any[] = [gte(consulta.dataHoraAgendada, start), lt(consulta.dataHoraAgendada, end), eq(consulta.statusAtendimento, 'Agendado')];
    if (medicoCpf) conds.push(eq(consulta.cpfFuncSaude, medicoCpf));
    return await db.query.consulta.findMany({
      where: and(...conds),
      with: {
        paciente: { with: { pessoa: true } },
        funcionarioSaude: { with: { funcionario: { with: { pessoa: true } } } },
      },
    });
  }
}

export default AnalyticsRepository;
