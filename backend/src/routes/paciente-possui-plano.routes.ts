import { Router } from "express";
import { PacientePossuiPlanoController } from "../controllers/paciente-possui-plano.controller";

const pacientePossuiPlanoRoutes = Router();
const pacientePossuiPlanoController = new PacientePossuiPlanoController();

pacientePossuiPlanoRoutes.post(
  "/",
  pacientePossuiPlanoController.create.bind(pacientePossuiPlanoController)
);
pacientePossuiPlanoRoutes.get(
  "/",
  pacientePossuiPlanoController.getAll.bind(pacientePossuiPlanoController)
);
pacientePossuiPlanoRoutes.get(
  "/paciente/:cpfPaciente",
  pacientePossuiPlanoController.getByPaciente.bind(
    pacientePossuiPlanoController
  )
);
pacientePossuiPlanoRoutes.delete(
  "/:cpfPaciente/:planoId",
  pacientePossuiPlanoController.delete.bind(pacientePossuiPlanoController)
);

export { pacientePossuiPlanoRoutes };
