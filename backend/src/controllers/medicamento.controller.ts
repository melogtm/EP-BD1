import { type Request, type Response } from "express";
import { MedicamentoService } from "../services/medicamento.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class MedicamentoController {
  constructor(private medicamentoService = new MedicamentoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newMedicamento = await this.medicamentoService.create(data);
      return res.status(201).json(newMedicamento);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const medicamentos = await this.medicamentoService.getAll();
      return res.status(200).json(medicamentos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const nome = req.params.nome;
      if (!nome) {
        return res
          .status(400)
          .json({ message: "Nome do medicamento é obrigatório" });
      }
      const medicamento = await this.medicamentoService.getById(nome);
      return res.status(200).json(medicamento);
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
      const nome = req.params.nome;
      if (!nome) {
        return res
          .status(400)
          .json({ message: "Nome do medicamento é obrigatório" });
      }
      const data = req.body;
      const updatedMedicamento = await this.medicamentoService.update(
        nome,
        data
      );
      return res.status(200).json(updatedMedicamento);
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
      const nome = req.params.nome;
      if (!nome) {
        return res
          .status(400)
          .json({ message: "Nome do medicamento é obrigatório" });
      }
      await this.medicamentoService.delete(nome);
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
