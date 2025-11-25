import { type Request, type Response } from "express";
import { EmpresaService } from "../services/empresa.service";

export class EmpresaController {
  constructor(private empresaService = new EmpresaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newEmpresa = await this.empresaService.create(data);
      return res.status(201).json(newEmpresa);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const empresas = await this.empresaService.getAll();
      return res.status(200).json(empresas);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      const empresa = await this.empresaService.getById(cnpj);
      return res.status(200).json(empresa);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      const data = req.body;
      const updatedEmpresa = await this.empresaService.update(cnpj, data);
      return res.status(200).json(updatedEmpresa);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const cnpj = req.params.cnpj;
      if (!cnpj) return res.status(400).json({ message: "CNPJ é obrigatório" });
      await this.empresaService.delete(cnpj);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
