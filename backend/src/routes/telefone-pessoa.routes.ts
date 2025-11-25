import { Router } from "express";
import { TelefonePessoaController } from "../controllers/telefone-pessoa.controller";

const telefonePessoaRoutes = Router();
const telefonePessoaController = new TelefonePessoaController();

telefonePessoaRoutes.post("/", telefonePessoaController.create.bind(telefonePessoaController));
telefonePessoaRoutes.get("/", telefonePessoaController.getAll.bind(telefonePessoaController));
telefonePessoaRoutes.get("/pessoa/:cpf", telefonePessoaController.getByPessoa.bind(telefonePessoaController));
telefonePessoaRoutes.delete("/:cpf/:codPais/:ddd/:telefone", telefonePessoaController.delete.bind(telefonePessoaController));

export { telefonePessoaRoutes };
