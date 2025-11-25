import {
  pgTable,
  varchar,
  integer,
  char,
  text,
  date,
  decimal,
  timestamp,
  primaryKey,
  check,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============= ENTIDADES BÁSICAS =============

export const pessoa = pgTable("pessoa", {
  cpf: varchar("cpf", { length: 14 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  genero: char("genero", { length: 1 }),
  dataNascDia: integer("datanasc_dia"),
  dataNascMes: integer("datanasc_mes"),
  dataNascAno: integer("datanasc_ano"),
  endRua: varchar("end_rua", { length: 255 }),
  endNum: varchar("end_num", { length: 20 }),
  endBairro: varchar("end_bairro", { length: 100 }),
  endCidade: varchar("end_cidade", { length: 100 }),
  endUf: char("end_uf", { length: 2 }),
  endPais: varchar("end_pais", { length: 50 }),
  endCep: varchar("end_cep", { length: 20 }),
  endComplem: varchar("end_complem", { length: 100 }),
});

export const empresa = pgTable("empresa", {
  cnpj: varchar("cnpj", { length: 18 }).primaryKey(),
  razaoSocial: varchar("razao_social", { length: 255 }),
  endRua: varchar("end_rua", { length: 255 }),
  endNum: varchar("end_num", { length: 20 }),
  endBairro: varchar("end_bairro", { length: 100 }),
  endCidade: varchar("end_cidade", { length: 100 }),
  endUf: char("end_uf", { length: 2 }),
  endPais: varchar("end_pais", { length: 50 }),
  endCep: varchar("end_cep", { length: 20 }),
  endComplem: varchar("end_complem", { length: 100 }),
});

export const localSala = pgTable("local_sala", {
  numeroSala: integer("numerosala").primaryKey(),
  tipoSala: varchar("tiposala", { length: 50 }),
});

export const plantao = pgTable("plantao", {
  plantaoId: integer("plantaoid").primaryKey(),
  dataHoraInicio: timestamp("datahorainicio", { precision: 3 }),
  dataHoraFim: timestamp("datahorafim", { precision: 3 }),
});

export const diagnostico = pgTable("diagnostico", {
  cid: varchar("cid", { length: 20 }).primaryKey(),
  descricao: varchar("descricao", { length: 255 }),
});

export const medicamento = pgTable("medicamento", {
  nome: varchar("nome", { length: 255 }).primaryKey(),
});

// ============= SUBTIPOS / PESSOAS =============

export const paciente = pgTable(
  "paciente",
  {
    cpf: varchar("cpf", { length: 14 }).primaryKey(),
    tipoSanguineo: varchar("tiposanguineo", { length: 5 }),
    dataFalec: date("datafalec"),
    profissao: varchar("profissao", { length: 100 }),
    statusCadastro: varchar("statuscadastro", { length: 20 }),
    cpfResp: varchar("cpf_resp", { length: 14 }),
  },
  (table) => ({
    fkPacientePessoa: foreignKey({
      columns: [table.cpf],
      foreignColumns: [pessoa.cpf],
      name: "fk_paciente_pessoa",
    }),
    fkPacienteResp: foreignKey({
      columns: [table.cpfResp],
      foreignColumns: [pessoa.cpf],
      name: "fk_paciente_resp",
    }),
  })
);

export const funcionario = pgTable(
  "funcionario",
  {
    cpf: varchar("cpf", { length: 14 }).primaryKey(),
    dataAdmissao: date("dataadmissao"),
    salarioBase: decimal("salariobase", { precision: 10, scale: 2 }),
    statusCargo: varchar("statuscargo", { length: 50 }),
    horarioTrab: varchar("horariotrab", { length: 100 }),
    salaAlocacao: integer("salaalocacao"),
  },
  (table) => ({
    fkFuncPessoa: foreignKey({
      columns: [table.cpf],
      foreignColumns: [pessoa.cpf],
      name: "fk_func_pessoa",
    }),
    fkFuncSala: foreignKey({
      columns: [table.salaAlocacao],
      foreignColumns: [localSala.numeroSala],
      name: "fk_func_sala",
    }),
  })
);

export const funcionarioSaude = pgTable(
  "funcionario_saude",
  {
    cpf: varchar("cpf", { length: 14 }).primaryKey(),
    registroProfissional: varchar("registroprofissional", { length: 50 }),
    funcao: varchar("funcao", { length: 100 }),
    especialidade: varchar("especialidade", { length: 100 }),
  },
  (table) => ({
    fkFuncSaudeFunc: foreignKey({
      columns: [table.cpf],
      foreignColumns: [funcionario.cpf],
      name: "fk_funcsauDe_func",
    }),
  })
);

export const funcionarioAdm = pgTable(
  "funcionario_adm",
  {
    cpf: varchar("cpf", { length: 14 }).primaryKey(),
  },
  (table) => ({
    fkFuncAdmFunc: foreignKey({
      columns: [table.cpf],
      foreignColumns: [funcionario.cpf],
      name: "fk_funcadm_func",
    }),
  })
);

export const prestTerceirizado = pgTable(
  "prest_terceirizado",
  {
    cpf: varchar("cpf", { length: 14 }).primaryKey(),
    funcao: varchar("funcao", { length: 100 }),
    cnpjEmpresa: varchar("cnpj_empresa", { length: 18 }),
  },
  (table) => ({
    fkTercPessoa: foreignKey({
      columns: [table.cpf],
      foreignColumns: [pessoa.cpf],
      name: "fk_terc_pessoa",
    }),
    fkTercEmpresa: foreignKey({
      columns: [table.cnpjEmpresa],
      foreignColumns: [empresa.cnpj],
      name: "fk_terc_empresa",
    }),
  })
);

// ============= PRODUTO / PLANOS / PRONTUÁRIO =============

export const produto = pgTable(
  "produto",
  {
    prodId: integer("prod_id").primaryKey(),
    descricao: varchar("descricao", { length: 255 }),
    validade: date("validade"),
    fabricante: varchar("fabricante", { length: 100 }),
    cpfCadastrou: varchar("cpf_cadastrou", { length: 14 }),
    cnpjFornecedor: varchar("cnpj_fornecedor", { length: 18 }),
    sala: integer("sala"),
  },
  (table) => ({
    fkProdAdm: foreignKey({
      columns: [table.cpfCadastrou],
      foreignColumns: [funcionarioAdm.cpf],
      name: "fk_prod_adm",
    }),
    fkProdForn: foreignKey({
      columns: [table.cnpjFornecedor],
      foreignColumns: [empresa.cnpj],
      name: "fk_prod_forn",
    }),
    fkProdSala: foreignKey({
      columns: [table.sala],
      foreignColumns: [localSala.numeroSala],
      name: "fk_prod_sala",
    }),
  })
);

export const operadoraPlanoSaude = pgTable(
  "operadora_plano_de_saude",
  {
    cnpj: varchar("cnpj", { length: 18 }).primaryKey(),
  },
  (table) => ({
    fkOperadoraEmp: foreignKey({
      columns: [table.cnpj],
      foreignColumns: [empresa.cnpj],
      name: "fk_operadora_emp",
    }),
  })
);

export const planoDeSaude = pgTable(
  "plano_de_saude",
  {
    planoId: integer("planoid").primaryKey(),
    nomePlano: varchar("nomeplano", { length: 100 }),
    modalidade: varchar("modalidade", { length: 50 }),
    cnpjOperadora: varchar("cnpj_operadora", { length: 18 }),
  },
  (table) => ({
    fkPlanoOperadora: foreignKey({
      columns: [table.cnpjOperadora],
      foreignColumns: [operadoraPlanoSaude.cnpj],
      name: "fk_plano_operadora",
    }),
  })
);

export const prontuario = pgTable(
  "prontuario",
  {
    cpfPaciente: varchar("cpf_paciente", { length: 14 }).primaryKey(),
    dataHoraCriacao: timestamp("datahoracriacao", { precision: 3 }),
    cpfAtualizou: varchar("cpf_atualizou", { length: 14 }),
    dataHoraAtualizacao: timestamp("datahoraatualizacao", { precision: 3 }),
  },
  (table) => ({
    fkProntPaciente: foreignKey({
      columns: [table.cpfPaciente],
      foreignColumns: [paciente.cpf],
      name: "fk_pront_paciente",
    }),
    fkProntMedico: foreignKey({
      columns: [table.cpfAtualizou],
      foreignColumns: [funcionarioSaude.cpf],
      name: "fk_pront_medico",
    }),
  })
);

// ============= TELEFONES =============

export const telefonePessoa = pgTable(
  "telefone_pessoa",
  {
    cpf: varchar("cpf", { length: 14 }).notNull(),
    codPais: varchar("codpais", { length: 5 }).notNull(),
    ddd: varchar("ddd", { length: 5 }).notNull(),
    telefone: varchar("telefone", { length: 20 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.cpf, table.codPais, table.ddd, table.telefone],
    }),
    fkTelPessoa: foreignKey({
      columns: [table.cpf],
      foreignColumns: [pessoa.cpf],
      name: "fk_tel_pessoa",
    }),
  })
);

export const telefoneEmpresa = pgTable(
  "telefone_empresa",
  {
    cnpj: varchar("cnpj", { length: 18 }).notNull(),
    codPais: varchar("codpais", { length: 5 }).notNull(),
    ddd: varchar("ddd", { length: 5 }).notNull(),
    telefone: varchar("telefone", { length: 20 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.cnpj, table.codPais, table.ddd, table.telefone],
    }),
    fkTelEmpresa: foreignKey({
      columns: [table.cnpj],
      foreignColumns: [empresa.cnpj],
      name: "fk_tel_empresa",
    }),
  })
);

// ============= CONSULTA (PK composta) =============

export const consulta = pgTable(
  "consulta",
  {
    dataHoraAgendada: timestamp("datahoraagendada", { precision: 3 }).notNull(),
    cpfFuncSaude: varchar("cpf_funcsaude", { length: 14 }).notNull(),
    cpfPaciente: varchar("cpf_paciente", { length: 14 }).notNull(),
    sala: integer("sala"),
    dataHoraInicio: timestamp("datahorainicio", { precision: 3 }),
    dataHoraFim: timestamp("datahorafim", { precision: 3 }),
    valorAtendimento: decimal("valoratendimento", {
      precision: 10,
      scale: 2,
    }),
    observacoesClinicas: text("observacoesclinicas"),
    tipoAtendimento: varchar("tipoatendimento", { length: 50 }),
    statusAtendimento: varchar("statusatendimento", { length: 50 }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.dataHoraAgendada, table.cpfFuncSaude, table.cpfPaciente],
    }),
    fkConsMedico: foreignKey({
      columns: [table.cpfFuncSaude],
      foreignColumns: [funcionarioSaude.cpf],
      name: "fk_cons_medico",
    }),
    fkConsPaciente: foreignKey({
      columns: [table.cpfPaciente],
      foreignColumns: [paciente.cpf],
      name: "fk_cons_paciente",
    }),
    fkConsSala: foreignKey({
      columns: [table.sala],
      foreignColumns: [localSala.numeroSala],
      name: "fk_cons_sala",
    }),
  })
);

// ============= RECEITA / EXAME / PAGAMENTO =============

export const receita = pgTable(
  "receita",
  {
    receitaId: integer("receitaid").primaryKey(),
    validade: date("validade"),
    dataEmissao: date("dataemissao"),
    observacoes: text("observacoes"),
    dataHoraCons: timestamp("datahora_cons", { precision: 3 }),
    cpfPaciente: varchar("cpf_paciente", { length: 14 }),
    cpfFuncSaude: varchar("cpf_funcsaude", { length: 14 }),
  },
  (table) => ({
    fkReceitaConsulta: foreignKey({
      columns: [table.dataHoraCons, table.cpfFuncSaude, table.cpfPaciente],
      foreignColumns: [
        consulta.dataHoraAgendada,
        consulta.cpfFuncSaude,
        consulta.cpfPaciente,
      ],
      name: "fk_receita_consulta",
    }),
  })
);

export const exame = pgTable(
  "exame",
  {
    exameId: integer("exameid").primaryKey(),
    tipoExame: varchar("tipoexame", { length: 100 }),
    dataPedido: date("datapedido"),
    dataHoraRealiz: timestamp("datahorarealiz", { precision: 3 }),
    valorExame: decimal("valorexame", { precision: 10, scale: 2 }),
    laudo: text("laudo"),
    statusResultado: varchar("statusresultado", { length: 50 }),
    dataHoraCons: timestamp("datahora_cons", { precision: 3 }),
    cpfPaciente: varchar("cpf_paciente", { length: 14 }),
    cpfFuncSaudeSolicitou: varchar("cpf_funcsaude_solicitou", {
      length: 14,
    }),
    cpfFuncSaudeRealizou: varchar("cpf_funcsaude_realizou", { length: 14 }),
    sala: integer("sala"),
  },
  (table) => ({
    fkExameConsulta: foreignKey({
      columns: [
        table.dataHoraCons,
        table.cpfFuncSaudeSolicitou,
        table.cpfPaciente,
      ],
      foreignColumns: [
        consulta.dataHoraAgendada,
        consulta.cpfFuncSaude,
        consulta.cpfPaciente,
      ],
      name: "fk_exame_consulta",
    }),
    fkExameRealiza: foreignKey({
      columns: [table.cpfFuncSaudeRealizou],
      foreignColumns: [funcionarioSaude.cpf],
      name: "fk_exame_realiza",
    }),
    fkExameSala: foreignKey({
      columns: [table.sala],
      foreignColumns: [localSala.numeroSala],
      name: "fk_exame_sala",
    }),
  })
);

export const pagamento = pgTable(
  "pagamento",
  {
    pagamentoId: integer("pagamentoid").primaryKey(),
    valor: decimal("valor", { precision: 10, scale: 2 }),
    dataPag: date("datapag"),
    coparticipacao: decimal("coparticipacao", { precision: 10, scale: 2 }),
    statusPagamento: varchar("status_pagamento", { length: 50 }),
    desconto: decimal("desconto", { precision: 10, scale: 2 }),
    dataHoraCons: timestamp("datahora_cons", { precision: 3 }),
    cpfPaciente: varchar("cpf_paciente", { length: 14 }),
    cpfFuncSaude: varchar("cpf_funcsaude", { length: 14 }),
    exameId: integer("exameid"),
    planoId: integer("planoid"),
    cpfPagador: varchar("cpf_pagador", { length: 14 }),
  },
  (table) => ({
    fkPagConsulta: foreignKey({
      columns: [table.dataHoraCons, table.cpfFuncSaude, table.cpfPaciente],
      foreignColumns: [
        consulta.dataHoraAgendada,
        consulta.cpfFuncSaude,
        consulta.cpfPaciente,
      ],
      name: "fk_pag_consulta",
    }),
    fkPagExame: foreignKey({
      columns: [table.exameId],
      foreignColumns: [exame.exameId],
      name: "fk_pag_exame",
    }),
    fkPagPlano: foreignKey({
      columns: [table.planoId],
      foreignColumns: [planoDeSaude.planoId],
      name: "fk_pag_plano",
    }),
    fkPagPagador: foreignKey({
      columns: [table.cpfPagador],
      foreignColumns: [pessoa.cpf],
      name: "fk_pag_pagador",
    }),
    chkOrigemPagamento: check(
      "chk_origem_pagamento",
      sql`
    (
      ${table.dataHoraCons} IS NOT NULL
      AND ${table.cpfPaciente} IS NOT NULL
      AND ${table.cpfFuncSaude} IS NOT NULL
      AND ${table.exameId} IS NULL
    )
    OR
    (
      ${table.dataHoraCons} IS NULL
      AND ${table.cpfPaciente} IS NULL
      AND ${table.cpfFuncSaude} IS NULL
      AND ${table.exameId} IS NOT NULL
    )
  `
    ),
  })
);

// ============ M:N QUE FALTAVAM (SEU MODELO TODO) ============

// ITEM_RECEITA (Receita x Medicamento) – já tinha exemplo, mas aqui completo
export const itemReceita = pgTable(
  "item_receita",
  {
    receitaId: integer("receitaid").notNull(),
    nomeMedicamentoGenerico: varchar("nomemedicamentogenerico", {
      length: 255,
    }).notNull(),
    posologia: varchar("posologia", { length: 255 }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.receitaId, table.nomeMedicamentoGenerico],
    }),
    fkItemReceita: foreignKey({
      columns: [table.receitaId],
      foreignColumns: [receita.receitaId],
      name: "fk_item_receita",
    }),
    fkItemMedicamento: foreignKey({
      columns: [table.nomeMedicamentoGenerico],
      foreignColumns: [medicamento.nome],
      name: "fk_item_medicamento",
    }),
  })
);

// PACIENTE_POSSUI_PLANO (Paciente x Plano)
export const pacientePossuiPlano = pgTable(
  "paciente_possui_plano",
  {
    cpfPaciente: varchar("cpf_paciente", { length: 14 }).notNull(),
    planoId: integer("planoid").notNull(),
    numeroCarteirinha: varchar("numerocarteirinha", { length: 50 }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cpfPaciente, table.planoId] }),
    fkPossuiPaciente: foreignKey({
      columns: [table.cpfPaciente],
      foreignColumns: [paciente.cpf],
      name: "fk_possui_paciente",
    }),
    fkPossuiPlano: foreignKey({
      columns: [table.planoId],
      foreignColumns: [planoDeSaude.planoId],
      name: "fk_possui_plano",
    }),
  })
);

// REALIZA_PLANTAO (FuncSaude x Plantao)
export const realizaPlantao = pgTable(
  "realiza_plantao",
  {
    cpfFuncSaude: varchar("cpf_funcsaude", { length: 14 }).notNull(),
    plantaoId: integer("plantaoid").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cpfFuncSaude, table.plantaoId] }),
    fkRealizaFunc: foreignKey({
      columns: [table.cpfFuncSaude],
      foreignColumns: [funcionarioSaude.cpf],
      name: "fk_realiza_func",
    }),
    fkRealizaPlant: foreignKey({
      columns: [table.plantaoId],
      foreignColumns: [plantao.plantaoId],
      name: "fk_realiza_plant",
    }),
  })
);

// ALTERA_PRODUTO (Func x Produto)
export const alteraProduto = pgTable(
  "altera_produto",
  {
    cpfFuncionario: varchar("cpf_funcionario", { length: 14 }).notNull(),
    prodId: integer("prod_id").notNull(),
    dataHoraModificacao: timestamp("datahoramodificacao", {
      precision: 3,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.cpfFuncionario, table.prodId, table.dataHoraModificacao],
    }),
    fkAlteraFunc: foreignKey({
      columns: [table.cpfFuncionario],
      foreignColumns: [funcionario.cpf],
      name: "fk_altera_func",
    }),
    fkAlteraProd: foreignKey({
      columns: [table.prodId],
      foreignColumns: [produto.prodId],
      name: "fk_altera_prod",
    }),
  })
);

// CONSULTA_DIAGNOSTICO (Consulta x Diagnostico)
export const consultaDiagnostico = pgTable(
  "consulta_diagnostico",
  {
    cid: varchar("cid", { length: 20 }).notNull(),
    dataHoraCons: timestamp("datahora_cons", { precision: 3 }).notNull(),
    cpfPaciente: varchar("cpf_paciente", { length: 14 }).notNull(),
    cpfFuncSaude: varchar("cpf_funcsaude", { length: 14 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [
        table.cid,
        table.dataHoraCons,
        table.cpfPaciente,
        table.cpfFuncSaude,
      ],
    }),
    fkConsDiagCid: foreignKey({
      columns: [table.cid],
      foreignColumns: [diagnostico.cid],
      name: "fk_consdiag_cid",
    }),
    fkConsDiagCons: foreignKey({
      columns: [table.dataHoraCons, table.cpfFuncSaude, table.cpfPaciente],
      foreignColumns: [
        consulta.dataHoraAgendada,
        consulta.cpfFuncSaude,
        consulta.cpfPaciente,
      ],
      name: "fk_consdiag_cons",
    }),
  })
);

// ============ RELATIONS (COMPLETANDO TUDO) ============

// PESSOA
export const pessoaRelations = relations(pessoa, ({ one, many }) => ({
  paciente: one(paciente, { fields: [pessoa.cpf], references: [paciente.cpf] }),
  funcionario: one(funcionario, {
    fields: [pessoa.cpf],
    references: [funcionario.cpf],
  }),
  telefones: many(telefonePessoa),
}));

// PACIENTE
export const pacienteRelations = relations(paciente, ({ one, many }) => ({
  pessoa: one(pessoa, { fields: [paciente.cpf], references: [pessoa.cpf] }),
  responsavel: one(pessoa, {
    fields: [paciente.cpfResp],
    references: [pessoa.cpf],
  }),
  consultas: many(consulta),
  planos: many(pacientePossuiPlano),
  prontuario: one(prontuario, {
    fields: [paciente.cpf],
    references: [prontuario.cpfPaciente],
  }),
}));

// FUNCIONARIO
export const funcionarioRelations = relations(funcionario, ({ one, many }) => ({
  pessoa: one(pessoa, { fields: [funcionario.cpf], references: [pessoa.cpf] }),
  sala: one(localSala, {
    fields: [funcionario.salaAlocacao],
    references: [localSala.numeroSala],
  }),
  saude: one(funcionarioSaude, {
    fields: [funcionario.cpf],
    references: [funcionarioSaude.cpf],
  }),
  adm: one(funcionarioAdm, {
    fields: [funcionario.cpf],
    references: [funcionarioAdm.cpf],
  }),
  alteracoesProduto: many(alteraProduto),
}));

// FUNCIONARIO_SAUDE
export const funcionarioSaudeRelations = relations(
  funcionarioSaude,
  ({ one, many }) => ({
    funcionario: one(funcionario, {
      fields: [funcionarioSaude.cpf],
      references: [funcionario.cpf],
    }),
    consultas: many(consulta),
    examesSolicitados: many(exame, {
      relationName: "examesSolicitados",
    }),
    examesRealizados: many(exame, {
      relationName: "examesRealizados",
    }),
    plantao: many(realizaPlantao),
  })
);

// FUNCIONARIO_ADM
export const funcionarioAdmRelations = relations(
  funcionarioAdm,
  ({ one, many }) => ({
    funcionario: one(funcionario, {
      fields: [funcionarioAdm.cpf],
      references: [funcionario.cpf],
    }),
    produtosCadastrados: many(produto),
  })
);

// PREST_TERCEIRIZADO
export const prestTerceirizadoRelations = relations(
  prestTerceirizado,
  ({ one }) => ({
    pessoa: one(pessoa, {
      fields: [prestTerceirizado.cpf],
      references: [pessoa.cpf],
    }),
    empresa: one(empresa, {
      fields: [prestTerceirizado.cnpjEmpresa],
      references: [empresa.cnpj],
    }),
  })
);

// PRODUTO
export const produtoRelations = relations(produto, ({ one, many }) => ({
  administrador: one(funcionarioAdm, {
    fields: [produto.cpfCadastrou],
    references: [funcionarioAdm.cpf],
  }),
  fornecedor: one(empresa, {
    fields: [produto.cnpjFornecedor],
    references: [empresa.cnpj],
  }),
  sala: one(localSala, {
    fields: [produto.sala],
    references: [localSala.numeroSala],
  }),
  alteracoes: many(alteraProduto),
}));

// OPERADORA_PLANO_DE_SAUDE
export const operadoraPlanoSaudeRelations = relations(
  operadoraPlanoSaude,
  ({ one, many }) => ({
    empresa: one(empresa, {
      fields: [operadoraPlanoSaude.cnpj],
      references: [empresa.cnpj],
    }),
    planos: many(planoDeSaude),
  })
);

// PLANO_DE_SAUDE
export const planoDeSaudeRelations = relations(
  planoDeSaude,
  ({ one, many }) => ({
    operadora: one(operadoraPlanoSaude, {
      fields: [planoDeSaude.cnpjOperadora],
      references: [operadoraPlanoSaude.cnpj],
    }),
    pacientes: many(pacientePossuiPlano),
    pagamentos: many(pagamento),
  })
);

// PRONTUARIO
export const prontuarioRelations = relations(prontuario, ({ one }) => ({
  paciente: one(paciente, {
    fields: [prontuario.cpfPaciente],
    references: [paciente.cpf],
  }),
  funcionarioAtualizou: one(funcionarioSaude, {
    fields: [prontuario.cpfAtualizou],
    references: [funcionarioSaude.cpf],
  }),
}));

// TELEFONE_PESSOA
export const telefonePessoaRelations = relations(telefonePessoa, ({ one }) => ({
  pessoa: one(pessoa, {
    fields: [telefonePessoa.cpf],
    references: [pessoa.cpf],
  }),
}));

// TELEFONE_EMPRESA
export const telefoneEmpresaRelations = relations(
  telefoneEmpresa,
  ({ one }) => ({
    empresa: one(empresa, {
      fields: [telefoneEmpresa.cnpj],
      references: [empresa.cnpj],
    }),
  })
);

// LOCAL_SALA
export const localSalaRelations = relations(localSala, ({ many }) => ({
  funcionarios: many(funcionario),
  consultas: many(consulta),
  exames: many(exame),
  produtos: many(produto),
}));

// CONSULTA
export const consultaRelations = relations(consulta, ({ one, many }) => ({
  paciente: one(paciente, {
    fields: [consulta.cpfPaciente],
    references: [paciente.cpf],
  }),
  funcionarioSaude: one(funcionarioSaude, {
    fields: [consulta.cpfFuncSaude],
    references: [funcionarioSaude.cpf],
  }),
  sala: one(localSala, {
    fields: [consulta.sala],
    references: [localSala.numeroSala],
  }),
  receitas: many(receita),
  exames: many(exame),
  pagamentos: many(pagamento),
  diagnosticos: many(consultaDiagnostico),
}));

// RECEITA
export const receitaRelations = relations(receita, ({ one, many }) => ({
  consulta: one(consulta, {
    fields: [receita.dataHoraCons, receita.cpfFuncSaude, receita.cpfPaciente],
    references: [
      consulta.dataHoraAgendada,
      consulta.cpfFuncSaude,
      consulta.cpfPaciente,
    ],
  }),
  itens: many(itemReceita),
}));

// EXAME
export const exameRelations = relations(exame, ({ one, many }) => ({
  consulta: one(consulta, {
    fields: [
      exame.dataHoraCons,
      exame.cpfFuncSaudeSolicitou,
      exame.cpfPaciente,
    ],
    references: [
      consulta.dataHoraAgendada,
      consulta.cpfFuncSaude,
      consulta.cpfPaciente,
    ],
  }),
  funcionarioRealizou: one(funcionarioSaude, {
    fields: [exame.cpfFuncSaudeRealizou],
    references: [funcionarioSaude.cpf],
  }),
  sala: one(localSala, {
    fields: [exame.sala],
    references: [localSala.numeroSala],
  }),
  pagamentos: many(pagamento),
}));

// PAGAMENTO
export const pagamentoRelations = relations(pagamento, ({ one }) => ({
  consulta: one(consulta, {
    fields: [
      pagamento.dataHoraCons,
      pagamento.cpfFuncSaude,
      pagamento.cpfPaciente,
    ],
    references: [
      consulta.dataHoraAgendada,
      consulta.cpfFuncSaude,
      consulta.cpfPaciente,
    ],
  }),
  exame: one(exame, {
    fields: [pagamento.exameId],
    references: [exame.exameId],
  }),
  plano: one(planoDeSaude, {
    fields: [pagamento.planoId],
    references: [planoDeSaude.planoId],
  }),
  pagador: one(pessoa, {
    fields: [pagamento.cpfPagador],
    references: [pessoa.cpf],
  }),
}));

// ITEM_RECEITA
export const itemReceitaRelations = relations(itemReceita, ({ one }) => ({
  receita: one(receita, {
    fields: [itemReceita.receitaId],
    references: [receita.receitaId],
  }),
  medicamento: one(medicamento, {
    fields: [itemReceita.nomeMedicamentoGenerico],
    references: [medicamento.nome],
  }),
}));

// PACIENTE_POSSUI_PLANO
export const pacientePossuiPlanoRelations = relations(
  pacientePossuiPlano,
  ({ one }) => ({
    paciente: one(paciente, {
      fields: [pacientePossuiPlano.cpfPaciente],
      references: [paciente.cpf],
    }),
    plano: one(planoDeSaude, {
      fields: [pacientePossuiPlano.planoId],
      references: [planoDeSaude.planoId],
    }),
  })
);

// REALIZA_PLANTAO
export const realizaPlantaoRelations = relations(realizaPlantao, ({ one }) => ({
  funcionarioSaude: one(funcionarioSaude, {
    fields: [realizaPlantao.cpfFuncSaude],
    references: [funcionarioSaude.cpf],
  }),
  plantao: one(plantao, {
    fields: [realizaPlantao.plantaoId],
    references: [plantao.plantaoId],
  }),
}));

// ALTERA_PRODUTO
export const alteraProdutoRelations = relations(alteraProduto, ({ one }) => ({
  funcionario: one(funcionario, {
    fields: [alteraProduto.cpfFuncionario],
    references: [funcionario.cpf],
  }),
  produto: one(produto, {
    fields: [alteraProduto.prodId],
    references: [produto.prodId],
  }),
}));

// CONSULTA_DIAGNOSTICO
export const consultaDiagnosticoRelations = relations(
  consultaDiagnostico,
  ({ one }) => ({
    diagnostico: one(diagnostico, {
      fields: [consultaDiagnostico.cid],
      references: [diagnostico.cid],
    }),
    consulta: one(consulta, {
      fields: [
        consultaDiagnostico.dataHoraCons,
        consultaDiagnostico.cpfFuncSaude,
        consultaDiagnostico.cpfPaciente,
      ],
      references: [
        consulta.dataHoraAgendada,
        consulta.cpfFuncSaude,
        consulta.cpfPaciente,
      ],
    }),
  })
);
