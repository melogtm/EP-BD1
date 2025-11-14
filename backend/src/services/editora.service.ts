import { EditoraRepository } from "../repositories/editora.repository";

export class EditoraService {
  constructor(private repository = new EditoraRepository()) {}

  async create(data: { nome: string; endereco: string }) {
    const editora = await this.repository.findByName(data.nome);

    if (editora) {
      throw new Error("Editora já existe");
    }

    return this.repository.create(data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const editora = await this.repository.findById(id);

    if (!editora) {
      throw new Error("Editora não encontrada");
    }

    return editora;
  }

  async update(id: number, data: { nome?: string; endereco?: string }) {
    const editora = await this.repository.findById(id);

    if (!editora) {
      throw new Error("Editora não encontrada");
    }

    return this.repository.update(id, data);
  }

  async delete(id: number) {
    const editora = await this.repository.findById(id);

    if (!editora) {
      throw new Error("Editora não encontrada");
    }

    return this.repository.delete(id);
  }
}
