import { type Request, type Response } from "express";
import { ConsultaService } from "../services/consulta.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";
import { NotFoundError } from "../errors/NotFoundError";

export class ConsultaController {
  constructor(private consultaService = new ConsultaService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const newConsulta = await this.consultaService.create(data);
      return res.status(201).json(newConsulta);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const consultas = await this.consultaService.getAll();
      return res.status(200).json(consultas);
    } catch (error: unknown) {
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
      const consultas = await this.consultaService.getByPaciente(cpfPaciente);
      return res.status(200).json(consultas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByMedico(req: Request, res: Response): Promise<Response> {
    try {
      const cpfFuncSaude = req.params.cpfFuncSaude;
      if (!cpfFuncSaude) {
        return res.status(400).json({ message: "CPF do médico é obrigatório" });
      }
      const consultas = await this.consultaService.getByMedico(cpfFuncSaude);
      return res.status(200).json(consultas);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { dataHoraAgendada, cpfFuncSaude, cpfPaciente } = req.params;
      if (!dataHoraAgendada || !cpfFuncSaude || !cpfPaciente) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      const data = req.body;
      const updatedConsulta = await this.consultaService.update(
        new Date(dataHoraAgendada),
        cpfFuncSaude,
        cpfPaciente,
        data
      );
      return res.status(200).json(updatedConsulta);
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
      const { dataHoraAgendada, cpfFuncSaude, cpfPaciente } = req.params;
      if (!dataHoraAgendada || !cpfFuncSaude || !cpfPaciente) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      await this.consultaService.delete(
        new Date(dataHoraAgendada),
        cpfFuncSaude,
        cpfPaciente
      );
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
