import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, CalendarIcon, CheckCircle } from "lucide-react";
import { consultaService } from "@/services/consultaService";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Consulta } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { funcionarioSaudeService } from "@/services/funcionarioService";

export function AgendamentoModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"selecao" | "confirmacao">("selecao");
  const [especialidade, setEspecialidade] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState<Date>();
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userCpf = localStorage.getItem("userCpf") || "";

  const { data: especialidades = [] } = useQuery({
    queryKey: ["especialidades"],
    queryFn: () => funcionarioSaudeService.getEspecialidades(),
    staleTime: 5 * 60 * 1000, // 5 minutos cache
  });

  const buscarHorarios = async () => {
    if (!especialidade || !dataSelecionada) return;

    setIsLoading(true);
    const dataFormatada = format(dataSelecionada, "yyyy-MM-dd");

    try {
      const horariosDisponiveis = await consultaService.getHorariosDisponiveis(
        userCpf,
        especialidade.toLowerCase(),
        dataFormatada
      );
      setHorarios(horariosDisponiveis);
    } finally {
      setIsLoading(false);
    }
  };

  const selecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario);
    setStep("confirmacao");
  };

  const confirmarAgendamento = async () => {
    if (!especialidade || !dataSelecionada || !horarioSelecionado) return;

    setIsLoading(true);

    try {
      const dataHoraCompleta = `${format(
        dataSelecionada,
        "yyyy-MM-dd"
      )}T${horarioSelecionado}:00`;

      const novaConsulta: Consulta = {
        dataHoraAgendada: dataHoraCompleta,
        cpfFuncSaude: "123.456.789-01", // ✅ Mock - backend real busca por especialidade
        cpfPaciente: userCpf,
        sala: 101,
        dataHoraInicio: undefined,
        dataHoraFim: undefined,
        valorAtendimento: 250.0,
        observacoesClinicas: `Agendada via portal - ${especialidade}`,
        tipoAtendimento: "consulta",
        statusAtendimento: "confirmada",
      };

      await consultaService.create(novaConsulta);

      toast.success(
        `✅ Consulta agendada!\n${format(
          dataSelecionada,
          "dd/MM/yyyy"
        )} às ${horarioSelecionado}`
      );

      queryClient.invalidateQueries({
        queryKey: ["consultas-futuras", userCpf],
      });
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error("❌ Erro ao agendar consulta.");
      console.error("Erro agendamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEspecialidade("");
    setDataSelecionada(undefined);
    setHorarioSelecionado("");
    setHorarios([]);
    setStep("selecao");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
          Buscar Especialidades
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "selecao" ? "Agendar Consulta" : "Confirmar Agendamento"}
          </DialogTitle>
        </DialogHeader>

        {step === "selecao" ? (
          // PASSO 1: Seleção
          <div className="space-y-4">
            {/* ✅ Select com especialidades do BACKEND */}
            <Select
              onValueChange={setEspecialidade}
              value={especialidade}
              disabled={!especialidades.length}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    especialidades.length
                      ? "Especialidade *"
                      : "Carregando especialidades..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((esp: string) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="text-sm font-medium mb-2 block">Data *</label>
              <Calendar
                mode="single"
                selected={dataSelecionada}
                onSelect={setDataSelecionada}
                className="rounded-md border"
                locale={ptBR}
                fromDate={new Date()}
              />
            </div>

            <Button
              onClick={buscarHorarios}
              disabled={!especialidade || !dataSelecionada || isLoading}
              className="w-full"
            >
              <Clock className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar Horários"}
            </Button>

            {horarios.length > 0 && (
              <div className="p-4 bg-green-50 border rounded-lg">
                <p className="text-sm font-medium mb-2 text-green-800">
                  Horários disponíveis:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {horarios.map((horario) => (
                    <Button
                      key={horario}
                      variant="outline"
                      size="sm"
                      onClick={() => selecionarHorario(horario)}
                      className="h-10 border-green-300 hover:bg-green-50"
                    >
                      {horario}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // PASSO 2: Confirmação (sem mudanças)
          <div className="space-y-4 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl border">
              <div className="font-bold text-xl mb-1">{especialidade}</div>
              <div className="text-2xl font-bold text-primary">
                {format(dataSelecionada!, "dd/MM/yyyy")} às {horarioSelecionado}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Dr. João Silva (mock)</p>
              <p>• Status: Confirmada</p>
              <p>• CPF: {userCpf}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "confirmacao" ? (
            <>
              <Button variant="outline" onClick={() => setStep("selecao")}>
                Alterar
              </Button>
              <Button onClick={confirmarAgendamento} disabled={isLoading}>
                {isLoading ? "Confirmando..." : "Confirmar Agendamento"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
