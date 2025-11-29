import { type Request, type Response } from "express";
import { FuncionarioSaudeService } from "../services/funcionario-saude.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class FuncionarioSaudeController {
  constructor(private funcionarioSaudeService = new FuncionarioSaudeService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newFuncionarioSaude = await this.funcionarioSaudeService.create(data);
      return res.status(201).json(newFuncionarioSaude);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const funcionariosSaude = await this.funcionarioSaudeService.getAll();
      return res.status(200).json(funcionariosSaude);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getEspecialidades(_req: Request, res: Response): Promise<Response> {
    try {
      const especialidades = await this.funcionarioSaudeService.getEspecialidades();
      return res.status(200).json(especialidades);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const funcionarioSaude = await this.funcionarioSaudeService.getById(cpf);
      return res.status(200).json(funcionarioSaude);
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
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      const data = req.body;
      const updatedFuncionarioSaude = await this.funcionarioSaudeService.update(cpf, data);
      return res.status(200).json(updatedFuncionarioSaude);
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
      const cpf = req.params.cpf;
      if (!cpf) {
        return res.status(400).json({ message: "CPF é obrigatório" });
      }
      await this.funcionarioSaudeService.delete(cpf);
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
