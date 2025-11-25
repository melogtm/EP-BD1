import { Router } from "express";
import { EmpresaController } from "../controllers/empresa.controller";

const empresaRoutes = Router();
const empresaController = new EmpresaController();

empresaRoutes.post("/", empresaController.create.bind(empresaController));
empresaRoutes.get("/", empresaController.getAll.bind(empresaController));
empresaRoutes.get("/:cnpj", empresaController.getById.bind(empresaController));
empresaRoutes.put("/:cnpj", empresaController.update.bind(empresaController));
empresaRoutes.delete(
  "/:cnpj",
  empresaController.delete.bind(empresaController)
);

export { empresaRoutes };
