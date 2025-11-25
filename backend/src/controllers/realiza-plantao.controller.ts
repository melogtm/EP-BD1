import { type Request, type Response } from "express";
import { RealizaPlantaoService } from "../services/realiza-plantao.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class RealizaPlantaoController {
  constructor(private realizaPlantaoService = new RealizaPlantaoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newRealiza = await this.realizaPlantaoService.create(data);
      return res.status(201).json(newRealiza);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const realizas = await this.realizaPlantaoService.getAll();
      return res.status(200).json(realizas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByFuncionario(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const realizas = await this.realizaPlantaoService.getByFuncionario(cpf);
      return res.status(200).json(realizas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { cpf, plantaoId } = req.params;
      if (!cpf || !plantaoId) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      const id = Number(plantaoId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID do plantão inválido" });
      }
      await this.realizaPlantaoService.delete(cpf, id);
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
