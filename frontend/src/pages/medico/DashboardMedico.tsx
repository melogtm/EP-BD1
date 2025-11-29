import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { consultaService } from "@/services/consultaService";

export default function MedicoAgendaPage() {
  const userCpf = localStorage.getItem("userCpf") || "";
  const hoje = format(new Date(), "yyyy-MM-dd");

  const { data: agendaHoje } = useQuery({
    queryKey: ["agenda-medico", userCpf, hoje],
    queryFn: () => consultaService.getAgendaMedicoDia(userCpf, hoje),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="h-8 w-8" />
          Agenda - Hoje
        </h2>
        <p className="text-muted-foreground">
          {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {agendaHoje?.length ? (
            <div className="grid gap-4">
              {agendaHoje.map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5"
                >
                  <div>
                    <div className="font-semibold">
                      {consulta.paciente.nome}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {consulta.paciente.cpf}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">
                      {format(new Date(consulta.data), "HH:mm")}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        consulta.status === "confirmada"
                          ? "bg-green-100 text-green-800"
                          : consulta.status === "cancelada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {consulta.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma consulta hoje</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
