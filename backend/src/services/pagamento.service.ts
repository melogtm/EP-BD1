import { PagamentoRepository } from "../repositories/pagamento.repository";
import type { Pagamento, PagamentoInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class PagamentoService {
  constructor(private repository = new PagamentoRepository()) {}

  async create(data: PagamentoInsert): Promise<Pagamento> {
    return this.repository.create(data);
  }

  async getAll(): Promise<Pagamento[]> {
    return this.repository.findAll();
  }

  async getById(pagamentoId: number): Promise<Pagamento> {
    const pagamento = await this.repository.findById(pagamentoId);
    if (!pagamento) throw new NotFoundError("Pagamento não encontrado");
    return pagamento;
  }

  async getByPaciente(cpfPaciente: string): Promise<Pagamento[]> {
    return this.repository.findByPaciente(cpfPaciente);
  }

  async update(pagamentoId: number, data: Partial<PagamentoInsert>): Promise<Pagamento> {
    return this.repository.update(pagamentoId, data);
  }

  async delete(pagamentoId: number): Promise<Pagamento> {
    return this.repository.delete(pagamentoId);
  }
}
