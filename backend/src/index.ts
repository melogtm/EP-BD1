import express from "express";
import * as dotenv from "dotenv";
import { pessoaRoutes } from "./routes/pessoa.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/pessoas", pessoaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
