import { Router } from "express";
import { PessoaController } from "../controllers/pessoa.controller";

const pessoaRoutes = Router();
const pessoaController = new PessoaController();

pessoaRoutes.post("/", pessoaController.create.bind(pessoaController));
pessoaRoutes.get("/", pessoaController.getAll.bind(pessoaController));
pessoaRoutes.get("/:cpf", pessoaController.getById.bind(pessoaController));
pessoaRoutes.put("/:cpf", pessoaController.update.bind(pessoaController));
pessoaRoutes.delete("/:cpf", pessoaController.delete.bind(pessoaController));

export { pessoaRoutes };
