import { type Request, type Response } from "express";
import { OperadoraPlanoSaudeService } from "../services/operadora-plano-saude.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class OperadoraPlanoSaudeController {
  constructor(private operadoraService = new OperadoraPlanoSaudeService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newOperadora = await this.operadoraService.create(data);
      return res.status(201).json(newOperadora);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const operadoras = await this.operadoraService.getAll();
      return res.status(200).json(operadoras);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) {
        return res.status(400).json({ message: "CNPJ é obrigatório" });
      }
      const operadora = await this.operadoraService.getById(cnpj);
      return res.status(200).json(operadora);
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
      const cnpj = req.params.cnpj;
      if (!cnpj) {
        return res.status(400).json({ message: "CNPJ é obrigatório" });
      }
      const data = req.body;
      const updatedOperadora = await this.operadoraService.update(cnpj, data);
      return res.status(200).json(updatedOperadora);
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
      const cnpj = req.params.cnpj;
      if (!cnpj) {
        return res.status(400).json({ message: "CNPJ é obrigatório" });
      }
      await this.operadoraService.delete(cnpj);
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
