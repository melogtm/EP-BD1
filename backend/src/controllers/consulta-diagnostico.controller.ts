import { type Request, type Response } from "express";
import { ConsultaDiagnosticoService } from "../services/consulta-diagnostico.service";
import { mapPostgresErrorToHttp } from "../utils/errorMapper";

export class ConsultaDiagnosticoController {
  constructor(private consultaDiagnosticoService = new ConsultaDiagnosticoService()) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const processedData = {
        ...data,
        dataHoraAgendada: data.dataHoraAgendada ? new Date(data.dataHoraAgendada) : null,
      };
      const newDiag = await this.consultaDiagnosticoService.create(processedData);
      return res.status(201).json(newDiag);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const diags = await this.consultaDiagnosticoService.getAll();
      return res.status(200).json(diags);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async getByConsulta(req: Request, res: Response): Promise<Response> {
    try {
      const { dataHoraAgendada, cpfFuncSaude, cpfPaciente } = req.params;
      if (!dataHoraAgendada || !cpfFuncSaude || !cpfPaciente) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      const diags = await this.consultaDiagnosticoService.getByConsulta(
        new Date(dataHoraAgendada),
        cpfFuncSaude,
        cpfPaciente
      );
      return res.status(200).json(diags);
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { dataHoraAgendada, cpfFuncSaude, cpfPaciente, codigoDiagnostico } = req.params;
      if (!dataHoraAgendada || !cpfFuncSaude || !cpfPaciente || !codigoDiagnostico) {
        return res.status(400).json({ message: "Todos os parâmetros são obrigatórios" });
      }
      await this.consultaDiagnosticoService.delete(
        new Date(dataHoraAgendada),
        cpfFuncSaude,
        cpfPaciente,
        codigoDiagnostico
      );
      return res.status(204).send();
    } catch (error: unknown) {
      const { statusCode, message, detail } = mapPostgresErrorToHttp(error);
      return res.status(statusCode).json({ message, detail });
    }
  }
}
