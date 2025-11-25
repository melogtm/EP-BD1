import { Router } from "express";
import { ReceitaController } from "../controllers/receita.controller";

const receitaRoutes = Router();
const receitaController = new ReceitaController();

receitaRoutes.post("/", receitaController.create.bind(receitaController));
receitaRoutes.get("/", receitaController.getAll.bind(receitaController));
receitaRoutes.get("/:receitaId", receitaController.getById.bind(receitaController));
receitaRoutes.get("/paciente/:cpfPaciente", receitaController.getByPaciente.bind(receitaController));
receitaRoutes.patch("/:receitaId", receitaController.update.bind(receitaController));
receitaRoutes.delete("/:receitaId", receitaController.delete.bind(receitaController));

export { receitaRoutes };
