import { type Request, type Response } from "express";
import { ItemReceitaService } from "../services/item-receita.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class ItemReceitaController {
  constructor(private itemReceitaService = new ItemReceitaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newItem = await this.itemReceitaService.create(data);
      return res.status(201).json(newItem);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const items = await this.itemReceitaService.getAll();
      return res.status(200).json(items);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByReceita(req: Request, res: Response): Promise<Response> {
    try {
      const receitaIdParam = req.params.receitaId;
      if (!receitaIdParam) {
        return res.status(400).json({ message: "ID da receita é obrigatório" });
      }
      const receitaId = Number(receitaIdParam);
      if (isNaN(receitaId)) {
        return res.status(400).json({ message: "ID da receita inválido" });
      }
      const items = await this.itemReceitaService.getByReceita(receitaId);
      return res.status(200).json(items);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { receitaId, nomeMedicamento } = req.params;
      if (!receitaId || !nomeMedicamento) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      const id = Number(receitaId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID da receita inválido" });
      }
      await this.itemReceitaService.delete(id, nomeMedicamento);
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
