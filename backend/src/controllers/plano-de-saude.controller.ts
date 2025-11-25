import { type Request, type Response } from "express";
import { PlanoDeSaudeService } from "../services/plano-de-saude.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class PlanoDeSaudeController {
  constructor(private planoDeSaudeService = new PlanoDeSaudeService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPlano = await this.planoDeSaudeService.create(data);
      return res.status(201).json(newPlano);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const planos = await this.planoDeSaudeService.getAll();
      return res.status(200).json(planos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const planoIdParam = req.params.planoId;
      if (!planoIdParam) {
        return res.status(400).json({ message: "ID do plano é obrigatório" });
      }
      const planoId = Number(planoIdParam);
      if (isNaN(planoId)) {
        return res.status(400).json({ message: "ID do plano inválido" });
      }
      const plano = await this.planoDeSaudeService.getById(planoId);
      return res.status(200).json(plano);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const planoIdParam = req.params.planoId;
      if (!planoIdParam) {
        return res.status(400).json({ message: "ID do plano é obrigatório" });
      }
      const planoId = Number(planoIdParam);
      if (isNaN(planoId)) {
        return res.status(400).json({ message: "ID do plano inválido" });
      }
      const data = req.body;
      const updatedPlano = await this.planoDeSaudeService.update(planoId, data);
      return res.status(200).json(updatedPlano);
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
      const planoIdParam = req.params.planoId;
      if (!planoIdParam) {
        return res.status(400).json({ message: "ID do plano é obrigatório" });
      }
      const planoId = Number(planoIdParam);
      if (isNaN(planoId)) {
        return res.status(400).json({ message: "ID do plano inválido" });
      }
      await this.planoDeSaudeService.delete(planoId);
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
