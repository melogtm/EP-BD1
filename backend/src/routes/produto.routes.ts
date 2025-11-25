import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller";

const produtoRoutes = Router();
const produtoController = new ProdutoController();

produtoRoutes.post("/", produtoController.create.bind(produtoController));
produtoRoutes.get("/", produtoController.getAll.bind(produtoController));
produtoRoutes.get(
  "/:prodId",
  produtoController.getById.bind(produtoController)
);
produtoRoutes.put("/:prodId", produtoController.update.bind(produtoController));
produtoRoutes.delete(
  "/:prodId",
  produtoController.delete.bind(produtoController)
);

export { produtoRoutes };
