import { Router } from "express";
import { ConsultaController } from "../controllers/consulta.controller";

const consultaRoutes = Router();
const consultaController = new ConsultaController();

consultaRoutes.post("/", consultaController.create.bind(consultaController));
consultaRoutes.get("/", consultaController.getAll.bind(consultaController));
consultaRoutes.get(
  "/paciente/:cpfPaciente",
  consultaController.getByPaciente.bind(consultaController)
);
consultaRoutes.get(
  "/getConsultasPassadas/:cpfPaciente",
  consultaController.getConsultasPassadas.bind(consultaController)
);
consultaRoutes.get(
  "/getConsultasFuturas/:cpfPaciente",
  consultaController.getConsultasFuturas.bind(consultaController)
);
consultaRoutes.get(
  "/medico/:cpfFuncSaude",
  consultaController.getByMedico.bind(consultaController)
);

consultaRoutes.get(
  "/medico/:cpfFuncSaude",
  consultaController.getByMedico.bind(consultaController)
);


consultaRoutes.patch(
  "/:dataHoraAgendada/:cpfFuncSaude/:cpfPaciente",
  consultaController.update.bind(consultaController)
);
consultaRoutes.delete(
  "/:dataHoraAgendada/:cpfFuncSaude/:cpfPaciente",
  consultaController.delete.bind(consultaController)
);

export { consultaRoutes };
