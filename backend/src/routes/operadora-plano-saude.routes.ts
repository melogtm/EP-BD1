import { Router } from "express";
import { OperadoraPlanoSaudeController } from "../controllers/operadora-plano-saude.controller";

const operadoraPlanoSaudeRoutes = Router();
const operadoraController = new OperadoraPlanoSaudeController();

operadoraPlanoSaudeRoutes.post(
  "/",
  operadoraController.create.bind(operadoraController)
);
operadoraPlanoSaudeRoutes.get(
  "/",
  operadoraController.getAll.bind(operadoraController)
);
operadoraPlanoSaudeRoutes.get(
  "/:cnpj",
  operadoraController.getById.bind(operadoraController)
);
operadoraPlanoSaudeRoutes.patch(
  "/:cnpj",
  operadoraController.update.bind(operadoraController)
);
operadoraPlanoSaudeRoutes.delete(
  "/:cnpj",
  operadoraController.delete.bind(operadoraController)
);

export { operadoraPlanoSaudeRoutes };
