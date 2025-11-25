import { Router } from "express";
import { PlantaoController } from "../controllers/plantao.controller";

const plantaoRoutes = Router();
const plantaoController = new PlantaoController();

plantaoRoutes.post("/", plantaoController.create.bind(plantaoController));
plantaoRoutes.get("/", plantaoController.getAll.bind(plantaoController));
plantaoRoutes.get(
  "/:plantaoId",
  plantaoController.getById.bind(plantaoController)
);
plantaoRoutes.patch(
  "/:plantaoId",
  plantaoController.update.bind(plantaoController)
);
plantaoRoutes.delete(
  "/:plantaoId",
  plantaoController.delete.bind(plantaoController)
);

export { plantaoRoutes };
