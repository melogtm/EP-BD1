import { type Request, type Response } from "express";
import { ReceitaService } from "../services/receita.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class ReceitaController {
  constructor(private receitaService = new ReceitaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newReceita = await this.receitaService.create(data);
      return res.status(201).json(newReceita);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const receitas = await this.receitaService.getAll();
      return res.status(200).json(receitas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const receitaIdParam = req.params.receitaId;
      if (!receitaIdParam) {
        return res.status(400).json({ message: "ID da receita é obrigatório" });
      }
      const receitaId = Number(receitaIdParam);
      if (isNaN(receitaId)) {
        return res.status(400).json({ message: "ID da receita inválido" });
      }
      const receita = await this.receitaService.getById(receitaId);
      return res.status(200).json(receita);
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
      const receitas = await this.receitaService.getByPaciente(cpfPaciente);
      return res.status(200).json(receitas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const receitaIdParam = req.params.receitaId;
      if (!receitaIdParam) {
        return res.status(400).json({ message: "ID da receita é obrigatório" });
      }
      const receitaId = Number(receitaIdParam);
      if (isNaN(receitaId)) {
        return res.status(400).json({ message: "ID da receita inválido" });
      }
      const data = req.body;
      const updatedReceita = await this.receitaService.update(receitaId, data);
      return res.status(200).json(updatedReceita);
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
      const receitaIdParam = req.params.receitaId;
      if (!receitaIdParam) {
        return res.status(400).json({ message: "ID da receita é obrigatório" });
      }
      const receitaId = Number(receitaIdParam);
      if (isNaN(receitaId)) {
        return res.status(400).json({ message: "ID da receita inválido" });
      }
      await this.receitaService.delete(receitaId);
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
