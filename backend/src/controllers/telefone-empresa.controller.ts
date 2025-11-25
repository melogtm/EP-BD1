import { type Request, type Response } from "express";
import { TelefoneEmpresaService } from "../services/telefone-empresa.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class TelefoneEmpresaController {
  constructor(private telefoneEmpresaService = new TelefoneEmpresaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newTelefone = await this.telefoneEmpresaService.create(data);
      return res.status(201).json(newTelefone);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const telefones = await this.telefoneEmpresaService.getAll();
      return res.status(200).json(telefones);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByEmpresa(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) {
        return res.status(400).json({ message: "CNPJ é obrigatório" });
      }
      const telefones = await this.telefoneEmpresaService.getByEmpresa(cnpj);
      return res.status(200).json(telefones);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj, codPais, ddd, telefone } = req.params;
      if (!cnpj || !codPais || !ddd || !telefone) {
        return res.status(400).json({ message: "CNPJ, codPais, DDD e telefone são obrigatórios" });
      }
      await this.telefoneEmpresaService.delete(cnpj, codPais, ddd, telefone);
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
