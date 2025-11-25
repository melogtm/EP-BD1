import { Router } from "express";
import { MedicamentoController } from "../controllers/medicamento.controller";

const medicamentoRoutes = Router();
const medicamentoController = new MedicamentoController();

medicamentoRoutes.post(
  "/",
  medicamentoController.create.bind(medicamentoController)
);
medicamentoRoutes.get(
  "/",
  medicamentoController.getAll.bind(medicamentoController)
);
medicamentoRoutes.get(
  "/:nome",
  medicamentoController.getById.bind(medicamentoController)
);
medicamentoRoutes.patch(
  "/:nome",
  medicamentoController.update.bind(medicamentoController)
);
medicamentoRoutes.delete(
  "/:nome",
  medicamentoController.delete.bind(medicamentoController)
);

export { medicamentoRoutes };
