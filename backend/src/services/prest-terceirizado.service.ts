import { PrestTerceirizadoRepository } from "../repositories/prest-terceirizado.repository";
import type { PrestTerceirizado, PrestTerceirizadoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PrestTerceirizadoService {
  constructor(private repository = new PrestTerceirizadoRepository()) {}

  async create(data: PrestTerceirizadoInsert): Promise<PrestTerceirizado> {
    return this.repository.create(data);
  }

  async getAll(): Promise<PrestTerceirizado[]> {
    return this.repository.findAll();
  }

  async getById(cpf: string): Promise<PrestTerceirizado> {
    const prestador = await this.repository.findById(cpf);
    if (!prestador) throw new NotFoundError("Prestador não encontrado");
    return prestador;
  }

  async update(cpf: string, data: Partial<PrestTerceirizadoInsert>): Promise<PrestTerceirizado> {
    return this.repository.update(cpf, data);
  }

  async delete(cpf: string): Promise<PrestTerceirizado> {
    return this.repository.delete(cpf);
  }
}
