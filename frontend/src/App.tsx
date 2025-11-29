import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import RoleSelector from "./pages/RoleSelector"; // Novo componente
import Dashboard from "./pages/admin/Dashboard";
import DiagnosticoPage from "./pages/admin/DiagnosticoPage";
import MedicamentoPage from "./pages/admin/MedicamentoPage";
import PacientePage from "./pages/admin/PacientePage";
import ConsultaPage from "./pages/admin/ConsultaPage";
import ExamePage from "./pages/admin/ExamePage";
import FuncionarioPage from "./pages/admin/FuncionarioPage";
import EmpresaPage from "./pages/admin/EmpresaPage";
import SalaPage from "./pages/admin/SalaPage";
import NotFound from "./pages/admin/NotFound";
import CpfEntry from "./pages/CpfEntry";
import MedicoAgendaPage from "./pages/medico/DashboardMedico";
import PacienteConsultasPage from "./pages/paciente/DashboardPaciente";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* SELETOR DE PERFIS (Página inicial) */}
          <Route
            path="/"
            element={
              <Layout>
                <RoleSelector />
              </Layout>
            }
          />

          <Route path="/login" element={<Layout />}>
            <Route
              path="paciente"
              index
              element={<CpfEntry role="paciente" />}
            />
            <Route path="medico" index element={<CpfEntry role="medico" />} />
          </Route>

          {/* VISÃO MÉDICO */}
          <Route path="/medico" element={<Layout />}>
            <Route index element={<MedicoAgendaPage />} />
          </Route>

          {/* VISÃO PACIENTE */}
          <Route path="/paciente" element={<Layout />}>
            <Route index element={<PacienteConsultasPage />} />
          </Route>

          {/* VISÃO ADMIN (Acesso completo) */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analises" element={<AdminAnalyticsPage />} />
            <Route path="diagnosticos" element={<DiagnosticoPage />} />
            <Route path="medicamentos" element={<MedicamentoPage />} />
            <Route path="pacientes" element={<PacientePage />} />
            <Route path="consultas" element={<ConsultaPage />} />
            <Route path="exames" element={<ExamePage />} />
            <Route path="funcionarios" element={<FuncionarioPage />} />
            <Route path="empresas" element={<EmpresaPage />} />
            <Route path="salas" element={<SalaPage />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
