// schemas.types.ts

import type { pessoa } from "./schemas";
import type { empresa } from "./schemas";
import type { localSala } from "./schemas";
import type { plantao } from "./schemas";
import type { diagnostico } from "./schemas";
import type { medicamento } from "./schemas";
import type { paciente } from "./schemas";
import type { funcionario } from "./schemas";
import type { funcionarioSaude } from "./schemas";
import type { funcionarioAdm } from "./schemas";
import type { prestTerceirizado } from "./schemas";
import type { produto } from "./schemas";
import type { operadoraPlanoSaude } from "./schemas";
import type { planoDeSaude } from "./schemas";
import type { prontuario } from "./schemas";
import type { telefonePessoa } from "./schemas";
import type { telefoneEmpresa } from "./schemas";
import type { consulta } from "./schemas";
import type { receita } from "./schemas";
import type { exame } from "./schemas";
import type { pagamento } from "./schemas";
import type { itemReceita } from "./schemas";
import type { pacientePossuiPlano } from "./schemas";
import type { realizaPlantao } from "./schemas";
import type { alteraProduto } from "./schemas";
import type { consultaDiagnostico } from "./schemas";

export type Pessoa = typeof pessoa.$inferSelect;
export type PessoaInsert = typeof pessoa.$inferInsert;

export type Empresa = typeof empresa.$inferSelect;
export type EmpresaInsert = typeof empresa.$inferInsert;

export type LocalSala = typeof localSala.$inferSelect;
export type LocalSalaInsert = typeof localSala.$inferInsert;

export type Plantao = typeof plantao.$inferSelect;
export type PlantaoInsert = typeof plantao.$inferInsert;

export type Diagnostico = typeof diagnostico.$inferSelect;
export type DiagnosticoInsert = typeof diagnostico.$inferInsert;

export type Medicamento = typeof medicamento.$inferSelect;
export type MedicamentoInsert = typeof medicamento.$inferInsert;

export type Paciente = typeof paciente.$inferSelect;
export type PacienteInsert = typeof paciente.$inferInsert;

export type Funcionario = typeof funcionario.$inferSelect;
export type FuncionarioInsert = typeof funcionario.$inferInsert;

export type FuncionarioSaude = typeof funcionarioSaude.$inferSelect;
export type FuncionarioSaudeInsert = typeof funcionarioSaude.$inferInsert;

export type FuncionarioAdm = typeof funcionarioAdm.$inferSelect;
export type FuncionarioAdmInsert = typeof funcionarioAdm.$inferInsert;

export type PrestTerceirizado = typeof prestTerceirizado.$inferSelect;
export type PrestTerceirizadoInsert = typeof prestTerceirizado.$inferInsert;

export type Produto = typeof produto.$inferSelect;
export type ProdutoInsert = typeof produto.$inferInsert;

export type OperadoraPlanoSaude = typeof operadoraPlanoSaude.$inferSelect;
export type OperadoraPlanoSaudeInsert = typeof operadoraPlanoSaude.$inferInsert;

export type PlanoDeSaude = typeof planoDeSaude.$inferSelect;
export type PlanoDeSaudeInsert = typeof planoDeSaude.$inferInsert;

export type Prontuario = typeof prontuario.$inferSelect;
export type ProntuarioInsert = typeof prontuario.$inferInsert;

export type TelefonePessoa = typeof telefonePessoa.$inferSelect;
export type TelefonePessoaInsert = typeof telefonePessoa.$inferInsert;

export type TelefoneEmpresa = typeof telefoneEmpresa.$inferSelect;
export type TelefoneEmpresaInsert = typeof telefoneEmpresa.$inferInsert;

export type Consulta = typeof consulta.$inferSelect;
export type ConsultaInsert = typeof consulta.$inferInsert;

export type Receita = typeof receita.$inferSelect;
export type ReceitaInsert = typeof receita.$inferInsert;

export type Exame = typeof exame.$inferSelect;
export type ExameInsert = typeof exame.$inferInsert;

export type Pagamento = typeof pagamento.$inferSelect;
export type PagamentoInsert = typeof pagamento.$inferInsert;

export type ItemReceita = typeof itemReceita.$inferSelect;
export type ItemReceitaInsert = typeof itemReceita.$inferInsert;

export type PacientePossuiPlano = typeof pacientePossuiPlano.$inferSelect;
export type PacientePossuiPlanoInsert = typeof pacientePossuiPlano.$inferInsert;

export type RealizaPlantao = typeof realizaPlantao.$inferSelect;
export type RealizaPlantaoInsert = typeof realizaPlantao.$inferInsert;

export type AlteraProduto = typeof alteraProduto.$inferSelect;
export type AlteraProdutoInsert = typeof alteraProduto.$inferInsert;

export type ConsultaDiagnostico = typeof consultaDiagnostico.$inferSelect;
export type ConsultaDiagnosticoInsert = typeof consultaDiagnostico.$inferInsert;
