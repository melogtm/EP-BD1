import { MedicamentoRepository } from "../repositories/medicamento.repository";
import type {
  Medicamento,
  MedicamentoInsert,
} from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class MedicamentoService {
  constructor(private repository = new MedicamentoRepository()) {}

  async create(data: MedicamentoInsert): Promise<Medicamento> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Medicamento[]> {
    return this.repository.findAll();
  }

  async getById(nome: string): Promise<Medicamento> {
    const medicamento = await this.repository.findById(nome);
    if (!medicamento) throw new NotFoundError("Medicamento não encontrado");
    return medicamento;
  }

  async update(
    nome: string,
    data: Partial<MedicamentoInsert>
  ): Promise<Medicamento> {
    return this.repository.update(nome, data);
  }

  async delete(nome: string): Promise<Medicamento> {
    return this.repository.delete(nome);
  }
}
