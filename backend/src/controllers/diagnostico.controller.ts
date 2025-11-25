import { type Request, type Response } from "express";
import { DiagnosticoService } from "../services/diagnostico.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class DiagnosticoController {
  constructor(private diagnosticoService = new DiagnosticoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newDiagnostico = await this.diagnosticoService.create(data);
      return res.status(201).json(newDiagnostico);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const diagnosticos = await this.diagnosticoService.getAll();
      return res.status(200).json(diagnosticos);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const cid = req.params.cid;
      if (!cid) {
        return res.status(400).json({ message: "CID é obrigatório" });
      }
      const diagnostico = await this.diagnosticoService.getById(cid);
      return res.status(200).json(diagnostico);
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
      const cid = req.params.cid;
      if (!cid) {
        return res.status(400).json({ message: "CID é obrigatório" });
      }
      const data = req.body;
      const updatedDiagnostico = await this.diagnosticoService.update(
        cid,
        data
      );
      return res.status(200).json(updatedDiagnostico);
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
      const cid = req.params.cid;
      if (!cid) {
        return res.status(400).json({ message: "CID é obrigatório" });
      }
      await this.diagnosticoService.delete(cid);
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
