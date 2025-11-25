import { EmpresaRepository } from "../repositories/empresa.repository";
import type { Empresa, EmpresaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class EmpresaService {
  constructor(private repository = new EmpresaRepository()) {}

  async create(data: EmpresaInsert) {
    return this.repository.create(data);
  }

  async getAll(): Promise<Empresa[]> {
    return this.repository.findAll();
  }

  async getById(cnpj: string): Promise<Empresa> {
    const empresa = await this.repository.findById(cnpj);
    if (!empresa) throw new NotFoundError("Empresa não encontrada");
    return empresa;
  }

  async update(cnpj: string, data: Partial<EmpresaInsert>) {
    return this.repository.update(cnpj, data);
  }

  async delete(cnpj: string) {
    return this.repository.delete(cnpj);
  }
}
