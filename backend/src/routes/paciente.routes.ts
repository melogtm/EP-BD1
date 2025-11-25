import { Router } from "express";
import { PacienteController } from "../controllers/paciente.controller";

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

pacienteRoutes.post("/", pacienteController.create.bind(pacienteController));
pacienteRoutes.get("/", pacienteController.getAll.bind(pacienteController));
pacienteRoutes.get("/:cpf", pacienteController.getById.bind(pacienteController));
pacienteRoutes.patch("/:cpf", pacienteController.update.bind(pacienteController));
pacienteRoutes.delete("/:cpf", pacienteController.delete.bind(pacienteController));

export { pacienteRoutes };
