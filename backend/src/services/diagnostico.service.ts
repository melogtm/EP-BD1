import { DiagnosticoRepository } from "../repositories/diagnostico.repository";
import type {
  Diagnostico,
  DiagnosticoInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class DiagnosticoService {
  constructor(private repository = new DiagnosticoRepository()) {}

  async create(data: DiagnosticoInsert): Promise<Diagnostico> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Diagnostico[]> {
    return this.repository.findAll();
  }

  async getById(cid: string): Promise<Diagnostico> {
    const diagnostico = await this.repository.findById(cid);
    if (!diagnostico) throw new NotFoundError("Diagnóstico não encontrado");
    return diagnostico;
  }

  async update(
    cid: string,
    data: Partial<DiagnosticoInsert>
  ): Promise<Diagnostico> {
    return this.repository.update(cid, data);
  }

  async delete(cid: string): Promise<Diagnostico> {
    return this.repository.delete(cid);
  }
}
