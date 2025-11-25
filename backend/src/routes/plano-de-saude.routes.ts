import { Router } from "express";
import { PlanoDeSaudeController } from "../controllers/plano-de-saude.controller";

const planoDeSaudeRoutes = Router();
const planoDeSaudeController = new PlanoDeSaudeController();

planoDeSaudeRoutes.post(
  "/",
  planoDeSaudeController.create.bind(planoDeSaudeController)
);
planoDeSaudeRoutes.get(
  "/",
  planoDeSaudeController.getAll.bind(planoDeSaudeController)
);
planoDeSaudeRoutes.get(
  "/:planoId",
  planoDeSaudeController.getById.bind(planoDeSaudeController)
);
planoDeSaudeRoutes.patch(
  "/:planoId",
  planoDeSaudeController.update.bind(planoDeSaudeController)
);
planoDeSaudeRoutes.delete(
  "/:planoId",
  planoDeSaudeController.delete.bind(planoDeSaudeController)
);

export { planoDeSaudeRoutes };
