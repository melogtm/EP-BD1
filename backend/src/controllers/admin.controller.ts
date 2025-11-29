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

  async getFuncionariosPacientes(_req: Request, res: Response): Promise<Response> {
    try {
      const dados = await this.adminService.getFuncionariosPacientes();
      return res.status(200).json(dados);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getPacientesCancelamentos(_req: Request, res: Response): Promise<Response> {
    try {
      const dados = await this.adminService.getPacientesCancelamentos();
      return res.status(200).json(dados);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getPacientesSemExames(_req: Request, res: Response): Promise<Response> {
    try {
      const dados = await this.adminService.getPacientesSemExames();
      return res.status(200).json(dados);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getConfirmacoesDiaMedico(req: Request, res: Response): Promise<Response> {
    try {
      const { data, medicoCpf } = req.query;
      const d = typeof data === 'string' ? data : undefined;
      const m = typeof medicoCpf === 'string' ? medicoCpf : undefined;
      const dados = await this.adminService.getConfirmacoesDiaMedico(d, m);
      return res.status(200).json(dados);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}

export default AdminController;
