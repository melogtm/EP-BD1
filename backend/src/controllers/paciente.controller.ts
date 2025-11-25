import { type Request, type Response } from "express";
import { PacienteService } from "../services/paciente.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class PacienteController {
  constructor(private pacienteService = new PacienteService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPaciente = await this.pacienteService.create(data);
      return res.status(201).json(newPaciente);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const pacientes = await this.pacienteService.getAll();
      return res.status(200).json(pacientes);
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
      const paciente = await this.pacienteService.getById(cpf);
      return res.status(200).json(paciente);
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
      const updatedPaciente = await this.pacienteService.update(cpf, data);
      return res.status(200).json(updatedPaciente);
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
      await this.pacienteService.delete(cpf);
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
