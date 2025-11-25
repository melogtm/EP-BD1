CREATE TABLE "altera_produto" (
	"cpf_funcionario" varchar(14) NOT NULL,
	"prod_id" serial NOT NULL,
	"datahoramodificacao" timestamp (3) NOT NULL,
	CONSTRAINT "altera_produto_cpf_funcionario_prod_id_datahoramodificacao_pk" PRIMARY KEY("cpf_funcionario","prod_id","datahoramodificacao")
);
--> statement-breakpoint
CREATE TABLE "consulta" (
	"datahoraagendada" timestamp (3) NOT NULL,
	"cpf_funcsaude" varchar(14) NOT NULL,
	"cpf_paciente" varchar(14) NOT NULL,
	"sala" integer,
	"datahorainicio" timestamp (3),
	"datahorafim" timestamp (3),
	"valoratendimento" numeric(10, 2),
	"observacoesclinicas" text,
	"tipoatendimento" varchar(50),
	"statusatendimento" varchar(50),
	CONSTRAINT "consulta_datahoraagendada_cpf_funcsaude_cpf_paciente_pk" PRIMARY KEY("datahoraagendada","cpf_funcsaude","cpf_paciente")
);
--> statement-breakpoint
CREATE TABLE "consulta_diagnostico" (
	"cid" varchar(20) NOT NULL,
	"datahora_cons" timestamp (3) NOT NULL,
	"cpf_paciente" varchar(14) NOT NULL,
	"cpf_funcsaude" varchar(14) NOT NULL,
	CONSTRAINT "consulta_diagnostico_cid_datahora_cons_cpf_paciente_cpf_funcsaude_pk" PRIMARY KEY("cid","datahora_cons","cpf_paciente","cpf_funcsaude")
);
--> statement-breakpoint
CREATE TABLE "diagnostico" (
	"cid" varchar(20) PRIMARY KEY NOT NULL,
	"descricao" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "empresa" (
	"cnpj" varchar(18) PRIMARY KEY NOT NULL,
	"razao_social" varchar(255),
	"end_rua" varchar(255),
	"end_num" varchar(20),
	"end_bairro" varchar(100),
	"end_cidade" varchar(100),
	"end_uf" char(2),
	"end_pais" varchar(50),
	"end_cep" varchar(20),
	"end_complem" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "exame" (
	"exameid" serial PRIMARY KEY NOT NULL,
	"tipoexame" varchar(100),
	"datapedido" date,
	"datahorarealiz" timestamp (3),
	"valorexame" numeric(10, 2),
	"laudo" text,
	"statusresultado" varchar(50),
	"datahora_cons" timestamp (3),
	"cpf_paciente" varchar(14),
	"cpf_funcsaude_solicitou" varchar(14),
	"cpf_funcsaude_realizou" varchar(14),
	"sala" integer
);
--> statement-breakpoint
CREATE TABLE "funcionario" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL,
	"dataadmissao" date,
	"salariobase" numeric(10, 2),
	"statuscargo" varchar(50),
	"horariotrab" varchar(100),
	"salaalocacao" integer
);
--> statement-breakpoint
CREATE TABLE "funcionario_adm" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionario_saude" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL,
	"registroprofissional" varchar(50),
	"funcao" varchar(100),
	"especialidade" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "item_receita" (
	"receitaid" serial NOT NULL,
	"nomemedicamentogenerico" varchar(255) NOT NULL,
	"posologia" varchar(255),
	CONSTRAINT "item_receita_receitaid_nomemedicamentogenerico_pk" PRIMARY KEY("receitaid","nomemedicamentogenerico")
);
--> statement-breakpoint
CREATE TABLE "local_sala" (
	"numerosala" integer PRIMARY KEY NOT NULL,
	"tiposala" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "medicamento" (
	"nome" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operadora_plano_de_saude" (
	"cnpj" varchar(18) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paciente" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL,
	"tiposanguineo" varchar(5),
	"datafalec" date,
	"profissao" varchar(100),
	"statuscadastro" varchar(20),
	"cpf_resp" varchar(14)
);
--> statement-breakpoint
CREATE TABLE "paciente_possui_plano" (
	"cpf_paciente" varchar(14) NOT NULL,
	"planoid" serial NOT NULL,
	"numerocarteirinha" varchar(50),
	CONSTRAINT "paciente_possui_plano_cpf_paciente_planoid_pk" PRIMARY KEY("cpf_paciente","planoid")
);
--> statement-breakpoint
CREATE TABLE "pagamento" (
	"pagamentoid" serial PRIMARY KEY NOT NULL,
	"valor" numeric(10, 2),
	"datapag" date,
	"coparticipacao" numeric(10, 2),
	"status_pagamento" varchar(50),
	"desconto" numeric(10, 2),
	"datahora_cons" timestamp (3),
	"cpf_paciente" varchar(14),
	"cpf_funcsaude" varchar(14),
	"exameid" integer,
	"planoid" integer,
	"cpf_pagador" varchar(14),
	CONSTRAINT "chk_origem_pagamento" CHECK (
    (
      "pagamento"."datahora_cons" IS NOT NULL
      AND "pagamento"."cpf_paciente" IS NOT NULL
      AND "pagamento"."cpf_funcsaude" IS NOT NULL
      AND "pagamento"."exameid" IS NULL
    )
    OR
    (
      "pagamento"."datahora_cons" IS NULL
      AND "pagamento"."cpf_paciente" IS NULL
      AND "pagamento"."cpf_funcsaude" IS NULL
      AND "pagamento"."exameid" IS NOT NULL
    )
  )
);
--> statement-breakpoint
CREATE TABLE "pessoa" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255),
	"genero" char(1),
	"datanasc_dia" integer,
	"datanasc_mes" integer,
	"datanasc_ano" integer,
	"end_rua" varchar(255),
	"end_num" varchar(20),
	"end_bairro" varchar(100),
	"end_cidade" varchar(100),
	"end_uf" char(2),
	"end_pais" varchar(50),
	"end_cep" varchar(20),
	"end_complem" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "plano_de_saude" (
	"planoid" serial PRIMARY KEY NOT NULL,
	"nomeplano" varchar(100),
	"modalidade" varchar(50),
	"cnpj_operadora" varchar(18)
);
--> statement-breakpoint
CREATE TABLE "plantao" (
	"plantaoid" integer PRIMARY KEY NOT NULL,
	"datahorainicio" timestamp (3),
	"datahorafim" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "prest_terceirizado" (
	"cpf" varchar(14) PRIMARY KEY NOT NULL,
	"funcao" varchar(100),
	"cnpj_empresa" varchar(18)
);
--> statement-breakpoint
CREATE TABLE "produto" (
	"prod_id" serial PRIMARY KEY NOT NULL,
	"descricao" varchar(255),
	"validade" date,
	"fabricante" varchar(100),
	"cpf_cadastrou" varchar(14),
	"cnpj_fornecedor" varchar(18),
	"sala" integer
);
--> statement-breakpoint
CREATE TABLE "prontuario" (
	"cpf_paciente" varchar(14) PRIMARY KEY NOT NULL,
	"datahoracriacao" timestamp (3),
	"cpf_atualizou" varchar(14),
	"datahoraatualizacao" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "realiza_plantao" (
	"cpf_funcsaude" varchar(14) NOT NULL,
	"plantaoid" serial NOT NULL,
	CONSTRAINT "realiza_plantao_cpf_funcsaude_plantaoid_pk" PRIMARY KEY("cpf_funcsaude","plantaoid")
);
--> statement-breakpoint
CREATE TABLE "receita" (
	"receitaid" serial PRIMARY KEY NOT NULL,
	"validade" date,
	"dataemissao" date,
	"observacoes" text,
	"datahora_cons" timestamp (3),
	"cpf_paciente" varchar(14),
	"cpf_funcsaude" varchar(14)
);
--> statement-breakpoint
CREATE TABLE "telefone_empresa" (
	"cnpj" varchar(18) NOT NULL,
	"codpais" varchar(5) NOT NULL,
	"ddd" varchar(5) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	CONSTRAINT "telefone_empresa_cnpj_codpais_ddd_telefone_pk" PRIMARY KEY("cnpj","codpais","ddd","telefone")
);
--> statement-breakpoint
CREATE TABLE "telefone_pessoa" (
	"cpf" varchar(14) NOT NULL,
	"codpais" varchar(5) NOT NULL,
	"ddd" varchar(5) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	CONSTRAINT "telefone_pessoa_cpf_codpais_ddd_telefone_pk" PRIMARY KEY("cpf","codpais","ddd","telefone")
);
--> statement-breakpoint
ALTER TABLE "altera_produto" ADD CONSTRAINT "fk_altera_func" FOREIGN KEY ("cpf_funcionario") REFERENCES "public"."funcionario"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "altera_produto" ADD CONSTRAINT "fk_altera_prod" FOREIGN KEY ("prod_id") REFERENCES "public"."produto"("prod_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consulta" ADD CONSTRAINT "fk_cons_medico" FOREIGN KEY ("cpf_funcsaude") REFERENCES "public"."funcionario_saude"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consulta" ADD CONSTRAINT "fk_cons_paciente" FOREIGN KEY ("cpf_paciente") REFERENCES "public"."paciente"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consulta" ADD CONSTRAINT "fk_cons_sala" FOREIGN KEY ("sala") REFERENCES "public"."local_sala"("numerosala") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consulta_diagnostico" ADD CONSTRAINT "fk_consdiag_cid" FOREIGN KEY ("cid") REFERENCES "public"."diagnostico"("cid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consulta_diagnostico" ADD CONSTRAINT "fk_consdiag_cons" FOREIGN KEY ("datahora_cons","cpf_funcsaude","cpf_paciente") REFERENCES "public"."consulta"("datahoraagendada","cpf_funcsaude","cpf_paciente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exame" ADD CONSTRAINT "fk_exame_consulta" FOREIGN KEY ("datahora_cons","cpf_funcsaude_solicitou","cpf_paciente") REFERENCES "public"."consulta"("datahoraagendada","cpf_funcsaude","cpf_paciente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exame" ADD CONSTRAINT "fk_exame_realiza" FOREIGN KEY ("cpf_funcsaude_realizou") REFERENCES "public"."funcionario_saude"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exame" ADD CONSTRAINT "fk_exame_sala" FOREIGN KEY ("sala") REFERENCES "public"."local_sala"("numerosala") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcionario" ADD CONSTRAINT "fk_func_pessoa" FOREIGN KEY ("cpf") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcionario" ADD CONSTRAINT "fk_func_sala" FOREIGN KEY ("salaalocacao") REFERENCES "public"."local_sala"("numerosala") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcionario_adm" ADD CONSTRAINT "fk_funcadm_func" FOREIGN KEY ("cpf") REFERENCES "public"."funcionario"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcionario_saude" ADD CONSTRAINT "fk_funcsauDe_func" FOREIGN KEY ("cpf") REFERENCES "public"."funcionario"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_receita" ADD CONSTRAINT "fk_item_receita" FOREIGN KEY ("receitaid") REFERENCES "public"."receita"("receitaid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_receita" ADD CONSTRAINT "fk_item_medicamento" FOREIGN KEY ("nomemedicamentogenerico") REFERENCES "public"."medicamento"("nome") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operadora_plano_de_saude" ADD CONSTRAINT "fk_operadora_emp" FOREIGN KEY ("cnpj") REFERENCES "public"."empresa"("cnpj") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paciente" ADD CONSTRAINT "fk_paciente_pessoa" FOREIGN KEY ("cpf") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paciente" ADD CONSTRAINT "fk_paciente_resp" FOREIGN KEY ("cpf_resp") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paciente_possui_plano" ADD CONSTRAINT "fk_possui_paciente" FOREIGN KEY ("cpf_paciente") REFERENCES "public"."paciente"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paciente_possui_plano" ADD CONSTRAINT "fk_possui_plano" FOREIGN KEY ("planoid") REFERENCES "public"."plano_de_saude"("planoid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "fk_pag_consulta" FOREIGN KEY ("datahora_cons","cpf_funcsaude","cpf_paciente") REFERENCES "public"."consulta"("datahoraagendada","cpf_funcsaude","cpf_paciente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "fk_pag_exame" FOREIGN KEY ("exameid") REFERENCES "public"."exame"("exameid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "fk_pag_plano" FOREIGN KEY ("planoid") REFERENCES "public"."plano_de_saude"("planoid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamento" ADD CONSTRAINT "fk_pag_pagador" FOREIGN KEY ("cpf_pagador") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plano_de_saude" ADD CONSTRAINT "fk_plano_operadora" FOREIGN KEY ("cnpj_operadora") REFERENCES "public"."operadora_plano_de_saude"("cnpj") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prest_terceirizado" ADD CONSTRAINT "fk_terc_pessoa" FOREIGN KEY ("cpf") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prest_terceirizado" ADD CONSTRAINT "fk_terc_empresa" FOREIGN KEY ("cnpj_empresa") REFERENCES "public"."empresa"("cnpj") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produto" ADD CONSTRAINT "fk_prod_adm" FOREIGN KEY ("cpf_cadastrou") REFERENCES "public"."funcionario_adm"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produto" ADD CONSTRAINT "fk_prod_forn" FOREIGN KEY ("cnpj_fornecedor") REFERENCES "public"."empresa"("cnpj") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produto" ADD CONSTRAINT "fk_prod_sala" FOREIGN KEY ("sala") REFERENCES "public"."local_sala"("numerosala") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prontuario" ADD CONSTRAINT "fk_pront_paciente" FOREIGN KEY ("cpf_paciente") REFERENCES "public"."paciente"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prontuario" ADD CONSTRAINT "fk_pront_medico" FOREIGN KEY ("cpf_atualizou") REFERENCES "public"."funcionario_saude"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realiza_plantao" ADD CONSTRAINT "fk_realiza_func" FOREIGN KEY ("cpf_funcsaude") REFERENCES "public"."funcionario_saude"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realiza_plantao" ADD CONSTRAINT "fk_realiza_plant" FOREIGN KEY ("plantaoid") REFERENCES "public"."plantao"("plantaoid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receita" ADD CONSTRAINT "fk_receita_consulta" FOREIGN KEY ("datahora_cons","cpf_funcsaude","cpf_paciente") REFERENCES "public"."consulta"("datahoraagendada","cpf_funcsaude","cpf_paciente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telefone_empresa" ADD CONSTRAINT "fk_tel_empresa" FOREIGN KEY ("cnpj") REFERENCES "public"."empresa"("cnpj") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telefone_pessoa" ADD CONSTRAINT "fk_tel_pessoa" FOREIGN KEY ("cpf") REFERENCES "public"."pessoa"("cpf") ON DELETE no action ON UPDATE no action;