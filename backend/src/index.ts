import express from "express";
import * as dotenv from "dotenv";
import { pessoaRoutes } from "./routes/pessoa.routes";
import { empresaRoutes } from "./routes/empresa.routes";
import { produtoRoutes } from "./routes/produto.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/pessoas", pessoaRoutes);
app.use("/empresas", empresaRoutes);
app.use("/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
