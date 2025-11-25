import { Router } from "express";
import { ConsultaDiagnosticoController } from "../controllers/consulta-diagnostico.controller";

const consultaDiagnosticoRoutes = Router();
const consultaDiagnosticoController = new ConsultaDiagnosticoController();

consultaDiagnosticoRoutes.post("/", consultaDiagnosticoController.create.bind(consultaDiagnosticoController));
consultaDiagnosticoRoutes.get("/", consultaDiagnosticoController.getAll.bind(consultaDiagnosticoController));
consultaDiagnosticoRoutes.get("/:dataHoraAgendada/:cpfFuncSaude/:cpfPaciente", consultaDiagnosticoController.getByConsulta.bind(consultaDiagnosticoController));
consultaDiagnosticoRoutes.delete("/:dataHoraAgendada/:cpfFuncSaude/:cpfPaciente/:codigoDiagnostico", consultaDiagnosticoController.delete.bind(consultaDiagnosticoController));

export { consultaDiagnosticoRoutes };
