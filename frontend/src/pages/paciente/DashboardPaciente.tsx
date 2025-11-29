import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { consultaService } from "@/services/consultaService";
import { AgendamentoModal } from "./AgendamentoModal";

export default function PacienteConsultasPage() {
  const userCpf = localStorage.getItem("userCpf") || "";

  const { data: consultasPassadas = [] } = useQuery({
    queryKey: ["consultas-passadas", userCpf],
    queryFn: () => consultaService.getConsultasPacientePassadas(userCpf),
  });

  const { data: consultasFuturas = [] } = useQuery({
    queryKey: ["consultas-futuras", userCpf],
    queryFn: () => consultaService.getConsultasPacienteFuturas(userCpf),
  });

  // ✅ Função segura para formatar data
  const formatDataSegura = (dataHoraAgendada: string | undefined) => {
    if (!dataHoraAgendada) return "Data inválida";
    try {
      return format(new Date(dataHoraAgendada), "dd/MM/yyyy HH:mm", {
        locale: ptBR,
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Minhas Consultas</h2>
      </div>

      {/* Consultas Passadas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Consultas Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {consultasPassadas.length ? (
              <div className="space-y-3">
                {consultasPassadas.map((consulta) => (
                  <div key={consulta.id} className="p-4 border rounded-lg">
                    <div className="font-medium">
                      {consulta.medico?.nome || "Médico não identificado"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDataSegura(consulta.dataHoraAgendada)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma consulta realizada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Consultas Agendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Consultas Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {consultasFuturas.length ? (
              <div className="space-y-3">
                {consultasFuturas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="p-4 border rounded-lg bg-amber-50"
                  >
                    <div className="font-semibold">
                      {consulta.medico?.nome || "Médico não identificado"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDataSegura(consulta.dataHoraAgendada)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma consulta agendada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Buscar Horários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Agendar Nova Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-muted/50 rounded-xl text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Escolha uma especialidade e data para ver horários disponíveis
            </p>
            <AgendamentoModal />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
