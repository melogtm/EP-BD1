import { Router } from "express";
import { DiagnosticoController } from "../controllers/diagnostico.controller";

const diagnosticoRoutes = Router();
const diagnosticoController = new DiagnosticoController();

diagnosticoRoutes.post(
  "/",
  diagnosticoController.create.bind(diagnosticoController)
);
diagnosticoRoutes.get(
  "/",
  diagnosticoController.getAll.bind(diagnosticoController)
);
diagnosticoRoutes.get(
  "/:cid",
  diagnosticoController.getById.bind(diagnosticoController)
);
diagnosticoRoutes.patch(
  "/:cid",
  diagnosticoController.update.bind(diagnosticoController)
);
diagnosticoRoutes.delete(
  "/:cid",
  diagnosticoController.delete.bind(diagnosticoController)
);

export { diagnosticoRoutes };
