import { Router } from "express";
import { FuncionarioController } from "../controllers/funcionario.controller";

const funcionarioRoutes = Router();
const funcionarioController = new FuncionarioController();

funcionarioRoutes.post(
  "/",
  funcionarioController.create.bind(funcionarioController)
);
funcionarioRoutes.get(
  "/",
  funcionarioController.getAll.bind(funcionarioController)
);
funcionarioRoutes.get(
  "/:cpf",
  funcionarioController.getById.bind(funcionarioController)
);
funcionarioRoutes.patch(
  "/:cpf",
  funcionarioController.update.bind(funcionarioController)
);
funcionarioRoutes.delete(
  "/:cpf",
  funcionarioController.delete.bind(funcionarioController)
);

export { funcionarioRoutes };
