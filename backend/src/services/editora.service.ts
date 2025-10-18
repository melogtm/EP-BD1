import { type Editora } from "@prisma/client";
import { EditoraRepository } from "../repositories/editora.repository.js";

export class EditoraService {
    constructor(private repository = new EditoraRepository()) {}

    async create(data: {nome: string, endereco: string}): Promise<Editora> {
        const editora = await this.repository.findByName(data.nome);

        if (editora) {
            throw new Error('Editora já existe');
        }

        return this.repository.create(data);
    }

    async getAll(): Promise<Editora[]> {
        return this.repository.findAll();
    }

    async getById(id: number): Promise<Editora> {
        const editora =  await this.repository.findById(id);

        if (!editora) {
            throw new Error('Editora não encontrada');
        }

        return editora;
    }

    async update(id: number, data: {nome?: string, endereco?: string}): Promise<Editora> {
        const editora = await this.repository.findById(id);
        
        if (!editora) {
            throw new Error('Editora não encontrada');
        }
        
        return this.repository.update(id, data);
    }

    async delete(id: number): Promise<Editora> {
        const editora = await this.repository.findById(id);
        
        if (!editora) {
            throw new Error('Editora não encontrada');
        }

        return this.repository.delete(id);
    }
}