import { Router } from "express";
import { ExameController } from "../controllers/exame.controller";

const exameRoutes = Router();
const exameController = new ExameController();

exameRoutes.post("/", exameController.create.bind(exameController));
exameRoutes.get("/", exameController.getAll.bind(exameController));
exameRoutes.get("/:exameId", exameController.getById.bind(exameController));
exameRoutes.get("/paciente/:cpfPaciente", exameController.getByPaciente.bind(exameController));
exameRoutes.patch("/:exameId", exameController.update.bind(exameController));
exameRoutes.delete("/:exameId", exameController.delete.bind(exameController));

export { exameRoutes };
