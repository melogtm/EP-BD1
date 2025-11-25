import { type Request, type Response } from "express";
import { ProdutoService } from "../services/produto.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class ProdutoController {
  constructor(private produtoService = new ProdutoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const newProd = await this.produtoService.create(req.body);
      return res.status(201).json(newProd);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const produtos = await this.produtoService.getAll();
      return res.status(200).json(produtos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const prodIdParam = req.params.prodId;
      if (!prodIdParam)
        return res.status(400).json({ message: "prodId é obrigatório" });
      const prodId = Number(prodIdParam);
      if (isNaN(prodId))
        return res.status(400).json({ message: "prodId inválido" });
      const produto = await this.produtoService.getById(prodId);
      return res.status(200).json(produto);
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
      const prodIdParam = req.params.prodId;
      if (!prodIdParam)
        return res.status(400).json({ message: "prodId é obrigatório" });
      const prodId = Number(prodIdParam);
      if (isNaN(prodId))
        return res.status(400).json({ message: "prodId inválido" });
      const updatedProduto = await this.produtoService.update(prodId, req.body);
      return res.status(200).json(updatedProduto);
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
      const prodIdParam = req.params.prodId;
      if (!prodIdParam)
        return res.status(400).json({ message: "prodId é obrigatório" });
      const prodId = Number(prodIdParam);
      if (isNaN(prodId))
        return res.status(400).json({ message: "prodId inválido" });
      await this.produtoService.delete(prodId);
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
