import { Router } from "express";
import { LocalSalaController } from "../controllers/local-sala.controller";

const localSalaRoutes = Router();
const localSalaController = new LocalSalaController();

localSalaRoutes.post("/", localSalaController.create.bind(localSalaController));
localSalaRoutes.get("/", localSalaController.getAll.bind(localSalaController));
localSalaRoutes.get(
  "/:numeroSala",
  localSalaController.getById.bind(localSalaController)
);
localSalaRoutes.patch(
  "/:numeroSala",
  localSalaController.update.bind(localSalaController)
);
localSalaRoutes.delete(
  "/:numeroSala",
  localSalaController.delete.bind(localSalaController)
);

export { localSalaRoutes };
