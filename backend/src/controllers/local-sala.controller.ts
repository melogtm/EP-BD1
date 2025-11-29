import { type Request, type Response } from "express";
import { LocalSalaService } from "../services/local-sala.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class LocalSalaController {
  constructor(private localSalaService = new LocalSalaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newSala = await this.localSalaService.create(data);
      return res.status(201).json(newSala);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const salas = await this.localSalaService.getAll();
      return res.status(200).json(salas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const numeroSalaParam = req.params.numeroSala;
      if (!numeroSalaParam) {
        return res
          .status(400)
          .json({ message: "Número da sala é obrigatório" });
      }
      const numeroSala = Number(numeroSalaParam);
      if (isNaN(numeroSala)) {
        return res.status(400).json({ message: "Número da sala inválido" });
      }
      const sala = await this.localSalaService.getById(numeroSala);
      return res.status(200).json(sala);
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
      const numeroSalaParam = req.params.numeroSala;
      if (!numeroSalaParam) {
        return res
          .status(400)
          .json({ message: "Número da sala é obrigatório" });
      }
      const numeroSala = Number(numeroSalaParam);
      if (isNaN(numeroSala)) {
        return res.status(400).json({ message: "Número da sala inválido" });
      }
      const data = req.body;
      const updatedSala = await this.localSalaService.update(numeroSala, data);
      return res.status(200).json(updatedSala);
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
      const numeroSalaParam = req.params.numeroSala;
      if (!numeroSalaParam) {
        return res
          .status(400)
          .json({ message: "Número da sala é obrigatório" });
      }
      const numeroSala = Number(numeroSalaParam);
      if (isNaN(numeroSala)) {
        return res.status(400).json({ message: "Número da sala inválido" });
      }
      await this.localSalaService.delete(numeroSala);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getOcupacaoSala(req: Request, res: Response): Promise<Response> {
    try {
      const numeroSalaParam = req.params.numeroSala;
      if (!numeroSalaParam) {
        return res
          .status(400)
          .json({ message: "Número da sala é obrigatório" });
      }
      const numeroSala = Number(numeroSalaParam);
      if (isNaN(numeroSala)) {
        return res.status(400).json({ message: "Número da sala inválido" });
      }
      const dateIso = (req.query.data as string) || undefined;
      const ocupacao = await this.localSalaService.getOcupacaoSala(numeroSala, dateIso);
      return res.status(200).json(ocupacao);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getOcupacaoTodas(_req: Request, res: Response): Promise<Response> {
    try {
      const dateIso = (_req.query.data as string) || undefined;
      const ocupacoes = await this.localSalaService.getOcupacaoTodasSalas(dateIso);
      return res.status(200).json(ocupacoes);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
