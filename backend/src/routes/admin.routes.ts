import { Router } from "express";
import AdminController from "../controllers/admin.controller";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  "/pagamentos/total",
  adminController.getPagamentosTotais.bind(adminController)
);

export { adminRoutes };
