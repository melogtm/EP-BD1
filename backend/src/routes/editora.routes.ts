import { Router } from "express";
import { EditoraRepository } from "../repositories/editora.repository";
import { EditoraService } from "../services/editora.service";
import { EditoraController } from "../controllers/editora.controller";

const editoraRoutes = Router();

const editoraRepository = new EditoraRepository();
const editoraService = new EditoraService(editoraRepository);
const editoraController = new EditoraController(editoraService);

editoraRoutes.post("/", editoraController.create.bind(editoraController));
editoraRoutes.get("/", editoraController.getAll.bind(editoraController));
editoraRoutes.get("/:id", editoraController.getById.bind(editoraController));
editoraRoutes.put("/:id", editoraController.update.bind(editoraController));
editoraRoutes.delete("/:id", editoraController.delete.bind(editoraController));

export { editoraRoutes };
