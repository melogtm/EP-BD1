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
}

export default AdminService;
