import { type Request, type Response } from "express";
import { TelefonePessoaService } from "../services/telefone-pessoa.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class TelefonePessoaController {
  constructor(private telefonePessoaService = new TelefonePessoaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newTelefone = await this.telefonePessoaService.create(data);
      return res.status(201).json(newTelefone);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const telefones = await this.telefonePessoaService.getAll();
      return res.status(200).json(telefones);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByPessoa(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const telefones = await this.telefonePessoaService.getByPessoa(cpf);
      return res.status(200).json(telefones);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { cpf, codPais, ddd, telefone } = req.params;
      if (!cpf || !codPais || !ddd || !telefone) {
        return res.status(400).json({ message: "CPF, codPais, DDD e telefone são obrigatórios" });
      }
      await this.telefonePessoaService.delete(cpf, codPais, ddd, telefone);
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
