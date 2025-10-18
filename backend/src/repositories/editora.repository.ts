import { Prisma, type Editora } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export class EditoraRepository {

    async create(data: Prisma.EditoraCreateInput): Promise<Editora> {
        return prisma.editora.create({
            data
        });
    }

    async findAll(): Promise<Editora[]> {
        return prisma.editora.findMany();
    }

    async findById(id: number): Promise<Editora | null> {
        return prisma.editora.findUnique({
            where: { id }
        });
    }

    async findByName(nome: string): Promise<Editora | null> {
        return prisma.editora.findFirst({
            where: { nome }
        });
    }

    async update(id: number, data: Prisma.EditoraUpdateInput): Promise<Editora> {
        return prisma.editora.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<Editora> {
        return prisma.editora.delete({
            where: { id }
        });
    }
}