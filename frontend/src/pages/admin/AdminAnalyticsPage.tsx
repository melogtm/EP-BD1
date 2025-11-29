import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, Users, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salaService } from '@/services/salaService';
import { consultaService } from '@/services/consultaService';

export default function AdminAnalyticsPage() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const { data: analiticas } = useQuery({
    queryKey: ['analiticas', dataInicio, dataFim],
    queryFn: () => Promise.all([
      salaService.getOcupacaoSalas(dataInicio, dataFim),
      pagamentoService.getPagamentosMes(),
      consultaService.getFuncionariosPacientes(),
      consultaService.getPacientesCancelamentos(),
      consultaService.getPacientesSemExames(),
      consultaService.getConfirmacoesDiaMedico(),
    ]),
    enabled: !!dataInicio && !!dataFim,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Analytics Hospitalar</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salas Menos Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>{/* Gráfico/tabela salas */}</CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <DollarSign className="h-6 w-6" />
            <CardTitle>Receita Mês</CardTitle>
          </CardHeader>
          <CardContent>{/* Valores por plano/paciente */}</CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Users className="h-6 w-6" />
            <CardTitle>Funcionários Pacientes</CardTitle>
          </CardHeader>
          <CardContent>{/* Lista ordenada */}</CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Building2 className="h-6 w-6" />
            <CardTitle>Pacientes Sem Exames</CardTitle>
          </CardHeader>
          <CardContent>{/* Lista para upsell */}</CardContent>
        </Card>
      </div>
    </div>
  );
}
