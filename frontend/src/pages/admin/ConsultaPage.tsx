import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultaService } from '@/services/consultaService';
import { Consulta } from '@/types';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConsultaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Consulta | null>(null);
  const [formData, setFormData] = useState<Consulta>({
    dataHoraAgendada: '',
    cpfFuncSaude: '',
    cpfPaciente: '',
    sala: 0,
    tipoAtendimento: 'Presencial',
    statusAtendimento: 'Agendado',
  });

  const { data: consultas = [], isLoading } = useQuery({
    queryKey: ['consultas'],
    queryFn: consultaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: consultaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Consulta agendada com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ dataHoraAgendada, cpfFuncSaude, cpfPaciente }: Consulta) =>
      consultaService.delete(dataHoraAgendada, cpfFuncSaude, cpfPaciente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Consulta cancelada com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      dataHoraAgendada: '',
      cpfFuncSaude: '',
      cpfPaciente: '',
      sala: 0,
      tipoAtendimento: 'Presencial',
      statusAtendimento: 'Agendado',
    });
    setSelectedItem(null);
  };

  const handleDelete = (item: Consulta) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      dataHoraAgendada: new Date(formData.dataHoraAgendada).toISOString(),
    };
    createMutation.mutate(dataToSubmit);
  };

  const columns = [
    {
      header: 'Data/Hora',
      accessor: ((row: Consulta) =>
        new Date(row.dataHoraAgendada).toLocaleString('pt-BR')) as any,
    },
    { header: 'CPF Médico', accessor: 'cpfFuncSaude' as keyof Consulta },
    { header: 'CPF Paciente', accessor: 'cpfPaciente' as keyof Consulta },
    { header: 'Sala', accessor: 'sala' as keyof Consulta },
    { header: 'Status', accessor: 'statusAtendimento' as keyof Consulta },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Consultas
          </h2>
          <p className="text-muted-foreground">
            Gerenciar agendamentos e consultas médicas
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agendar Consulta
        </Button>
      </div>

      <DataTable
        data={consultas}
        columns={columns}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta</DialogTitle>
            <DialogDescription>
              Preencha os dados para agendar a consulta
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataHoraAgendada">Data e Hora *</Label>
                <Input
                  id="dataHoraAgendada"
                  type="datetime-local"
                  value={formData.dataHoraAgendada}
                  onChange={(e) =>
                    setFormData({ ...formData, dataHoraAgendada: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="sala">Sala *</Label>
                <Input
                  id="sala"
                  type="number"
                  value={formData.sala}
                  onChange={(e) =>
                    setFormData({ ...formData, sala: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpfFuncSaude">CPF do Médico *</Label>
                <Input
                  id="cpfFuncSaude"
                  value={formData.cpfFuncSaude}
                  onChange={(e) =>
                    setFormData({ ...formData, cpfFuncSaude: e.target.value })
                  }
                  placeholder="00000000000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpfPaciente">CPF do Paciente *</Label>
                <Input
                  id="cpfPaciente"
                  value={formData.cpfPaciente}
                  onChange={(e) =>
                    setFormData({ ...formData, cpfPaciente: e.target.value })
                  }
                  placeholder="00000000000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipoAtendimento">Tipo de Atendimento *</Label>
                <Input
                  id="tipoAtendimento"
                  value={formData.tipoAtendimento}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoAtendimento: e.target.value })
                  }
                  placeholder="Ex: Presencial, Telemedicina"
                  required
                />
              </div>
              <div>
                <Label htmlFor="statusAtendimento">Status *</Label>
                <Input
                  id="statusAtendimento"
                  value={formData.statusAtendimento}
                  onChange={(e) =>
                    setFormData({ ...formData, statusAtendimento: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoesClinicas">Observações Clínicas</Label>
              <Textarea
                id="observacoesClinicas"
                value={formData.observacoesClinicas || ''}
                onChange={(e) =>
                  setFormData({ ...formData, observacoesClinicas: e.target.value })
                }
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar Consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
