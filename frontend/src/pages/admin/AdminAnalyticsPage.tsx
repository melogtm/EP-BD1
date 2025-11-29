import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Users,
  Building2,
  BarChart3,
  Phone,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { salaService } from "@/services/salaService";
import { adminService } from "@/services/adminService";

export default function AdminAnalyticsPage() {
  const [dataInicio, setDataInicio] = useState("2025-11-01");
  const [dataFim, setDataFim] = useState("2025-11-29");
  const [medicoCpf, setMedicoCpf] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics", dataInicio, dataFim, medicoCpf],
    enabled: !!dataInicio && !!dataFim,
    queryFn: async () => {
      const [
        ocupacaoSalas,
        pagamentosTotais,
        funcionariosPacientes,
        pacientesCancelamentos,
        pacientesSemExames,
        confirmacoesDia,
      ] = await Promise.all([
        salaService.getOcupacaoSalas(dataInicio, dataFim),
        adminService.getPagamentosTotais(dataInicio, dataFim),
        adminService.getFuncionariosPacientes(),
        adminService.getPacientesCancelamentos(),
        adminService.getPacientesSemExames(),
        adminService.getConfirmacoesDiaMedico(dataInicio, medicoCpf),
      ]);

      return {
        ocupacaoSalas,
        pagamentosTotais,
        funcionariosPacientes,
        pacientesCancelamentos,
        pacientesSemExames,
        confirmacoesDia,
      };
    },
  });

  const ocupacaoSalas = data?.ocupacaoSalas ?? [];
  const pagamentosTotais = data?.pagamentosTotais;
  const funcionariosPacientes = data?.funcionariosPacientes ?? [];
  const pacientesCancelamentos = data?.pacientesCancelamentos ?? [];
  const pacientesSemExames = data?.pacientesSemExames ?? [];
  const confirmacoesDia = data?.confirmacoesDia ?? [];

  // ✅ Função para calcular percentual de ocupação
  const calcularOcupacao = (sala) => {
    if (!sala.capacidade || sala.totalConsultas === 0) return 0;
    return Math.round((sala.totalConsultas / sala.capacidade) * 100);
  };

  // ✅ Função para determinar cor do status
  const getStatusColor = (ocupacaoPercent) => {
    if (ocupacaoPercent === 0) return "bg-gray-100 text-gray-700";
    if (ocupacaoPercent < 30) return "bg-green-100 text-green-700";
    if (ocupacaoPercent < 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-8">
      {/* Header com filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Análise Hospitalar</h2>
          <p className="text-muted-foreground">
            {dataInicio} até {dataFim} •{" "}
            {isLoading
              ? "Carregando..."
              : `${ocupacaoSalas.length} salas, R$ ${
                  pagamentosTotais?.total?.toFixed(0) || 0
                }`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <span className="self-center text-sm text-muted-foreground">até</span>
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF Médico (opcional)"
            className="border rounded-md px-3 py-2 w-40"
            value={medicoCpf}
            onChange={(e) => setMedicoCpf(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          Erro ao carregar dados: {error.message}
        </div>
      )}

      {/* 1. SALAS MENOS UTILIZADAS - ✅ CORRIGIDO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Taxa de Ocupação das Salas</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">
              {ocupacaoSalas.length} salas
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {ocupacaoSalas.length ? (
            <div className="space-y-2">
              {ocupacaoSalas.slice(0, 5).map((sala) => {
                const ocupacaoPercent = calcularOcupacao(sala);
                const statusColor = getStatusColor(ocupacaoPercent);

                return (
                  <div
                    key={sala.numeroSala}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {sala.tipoSala} (Sala {sala.numeroSala})
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Capacidade: {sala.capacidade || "N/A"} pessoas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {sala.totalConsultas} consultas
                      </div>
                      <div
                        className={`text-sm font-medium px-2 py-1 rounded ${statusColor}`}
                      >
                        {ocupacaoPercent}% ocupação
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma sala no período
            </p>
          )}
        </CardContent>
      </Card>

      {/* 2. GRID PRINCIPAL - 6 Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* RECEITA */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <CardTitle>Receita Período</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {pagamentosTotais ? (
              <>
                <div className="text-3xl font-bold text-primary">
                  R$ {pagamentosTotais.total?.toFixed(2) || 0}
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <div>Por plano:</div>
                  {Object.entries(pagamentosTotais.porPlano || {})
                    .slice(0, 3)
                    .map(([plano, valor]) => (
                      <div key={plano} className="flex justify-between">
                        <span>{plano}</span>
                        <span>R$ {Number(valor).toFixed(0)}</span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">R$ 0,00</p>
            )}
          </CardContent>
        </Card>

        {/* FUNCIONÁRIOS PACIENTES */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Funcionários Pacientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {funcionariosPacientes.slice(0, 3).map((f) => (
              <div
                key={f.cpf}
                className="flex justify-between items-center text-sm py-1"
              >
                <span>{f.nome}</span>
                <div className="text-right">
                  <div>{f.totalConsultas} consultas</div>
                  <div>R$ {f.totalGasto?.toFixed(0) || 0}</div>
                </div>
              </div>
            ))}
            {funcionariosPacientes.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* PACIENTES SEM EXAMES */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Pacientes Sem Exames</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pacientesSemExames.slice(0, 3).map((p) => (
              <div key={p.cpf} className="flex justify-between text-sm">
                <span>{p.nome}</span>
                <span>{p.totalConsultas} consultas</span>
              </div>
            ))}
            {pacientesSemExames.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. PACIENTES QUE MAIS CANCELARAM */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes que Mais Cancelaram</CardTitle>
        </CardHeader>
        <CardContent>
          {pacientesCancelamentos.length ? (
            <div className="space-y-2">
              {pacientesCancelamentos.map((p) => (
                <div
                  key={p.cpf}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{p.nome}</div>
                    <div className="text-sm text-muted-foreground">{p.cpf}</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {p.cancelamentos}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum cancelamento
            </p>
          )}
        </CardContent>
      </Card>

      {/* 4. CONFIRMAÇÕES DO DIA/MÉDICO */}
      <Card>
        <CardHeader>
          <CardTitle>
            Confirmações {medicoCpf ? `| Médico: ${medicoCpf}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {confirmacoesDia.length ? (
            confirmacoesDia.map((conf) => (
              <div
                key={conf.medicoCpf}
                className="border-b pb-4 mb-4 last:border-b-0 last:mb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold">{conf.medicoNome}</div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {conf.data}
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  {conf.pacientes.map((paciente) => (
                    <div
                      key={paciente.cpf}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <div className="font-medium">{paciente.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          {paciente.cpf}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {paciente.telefone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {paciente.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {medicoCpf
                ? "Nenhum paciente para este médico"
                : "Digite CPF do médico ou selecione período"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
