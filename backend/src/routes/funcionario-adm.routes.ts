import { Router } from "express";
import { FuncionarioAdmController } from "../controllers/funcionario-adm.controller";

const funcionarioAdmRoutes = Router();
const funcionarioAdmController = new FuncionarioAdmController();

funcionarioAdmRoutes.post("/", funcionarioAdmController.create.bind(funcionarioAdmController));
funcionarioAdmRoutes.get("/", funcionarioAdmController.getAll.bind(funcionarioAdmController));
funcionarioAdmRoutes.get("/:cpf", funcionarioAdmController.getById.bind(funcionarioAdmController));
funcionarioAdmRoutes.patch("/:cpf", funcionarioAdmController.update.bind(funcionarioAdmController));
funcionarioAdmRoutes.delete("/:cpf", funcionarioAdmController.delete.bind(funcionarioAdmController));

export { funcionarioAdmRoutes };
