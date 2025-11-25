import { type Request, type Response } from "express";
import { EmpresaService } from "../services/empresa.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class EmpresaController {
  constructor(private empresaService = new EmpresaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newEmpresa = await this.empresaService.create(data);
      return res.status(201).json(newEmpresa);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const empresas = await this.empresaService.getAll();
      return res.status(200).json(empresas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      const empresa = await this.empresaService.getById(cnpj);
      if (!empresa)
        return res.status(404).json({ message: "Empresa não encontrada" });
      return res.status(200).json(empresa);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      // seu mapPostgresErrorToHttp aqui para erros do banco
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      const data = req.body;
      const updatedEmpresa = await this.empresaService.update(cnpj, data);
      if (!updatedEmpresa)
        return res.status(404).json({ message: "Empresa não encontrada" });
      return res.status(200).json(updatedEmpresa);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      await this.empresaService.delete(cnpj);
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
