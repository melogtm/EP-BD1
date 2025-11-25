import { Router } from "express";
import { ProntuarioController } from "../controllers/prontuario.controller";

const prontuarioRoutes = Router();
const prontuarioController = new ProntuarioController();

prontuarioRoutes.post("/", prontuarioController.create.bind(prontuarioController));
prontuarioRoutes.get("/", prontuarioController.getAll.bind(prontuarioController));
prontuarioRoutes.get("/:cpfPaciente", prontuarioController.getById.bind(prontuarioController));
prontuarioRoutes.patch("/:cpfPaciente", prontuarioController.update.bind(prontuarioController));
prontuarioRoutes.delete("/:cpfPaciente", prontuarioController.delete.bind(prontuarioController));

export { prontuarioRoutes };
