import { Router } from "express";
import { PagamentoController } from "../controllers/pagamento.controller";

const pagamentoRoutes = Router();
const pagamentoController = new PagamentoController();

pagamentoRoutes.post("/", pagamentoController.create.bind(pagamentoController));
pagamentoRoutes.get("/", pagamentoController.getAll.bind(pagamentoController));
pagamentoRoutes.get("/:pagamentoId", pagamentoController.getById.bind(pagamentoController));
pagamentoRoutes.get("/paciente/:cpfPaciente", pagamentoController.getByPaciente.bind(pagamentoController));
pagamentoRoutes.patch("/:pagamentoId", pagamentoController.update.bind(pagamentoController));
pagamentoRoutes.delete("/:pagamentoId", pagamentoController.delete.bind(pagamentoController));

export { pagamentoRoutes };
