import { type Request, type Response } from "express";
import { ExameService } from "../services/exame.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class ExameController {
  constructor(private exameService = new ExameService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newExame = await this.exameService.create(data);
      return res.status(201).json(newExame);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const exames = await this.exameService.getAll();
      return res.status(200).json(exames);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const exameIdParam = req.params.exameId;
      if (!exameIdParam) {
        return res.status(400).json({ message: "ID do exame é obrigatório" });
      }
      const exameId = Number(exameIdParam);
      if (isNaN(exameId)) {
        return res.status(400).json({ message: "ID do exame inválido" });
      }
      const exame = await this.exameService.getById(exameId);
      return res.status(200).json(exame);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByPaciente(req: Request, res: Response): Promise<Response> {
    try {
      const cpfPaciente = req.params.cpfPaciente;
      if (!cpfPaciente) {
        return res.status(400).json({ message: "CPF do paciente é obrigatório" });
      }
      const exames = await this.exameService.getByPaciente(cpfPaciente);
      return res.status(200).json(exames);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const exameIdParam = req.params.exameId;
      if (!exameIdParam) {
        return res.status(400).json({ message: "ID do exame é obrigatório" });
      }
      const exameId = Number(exameIdParam);
      if (isNaN(exameId)) {
        return res.status(400).json({ message: "ID do exame inválido" });
      }
      const data = req.body;
      const updatedExame = await this.exameService.update(exameId, data);
      return res.status(200).json(updatedExame);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const exameIdParam = req.params.exameId;
      if (!exameIdParam) {
        return res.status(400).json({ message: "ID do exame é obrigatório" });
      }
      const exameId = Number(exameIdParam);
      if (isNaN(exameId)) {
        return res.status(400).json({ message: "ID do exame inválido" });
      }
      await this.exameService.delete(exameId);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
