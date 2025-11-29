import { Router } from "express";
import { FuncionarioSaudeController } from "../controllers/funcionario-saude.controller";

const funcionarioSaudeRoutes = Router();
const funcionarioSaudeController = new FuncionarioSaudeController();

funcionarioSaudeRoutes.post(
  "/",
  funcionarioSaudeController.create.bind(funcionarioSaudeController)
);
funcionarioSaudeRoutes.get(
  "/",
  funcionarioSaudeController.getAll.bind(funcionarioSaudeController)
);
funcionarioSaudeRoutes.get(
  "/especialidades",
  funcionarioSaudeController.getEspecialidades.bind(funcionarioSaudeController)
);
funcionarioSaudeRoutes.get(
  "/:cpf",
  funcionarioSaudeController.getById.bind(funcionarioSaudeController)
);
funcionarioSaudeRoutes.patch(
  "/:cpf",
  funcionarioSaudeController.update.bind(funcionarioSaudeController)
);
funcionarioSaudeRoutes.delete(
  "/:cpf",
  funcionarioSaudeController.delete.bind(funcionarioSaudeController)
);

export { funcionarioSaudeRoutes };
