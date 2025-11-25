import { type Request, type Response } from "express";
import { PagamentoService } from "../services/pagamento.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class PagamentoController {
  constructor(private pagamentoService = new PagamentoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newPagamento = await this.pagamentoService.create(data);
      return res.status(201).json(newPagamento);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const pagamentos = await this.pagamentoService.getAll();
      return res.status(200).json(pagamentos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const pagamentoIdParam = req.params.pagamentoId;
      if (!pagamentoIdParam) {
        return res.status(400).json({ message: "ID do pagamento é obrigatório" });
      }
      const pagamentoId = Number(pagamentoIdParam);
      if (isNaN(pagamentoId)) {
        return res.status(400).json({ message: "ID do pagamento inválido" });
      }
      const pagamento = await this.pagamentoService.getById(pagamentoId);
      return res.status(200).json(pagamento);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByPaciente(req: Request, res: Response): Promise<Response> {
    try {
      const cpfPaciente = req.params.cpfPaciente;
      if (!cpfPaciente) {
        return res.status(400).json({ message: "CPF do paciente é obrigatório" });
      }
      const pagamentos = await this.pagamentoService.getByPaciente(cpfPaciente);
      return res.status(200).json(pagamentos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const pagamentoIdParam = req.params.pagamentoId;
      if (!pagamentoIdParam) {
        return res.status(400).json({ message: "ID do pagamento é obrigatório" });
      }
      const pagamentoId = Number(pagamentoIdParam);
      if (isNaN(pagamentoId)) {
        return res.status(400).json({ message: "ID do pagamento inválido" });
      }
      const data = req.body;
      const updatedPagamento = await this.pagamentoService.update(pagamentoId, data);
      return res.status(200).json(updatedPagamento);
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
      const pagamentoIdParam = req.params.pagamentoId;
      if (!pagamentoIdParam) {
        return res.status(400).json({ message: "ID do pagamento é obrigatório" });
      }
      const pagamentoId = Number(pagamentoIdParam);
      if (isNaN(pagamentoId)) {
        return res.status(400).json({ message: "ID do pagamento inválido" });
      }
      await this.pagamentoService.delete(pagamentoId);
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
