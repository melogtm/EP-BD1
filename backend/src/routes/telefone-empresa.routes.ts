import { Router } from "express";
import { TelefoneEmpresaController } from "../controllers/telefone-empresa.controller";

const telefoneEmpresaRoutes = Router();
const telefoneEmpresaController = new TelefoneEmpresaController();

telefoneEmpresaRoutes.post("/", telefoneEmpresaController.create.bind(telefoneEmpresaController));
telefoneEmpresaRoutes.get("/", telefoneEmpresaController.getAll.bind(telefoneEmpresaController));
telefoneEmpresaRoutes.get("/empresa/:cnpj", telefoneEmpresaController.getByEmpresa.bind(telefoneEmpresaController));
telefoneEmpresaRoutes.delete("/:cnpj/:codPais/:ddd/:telefone", telefoneEmpresaController.delete.bind(telefoneEmpresaController));

export { telefoneEmpresaRoutes };
