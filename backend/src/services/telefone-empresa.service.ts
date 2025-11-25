import { TelefoneEmpresaRepository } from "../repositories/telefone-empresa.repository";
import type { TelefoneEmpresa, TelefoneEmpresaInsert } from "../db/schemas/schemas.types";

export class TelefoneEmpresaService {
  constructor(private repository = new TelefoneEmpresaRepository()) {}

  async create(data: TelefoneEmpresaInsert): Promise<TelefoneEmpresa> {
    return this.repository.create(data);
  }

  async getAll(): Promise<TelefoneEmpresa[]> {
    return this.repository.findAll();
  }

  async getByEmpresa(cnpj: string): Promise<TelefoneEmpresa[]> {
    return this.repository.findByEmpresa(cnpj);
  }

  async delete(cnpj: string, codPais: string, ddd: string, telefone: string): Promise<TelefoneEmpresa> {
    return this.repository.delete(cnpj, codPais, ddd, telefone);
  }
}
