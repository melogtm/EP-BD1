import express from "express";
import { diagnosticoRoutes } from "./routes/diagnostico.routes";
import { pessoaRoutes } from "./routes/pessoa.routes";
import { empresaRoutes } from "./routes/empresa.routes";
import { produtoRoutes } from "./routes/produto.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas
app.use("/diagnosticos", diagnosticoRoutes);
app.use("/pessoas", pessoaRoutes);
app.use("/empresas", empresaRoutes);
app.use("/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
