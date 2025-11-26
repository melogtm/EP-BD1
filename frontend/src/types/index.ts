// Core Entities
export interface Diagnostico {
  cid: string;
  descricao: string;
}

export interface Medicamento {
  nome: string;
}

export interface LocalSala {
  numeroSala: number;
  tipoSala: string;
}

export interface Plantao {
  plantaoId?: number;
  dataHoraInicio: string;
  dataHoraFim: string;
}

export interface Pessoa {
  cpf: string;
  nome: string;
  email?: string;
  genero?: string;
  dataNascDia?: number;
  dataNascMes?: number;
  dataNascAno?: number;
  endRua?: string;
  endNum?: string;
  endBairro?: string;
  endCidade?: string;
  endUf?: string;
  endPais?: string;
  endCep?: string;
  endComplem?: string;
}

export interface Empresa {
  cnpj: string;
  razaoSocial: string;
  endRua: string;
  endNum: string;
  endBairro: string;
  endCidade: string;
  endUf: string;
  endPais: string;
  endCep: string;
  endComplem?: string;
}

export interface Paciente {
  cpf: string;
  tipoSanguineo: string;
  profissao: string;
  statusCadastro: string;
}

export interface Funcionario {
  cpf: string;
  dataAdmissao: string;
  salarioBase: number;
  statusCargo: string;
  horarioTrab: string;
  salaAlocacao: number;
}

export interface FuncionarioSaude {
  cpf: string;
  registroProfissional: string;
  funcao: string;
  especialidade: string;
}

export interface Prontuario {
  cpfPaciente: string;
  dataHoraCriacao: string;
  cpfAtualizou: string;
  dataHoraAtualizacao: string;
}

export interface Consulta {
  dataHoraAgendada: string;
  cpfFuncSaude: string;
  cpfPaciente: string;
  sala: number;
  dataHoraInicio?: string;
  dataHoraFim?: string;
  valorAtendimento?: number;
  observacoesClinicas?: string;
  tipoAtendimento: string;
  statusAtendimento: string;
}

export interface Receita {
  receitaId?: number;
  validade: string;
  dataEmissao: string;
  observacoes?: string;
  dataHoraCons: string;
  cpfPaciente: string;
  cpfFuncSaude: string;
}

export interface Exame {
  exameId?: number;
  tipoExame: string;
  descricao?: string;
  dataHoraSolicitacao: string;
  dataHoraRealizacao?: string;
  resultado?: string;
  observacoes?: string;
  statusResultado?: string;
  dataHoraCons: string;
  cpfPaciente: string;
  cpfFuncSaude: string;
}

export interface OperadoraPlanoSaude {
  cnpj: string;
}

export interface PlanoDeSaude {
  planoId?: number;
  nomePlano: string;
  modalidade: string;
  cnpjOperadora: string;
}

export interface Produto {
  produtoId?: number;
  descricao: string;
  validade: string;
  fabricante: string;
  cpfCadastrou: string;
  cnpjFornecedor: string;
  sala: number;
}

export interface FuncionarioAdm {
  cpf: string;
}

export interface PrestTerceirizado {
  cpf: string;
  funcao: string;
  cnpjEmpresa: string;
}

export interface TelefonePessoa {
  cpf: string;
  codPais: string;
  ddd: string;
  telefone: string;
}

export interface TelefoneEmpresa {
  cnpj: string;
  codPais: string;
  ddd: string;
  telefone: string;
}

export interface Pagamento {
  pagamentoId?: number;
  valor: string;
  dataPag: string;
  statusPagamento: string;
  desconto?: string;
  dataHoraCons?: string;
  cpfPaciente?: string;
  cpfFuncSaude?: string;
  exameId?: number;
}

export interface ItemReceita {
  receitaId: number;
  nomeMedicamento: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
}

export interface PacientePossuiPlano {
  cpfPaciente: string;
  planoId: number;
  numCarteira: string;
  statusVinculo: string;
}

export interface RealizaPlantao {
  cpf: string;
  plantaoId: number;
}

export interface AlteraProduto {
  codigoProduto: string;
  cpf: string;
  dataHoraAlteracao: string;
  descricao: string;
}

export interface ConsultaDiagnostico {
  dataHoraAgendada: string;
  cpfFuncSaude: string;
  cpfPaciente: string;
  codigoDiagnostico: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}
