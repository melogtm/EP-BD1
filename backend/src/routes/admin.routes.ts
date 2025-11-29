import { Router } from "express";
import AdminController from "../controllers/admin.controller";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  "/pagamentos/total",
  adminController.getPagamentosTotais.bind(adminController)
);

adminRoutes.get(
  "/funcionarios-pacientes",
  adminController.getFuncionariosPacientes.bind(adminController)
);

adminRoutes.get(
  "/pacientes/cancelamentos",
  adminController.getPacientesCancelamentos.bind(adminController)
);

adminRoutes.get(
  "/pacientes/sem-exames",
  adminController.getPacientesSemExames.bind(adminController)
);

adminRoutes.get(
  "/confirmacoes",
  adminController.getConfirmacoesDiaMedico.bind(adminController)
);

export { adminRoutes };
