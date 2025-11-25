import { Router } from "express";
import { RealizaPlantaoController } from "../controllers/realiza-plantao.controller";

const realizaPlantaoRoutes = Router();
const realizaPlantaoController = new RealizaPlantaoController();

realizaPlantaoRoutes.post("/", realizaPlantaoController.create.bind(realizaPlantaoController));
realizaPlantaoRoutes.get("/", realizaPlantaoController.getAll.bind(realizaPlantaoController));
realizaPlantaoRoutes.get("/funcionario/:cpf", realizaPlantaoController.getByFuncionario.bind(realizaPlantaoController));
realizaPlantaoRoutes.delete("/:cpf/:plantaoId", realizaPlantaoController.delete.bind(realizaPlantaoController));

export { realizaPlantaoRoutes };
