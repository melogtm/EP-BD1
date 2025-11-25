import { Router } from "express";
import { PrestTerceirizadoController } from "../controllers/prest-terceirizado.controller";

const prestTerceirizadoRoutes = Router();
const prestController = new PrestTerceirizadoController();

prestTerceirizadoRoutes.post("/", prestController.create.bind(prestController));
prestTerceirizadoRoutes.get("/", prestController.getAll.bind(prestController));
prestTerceirizadoRoutes.get("/:cpf", prestController.getById.bind(prestController));
prestTerceirizadoRoutes.patch("/:cpf", prestController.update.bind(prestController));
prestTerceirizadoRoutes.delete("/:cpf", prestController.delete.bind(prestController));

export { prestTerceirizadoRoutes };
