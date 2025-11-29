import AnalyticsRepository from "../repositories/analytics.repository";

export class AdminService {
  constructor(private repo = new AnalyticsRepository()) {}

  async getPagamentosTotais(): Promise<any> {
    const rows = (await this.repo.getPagamentosAll()) as any[];

    let total = 0;
    const porPaciente: Record<string, number> = {};
    const porPlano: Record<string, number> = {};

    for (const r of rows) {
      const valor = r.valor ? Number(r.valor) : 0;
      total += valor;

      const cpf = r.cpfPaciente ?? "unknown";
      porPaciente[cpf] = (porPaciente[cpf] || 0) + valor;

      const planoNome = r.plano?.nomePlano ?? "Particular";
      porPlano[planoNome] = (porPlano[planoNome] || 0) + valor;
    }

    // Round to 2 decimals for nicer output
    const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

    const porPacienteRounded: Record<string, number> = {};
    for (const k of Object.keys(porPaciente)) porPacienteRounded[k] = round(porPaciente[k] ?? 0);

    const porPlanoRounded: Record<string, number> = {};
    for (const k of Object.keys(porPlano)) porPlanoRounded[k] = round(porPlano[k] ?? 0);

    return {
      total: round(total),
      porPaciente: porPacienteRounded,
      porPlano: porPlanoRounded,
    };
  }

  async getFuncionariosPacientes(): Promise<any[]> {
    const cpfs = await this.repo.getFuncionariosQueSaoPacientes();
    if (!cpfs || cpfs.length === 0) return [];

    const pagamentos = await this.repo.getPagamentosByPacientes(cpfs);
    const consultasList = await this.repo.countConsultasByPacientes(cpfs);
    const pessoas = await this.repo.getPessoasByCpfs(cpfs);

    const pagamentosMap: Record<string, number> = {};
    for (const p of pagamentos) {
      const cpf = p.cpfPaciente ?? 'unknown';
      const valor = p.valor ? Number(p.valor) : 0;
      pagamentosMap[cpf] = (pagamentosMap[cpf] || 0) + valor;
    }

    const consultasCountMap: Record<string, number> = {};
    for (const c of consultasList) {
      const cpf = typeof c === 'string' ? c : c.cpfPaciente ?? c.cpf;
      consultasCountMap[cpf] = (consultasCountMap[cpf] || 0) + 1;
    }

    const pessoaMap: Record<string, any> = {};
    for (const p of pessoas) pessoaMap[p.cpf] = p;

    return cpfs.map((cpf: string) => ({
      cpf,
      nome: pessoaMap[cpf]?.nome ?? null,
      totalGasto: Math.round((pagamentosMap[cpf] || 0) * 100) / 100,
      totalConsultas: consultasCountMap[cpf] || 0,
    }));
  }

  async getPacientesCancelamentos(limit = 10): Promise<any[]> {
    const rows = await this.repo.getPacientesComMaisCancelamentos();
    const counts: Record<string, number> = {};
    for (const r of rows) {
      const cpf = r.cpfPaciente ?? r.cpf;
      counts[cpf] = (counts[cpf] || 0) + 1;
    }
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    const cpfs = sorted.map((s) => s[0]);
    const pessoas = await this.repo.getPessoasByCpfs(cpfs);
    const pessoaMap: Record<string, any> = {};
    for (const p of pessoas) pessoaMap[p.cpf] = p;
    return sorted.map(([cpf, cnt]) => ({ cpf, nome: pessoaMap[cpf]?.nome ?? null, cancelamentos: cnt }));
  }

  async getPacientesSemExames(): Promise<any[]> {
    const cpfs = await this.repo.getPacientesComConsultasSemExames();
    if (!cpfs || cpfs.length === 0) return [];
    const consultaRows = await this.repo.countConsultasByPacientes(cpfs);
    const consultaCounts: Record<string, number> = {};
    for (const c of consultaRows) {
      const cpf = typeof c === 'string' ? c : c.cpfPaciente ?? c.cpf;
      consultaCounts[cpf] = (consultaCounts[cpf] || 0) + 1;
    }
    const pessoas = await this.repo.getPessoasByCpfs(cpfs);
    const pessoaMap: Record<string, any> = {};
    for (const p of pessoas) pessoaMap[p.cpf] = p;
    return cpfs.map((cpf: string) => ({ cpf, nome: pessoaMap[cpf]?.nome ?? null, totalConsultas: consultaCounts[cpf] || 0 }));
  }

  async getConfirmacoesDiaMedico(data?: string, medicoCpf?: string): Promise<any[]> {
    const date = data ? new Date(data + 'T00:00:00') : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const consultas = await this.repo.findConsultasByDateAndMedico(start, end, medicoCpf);
    if (!consultas || consultas.length === 0) return [];

    // collect patient cpfs to fetch phones
    const patientCpfs = Array.from(new Set(consultas.map((c: any) => c.cpfPaciente)));
    const telefones = await this.repo.getTelefonesByCpfs(patientCpfs);
    const telefoneMap: Record<string, any[]> = {};
    for (const t of telefones) {
      const cpfKey = t.cpf ?? 'unknown';
      if (!telefoneMap[cpfKey]) telefoneMap[cpfKey] = [];
      telefoneMap[cpfKey].push(t);
    }

    // group by medico
    const grouped: Record<string, any> = {};
    for (const c of consultas) {
      const medicoCpfKey = c.cpfFuncSaude;
      const medicoNome = c.funcionarioSaude?.funcionario?.pessoa?.nome ?? null;
      grouped[medicoCpfKey] = grouped[medicoCpfKey] || { data: start.toISOString().split('T')[0], medicoCpf: medicoCpfKey, medicoNome, pacientes: [] };
      const paciente = c.paciente?.pessoa ?? {};
      const cpf = c.cpfPaciente;
      grouped[medicoCpfKey].pacientes.push({
        cpf,
        nome: paciente.nome ?? null,
        telefone: (telefoneMap[cpf] && telefoneMap[cpf][0]) ? `${telefoneMap[cpf][0].ddd} ${telefoneMap[cpf][0].telefone}` : null,
        email: paciente.email ?? null,
      });
    }

    return Object.values(grouped);
  }
}

export default AdminService;

