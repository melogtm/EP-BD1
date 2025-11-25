import { Router } from "express";
import { ItemReceitaController } from "../controllers/item-receita.controller";

const itemReceitaRoutes = Router();
const itemReceitaController = new ItemReceitaController();

itemReceitaRoutes.post(
  "/",
  itemReceitaController.create.bind(itemReceitaController)
);
itemReceitaRoutes.get(
  "/",
  itemReceitaController.getAll.bind(itemReceitaController)
);
itemReceitaRoutes.get(
  "/receita/:receitaId",
  itemReceitaController.getByReceita.bind(itemReceitaController)
);
itemReceitaRoutes.delete(
  "/:receitaId/:nomeMedicamento",
  itemReceitaController.delete.bind(itemReceitaController)
);

export { itemReceitaRoutes };
