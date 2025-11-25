import { LocalSalaRepository } from "../repositories/local-sala.repository";
import type { LocalSala, LocalSalaInsert } from "../db/schemas/schemas.types";
import { NotFoundError } from "../errors/NotFoundError";

export class LocalSalaService {
  constructor(private repository = new LocalSalaRepository()) {}

  async create(data: LocalSalaInsert): Promise<LocalSala> {
    return this.repository.create(data);
  }

  async getAll(): Promise<LocalSala[]> {
    return this.repository.findAll();
  }

  async getById(numeroSala: number): Promise<LocalSala> {
    const sala = await this.repository.findById(numeroSala);
    if (!sala) throw new NotFoundError("Sala não encontrada");
    return sala;
  }

  async update(
    numeroSala: number,
    data: Partial<LocalSalaInsert>
  ): Promise<LocalSala> {
    return this.repository.update(numeroSala, data);
  }

  async delete(numeroSala: number): Promise<LocalSala> {
    return this.repository.delete(numeroSala);
  }
}
