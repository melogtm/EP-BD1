import { type Request, type Response } from "express";
import AdminService from "../services/admin.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class AdminController {
  constructor(private adminService = new AdminService()) {}

  async getPagamentosTotais(_req: Request, res: Response): Promise<Response> {
    try {
      const resumo = await this.adminService.getPagamentosTotais();
      return res.status(200).json(resumo);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}

export default AdminController;
