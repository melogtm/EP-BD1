import express from "express";
import cors from "cors";
import { diagnosticoRoutes } from "./routes/diagnostico.routes";
import { medicamentoRoutes } from "./routes/medicamento.routes";
import { localSalaRoutes } from "./routes/local-sala.routes";
import { plantaoRoutes } from "./routes/plantao.routes";
import { operadoraPlanoSaudeRoutes } from "./routes/operadora-plano-saude.routes";
import { planoDeSaudeRoutes } from "./routes/plano-de-saude.routes";
import { pacienteRoutes } from "./routes/paciente.routes";
import { funcionarioRoutes } from "./routes/funcionario.routes";
import { funcionarioSaudeRoutes } from "./routes/funcionario-saude.routes";
import { funcionarioAdmRoutes } from "./routes/funcionario-adm.routes";
import { prestTerceirizadoRoutes } from "./routes/prest-terceirizado.routes";
import { telefonePessoaRoutes } from "./routes/telefone-pessoa.routes";
import { telefoneEmpresaRoutes } from "./routes/telefone-empresa.routes";
import { prontuarioRoutes } from "./routes/prontuario.routes";
import { consultaRoutes } from "./routes/consulta.routes";
import { receitaRoutes } from "./routes/receita.routes";
import { exameRoutes } from "./routes/exame.routes";
import { pagamentoRoutes } from "./routes/pagamento.routes";
import { itemReceitaRoutes } from "./routes/item-receita.routes";
import { pacientePossuiPlanoRoutes } from "./routes/paciente-possui-plano.routes";
import { realizaPlantaoRoutes } from "./routes/realiza-plantao.routes";
import { alteraProdutoRoutes } from "./routes/altera-produto.routes";
import { consultaDiagnosticoRoutes } from "./routes/consulta-diagnostico.routes";
import { pessoaRoutes } from "./routes/pessoa.routes";
import { empresaRoutes } from "./routes/empresa.routes";
import { produtoRoutes } from "./routes/produto.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://caiobritodev-hospita-58ko.bolt.host",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

// Rotas
app.use("/diagnosticos", diagnosticoRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/salas", localSalaRoutes);
app.use("/plantoes", plantaoRoutes);
app.use("/operadoras", operadoraPlanoSaudeRoutes);
app.use("/planos", planoDeSaudeRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/funcionarios", funcionarioRoutes);
app.use("/funcionarios-saude", funcionarioSaudeRoutes);
app.use("/funcionarios-adm", funcionarioAdmRoutes);
app.use("/prestadores", prestTerceirizadoRoutes);
app.use("/telefones-pessoa", telefonePessoaRoutes);
app.use("/telefones-empresa", telefoneEmpresaRoutes);
app.use("/prontuarios", prontuarioRoutes);
app.use("/consultas", consultaRoutes);
app.use("/receitas", receitaRoutes);
app.use("/exames", exameRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/itens-receita", itemReceitaRoutes);
app.use("/pacientes-planos", pacientePossuiPlanoRoutes);
app.use("/realiza-plantoes", realizaPlantaoRoutes);
app.use("/altera-produtos", alteraProdutoRoutes);
app.use("/consulta-diagnosticos", consultaDiagnosticoRoutes);
app.use("/pessoas", pessoaRoutes);
app.use("/empresas", empresaRoutes);
app.use("/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
