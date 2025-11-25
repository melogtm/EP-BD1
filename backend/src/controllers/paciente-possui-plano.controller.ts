import { type Request, type Response } from "express";
import { PacientePossuiPlanoService } from "../services/paciente-possui-plano.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class PacientePossuiPlanoController {
  constructor(private pacientePossuiPlanoService = new PacientePossuiPlanoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPlano = await this.pacientePossuiPlanoService.create(data);
      return res.status(201).json(newPlano);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const planos = await this.pacientePossuiPlanoService.getAll();
      return res.status(200).json(planos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByPaciente(req: Request, res: Response): Promise<Response> {
    try {
      const cpfPaciente = req.params.cpfPaciente;
      if (!cpfPaciente) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const planos = await this.pacientePossuiPlanoService.getByPaciente(cpfPaciente);
      return res.status(200).json(planos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { cpfPaciente, planoId } = req.params;
      if (!cpfPaciente || !planoId) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      const id = Number(planoId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID do plano inválido" });
      }
      await this.pacientePossuiPlanoService.delete(cpfPaciente, id);
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
