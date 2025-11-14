import {type Request, type Response} from "express";
import { EditoraService } from "../services/editora.service";


export class EditoraController {
  constructor(private editoraService: EditoraService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, endereco } = req.body
      const newEditora = await this.editoraService.create({ nome, endereco })
      return res.status(201).json(newEditora)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const editoras = await this.editoraService.getAll()
      return res.status(200).json(editoras)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id!, 10)
      const editora = await this.editoraService.getById(id)
      return res.status(200).json(editora)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id!, 10);
      const data = req.body;
      const updatedEditora = await this.editoraService.update(id, data);
      return res.status(200).json(updatedEditora);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id!, 10);
      await this.editoraService.delete(id);
      return res.status(204).send(); // 204 No Content é uma boa resposta para delete
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}