import { type Request, type Response } from "express";
import { PessoaService } from "../services/pessoa.service";

export class PessoaController {
  constructor(private pessoaService = new PessoaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPessoa = await this.pessoaService.create(data);
      return res.status(201).json(newPessoa);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const pessoas = await this.pessoaService.getAll();
      return res.status(200).json(pessoas);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const pessoa = await this.pessoaService.getById(cpf);
      return res.status(200).json(pessoa);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const data = req.body;

      const updatedPessoa = await this.pessoaService.update(cpf, data);
      return res.status(200).json(updatedPessoa);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      await this.pessoaService.delete(cpf);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
