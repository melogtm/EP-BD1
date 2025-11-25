import { type Request, type Response } from "express";
import { AlteraProdutoService } from "../services/altera-produto.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class AlteraProdutoController {
  constructor(private alteraProdutoService = new AlteraProdutoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newAltera = await this.alteraProdutoService.create(data);
      return res.status(201).json(newAltera);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const alteras = await this.alteraProdutoService.getAll();
      return res.status(200).json(alteras);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByProduto(req: Request, res: Response): Promise<Response> {
    try {
      const codigoProduto = req.params.codigoProduto;
      if (!codigoProduto) {
        return res.status(400).json({ message: "Código do produto é obrigatório" });
      }
      const alteras = await this.alteraProdutoService.getByProduto(codigoProduto);
      return res.status(200).json(alteras);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { codigoProduto, cpf } = req.params;
      if (!codigoProduto || !cpf) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      await this.alteraProdutoService.delete(codigoProduto, cpf);
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
