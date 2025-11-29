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

  async getOcupacaoSala(
    numeroSala: number,
    dateIso?: string
  ): Promise<{
    numeroSala: number;
    tipoSala?: string | null;
    capacidade?: number | null;
    totalConsultas: number;
    ocupacao: number | null; // ratio 0..1 or null when capacidade missing/zero
    ocupacaoPercent: string | null;
  }> {
    const sala = await this.repository.findById(numeroSala);
    if (!sala) throw new NotFoundError("Sala não encontrada");

    const capacidade = (sala as any).capacidade ?? null;
    const total = await this.repository.countConsultasBySala(numeroSala, dateIso);

    let ocupacao: number | null = null;
    let ocupacaoPercent: string | null = null;
    if (capacidade && capacidade > 0) {
      ocupacao = total / capacidade;
      ocupacaoPercent = `${Math.round(ocupacao * 100)}%`;
    }

    return {
      numeroSala: sala.numeroSala,
      tipoSala: (sala as any).tipoSala ?? null,
      capacidade,
      totalConsultas: total,
      ocupacao,
      ocupacaoPercent,
    };
  }

  async getOcupacaoTodasSalas(dateIso?: string) {
    const salas = await this.repository.findAll();
    const results = await Promise.all(
      salas.map(async (s) => {
        const total = await this.repository.countConsultasBySala(s.numeroSala, dateIso);
        const capacidade = (s as any).capacidade ?? null;
        let ocupacao: number | null = null;
        let ocupacaoPercent: string | null = null;
        if (capacidade && capacidade > 0) {
          ocupacao = total / capacidade;
          ocupacaoPercent = `${Math.round(ocupacao * 100)}%`;
        }
        return {
          numeroSala: s.numeroSala,
          tipoSala: (s as any).tipoSala ?? null,
          capacidade,
          totalConsultas: total,
          ocupacao,
          ocupacaoPercent,
        };
      })
    );
    return results;
  }
}
