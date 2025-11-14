import { Router } from "express";
import { EditoraRepository } from "../repositories/editora.repository";
import { EditoraService } from "../services/editora.service";
import { EditoraController } from "../controllers/editora.controller";

const editoraRoutes = Router();

const editoraRepository = new EditoraRepository();
const editoraService = new EditoraService(editoraRepository);
const editoraController = new EditoraController(editoraService);

editoraRoutes.post("/", editoraController.create);
editoraRoutes.get("/", editoraController.getAll);
editoraRoutes.get("/:id", editoraController.getById);
editoraRoutes.put("/:id", editoraController.update);
editoraRoutes.delete("/:id", editoraController.delete);

export { editoraRoutes };
