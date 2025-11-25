import express from "express";
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
import { pessoaRoutes } from "./routes/pessoa.routes";
import { empresaRoutes } from "./routes/empresa.routes";
import { produtoRoutes } from "./routes/produto.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.use("/pessoas", pessoaRoutes);
app.use("/empresas", empresaRoutes);
app.use("/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
