import express from "express";
import { editoraRoutes } from "./routes/editora.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/editoras', editoraRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});