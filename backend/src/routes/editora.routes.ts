import { Router } from 'express'
import { EditoraRepository } from '../repositories/editora.repository.js'
import { EditoraService } from '../services/editora.service.js'
import { EditoraController } from '../controllers/editora.controller.js'


const editoraRoutes = Router()

const editoraRepository = new EditoraRepository()
const editoraService = new EditoraService(editoraRepository)
const editoraController = new EditoraController(editoraService)

editoraRoutes.post('/', (req, res) => editoraController.create(req, res))
editoraRoutes.get('/', (req, res) => editoraController.getAll(req, res))
editoraRoutes.get('/:id', (req, res) => editoraController.getById(req, res))
editoraRoutes.put('/:id', (req, res) => editoraController.update(req, res))
editoraRoutes.delete('/:id', (req, res) => editoraController.delete(req, res))

export { editoraRoutes }