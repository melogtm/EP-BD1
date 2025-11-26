import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DiagnosticoPage from "./pages/DiagnosticoPage";
import MedicamentoPage from "./pages/MedicamentoPage";
import PacientePage from "./pages/PacientePage";
import ConsultaPage from "./pages/ConsultaPage";
import ExamePage from "./pages/ExamePage";
import FuncionarioPage from "./pages/FuncionarioPage";
import EmpresaPage from "./pages/EmpresaPage";
import SalaPage from "./pages/SalaPage";
import NotFound from "./pages/NotFound";

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
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/diagnosticos" element={<Layout><DiagnosticoPage /></Layout>} />
          <Route path="/medicamentos" element={<Layout><MedicamentoPage /></Layout>} />
          <Route path="/pacientes" element={<Layout><PacientePage /></Layout>} />
          <Route path="/consultas" element={<Layout><ConsultaPage /></Layout>} />
          <Route path="/exames" element={<Layout><ExamePage /></Layout>} />
          <Route path="/funcionarios" element={<Layout><FuncionarioPage /></Layout>} />
          <Route path="/empresas" element={<Layout><EmpresaPage /></Layout>} />
          <Route path="/salas" element={<Layout><SalaPage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
