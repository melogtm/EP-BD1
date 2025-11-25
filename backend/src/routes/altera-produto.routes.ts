import { Router } from "express";
import { AlteraProdutoController } from "../controllers/altera-produto.controller";

const alteraProdutoRoutes = Router();
const alteraProdutoController = new AlteraProdutoController();

alteraProdutoRoutes.post("/", alteraProdutoController.create.bind(alteraProdutoController));
alteraProdutoRoutes.get("/", alteraProdutoController.getAll.bind(alteraProdutoController));
alteraProdutoRoutes.get("/produto/:codigoProduto", alteraProdutoController.getByProduto.bind(alteraProdutoController));
alteraProdutoRoutes.delete("/:codigoProduto/:cpf", alteraProdutoController.delete.bind(alteraProdutoController));

export { alteraProdutoRoutes };
