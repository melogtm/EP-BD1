import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exameService } from '@/services/exameService';
import { Exame } from '@/types';
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
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExamePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Exame | null>(null);
  const [formData, setFormData] = useState<Exame>({
    tipoExame: '',
    descricao: '',
    dataHoraSolicitacao: '',
    dataHoraCons: '',
    cpfPaciente: '',
    cpfFuncSaude: '',
  });

  const { data: exames = [], isLoading } = useQuery({
    queryKey: ['exames'],
    queryFn: exameService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: exameService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Exame solicitado com sucesso',
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
    mutationFn: (exameId: number) => exameService.delete(exameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Exame excluído com sucesso',
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
      tipoExame: '',
      descricao: '',
      dataHoraSolicitacao: '',
      dataHoraCons: '',
      cpfPaciente: '',
      cpfFuncSaude: '',
    });
    setSelectedItem(null);
  };

  const handleDelete = (item: Exame) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      dataHoraCons: new Date(formData.dataHoraCons).toISOString(),
      dataHoraSolicitacao: new Date(formData.dataHoraSolicitacao).toISOString(),
    };
    createMutation.mutate(dataToSubmit);
  };

  const columns = [
    { header: 'ID', accessor: 'exameId' as keyof Exame },
    { header: 'Tipo', accessor: 'tipoExame' as keyof Exame },
    {
      header: 'Data Solicitação',
      accessor: ((row: Exame) =>
        new Date(row.dataHoraSolicitacao).toLocaleDateString('pt-BR')) as any,
    },
    { header: 'CPF Paciente', accessor: 'cpfPaciente' as keyof Exame },
    { header: 'Resultado', accessor: 'resultado' as keyof Exame },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Exames
          </h2>
          <p className="text-muted-foreground">
            Solicitação e acompanhamento de exames médicos
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
          Solicitar Exame
        </Button>
      </div>

      <DataTable
        data={exames}
        columns={columns}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Novo Exame</DialogTitle>
            <DialogDescription>
              Preencha os dados para solicitar o exame
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoExame">Tipo de Exame *</Label>
                <Input
                  id="tipoExame"
                  value={formData.tipoExame}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoExame: e.target.value })
                  }
                  placeholder="Ex: Hemograma, Raio-X, Ressonância"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataHoraSolicitacao">Data/Hora da Solicitação *</Label>
                <Input
                  id="dataHoraSolicitacao"
                  type="datetime-local"
                  value={formData.dataHoraSolicitacao}
                  onChange={(e) =>
                    setFormData({ ...formData, dataHoraSolicitacao: e.target.value })
                  }
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
              <div className="col-span-2">
                <Label htmlFor="dataHoraCons">Data/Hora da Consulta *</Label>
                <Input
                  id="dataHoraCons"
                  type="datetime-local"
                  value={formData.dataHoraCons}
                  onChange={(e) =>
                    setFormData({ ...formData, dataHoraCons: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Solicitar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este exame? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem?.exameId && deleteMutation.mutate(selectedItem.exameId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
