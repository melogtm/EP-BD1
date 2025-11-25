import { type Request, type Response } from "express";
import { PlantaoService } from "../services/plantao.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class PlantaoController {
  constructor(private plantaoService = new PlantaoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPlantao = await this.plantaoService.create(data);
      return res.status(201).json(newPlantao);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const plantaos = await this.plantaoService.getAll();
      return res.status(200).json(plantaos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const plantaoIdParam = req.params.plantaoId;
      if (!plantaoIdParam) {
        return res.status(400).json({ message: "ID do plantão é obrigatório" });
      }
      const plantaoId = Number(plantaoIdParam);
      if (isNaN(plantaoId)) {
        return res.status(400).json({ message: "ID do plantão inválido" });
      }
      const plantao = await this.plantaoService.getById(plantaoId);
      return res.status(200).json(plantao);
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
      const plantaoIdParam = req.params.plantaoId;
      if (!plantaoIdParam) {
        return res.status(400).json({ message: "ID do plantão é obrigatório" });
      }
      const plantaoId = Number(plantaoIdParam);
      if (isNaN(plantaoId)) {
        return res.status(400).json({ message: "ID do plantão inválido" });
      }
      const data = req.body;
      const updatedPlantao = await this.plantaoService.update(plantaoId, data);
      return res.status(200).json(updatedPlantao);
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
      const plantaoIdParam = req.params.plantaoId;
      if (!plantaoIdParam) {
        return res.status(400).json({ message: "ID do plantão é obrigatório" });
      }
      const plantaoId = Number(plantaoIdParam);
      if (isNaN(plantaoId)) {
        return res.status(400).json({ message: "ID do plantão inválido" });
      }
      await this.plantaoService.delete(plantaoId);
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
