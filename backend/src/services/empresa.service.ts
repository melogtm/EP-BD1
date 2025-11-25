import { EmpresaRepository } from "../repositories/empresa.repository";
import type { empresa } from "../db/schemas/schemas";

type EmpresaUpdate = Partial<Omit<typeof empresa.$inferSelect, "cnpj">>;

export class EmpresaService {
  constructor(private repository = new EmpresaRepository()) {}

  async create(data: {
    cnpj: string;
    razaoSocial?: string;
    endRua?: string;
    endNum?: string;
    endBairro?: string;
    endCidade?: string;
    endUf?: string;
    endPais?: string;
    endCep?: string;
    endComplem?: string;
  }) {
    const empresaExistente = await this.repository.findById(data.cnpj);
    if (empresaExistente) {
      throw new Error("Empresa com esse CNPJ já existe");
    }
    return this.repository.create(data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(cnpj: string) {
    const empresa = await this.repository.findById(cnpj);
    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }
    return empresa;
  }

  async update(cnpj: string, data: EmpresaUpdate) {
    const empresa = await this.repository.findById(cnpj);
    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }
    return this.repository.update(cnpj, data);
  }

  async delete(cnpj: string) {
    const empresa = await this.repository.findById(cnpj);
    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }
    return this.repository.delete(cnpj);
  }
}
