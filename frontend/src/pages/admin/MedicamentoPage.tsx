import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicamentoService } from '@/services/medicamentoService';
import { Medicamento } from '@/types';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MedicamentoPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Medicamento | null>(null);
  const [formData, setFormData] = useState<Medicamento>({
    nome: '',
  });

  const { data: medicamentos = [], isLoading } = useQuery({
    queryKey: ['medicamentos'],
    queryFn: medicamentoService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: medicamentoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Medicamento criado com sucesso',
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

  const updateMutation = useMutation({
    mutationFn: ({ nome, data }: { nome: string; data: Partial<Medicamento> }) =>
      medicamentoService.update(nome, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Medicamento atualizado com sucesso',
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
    mutationFn: medicamentoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Medicamento excluído com sucesso',
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
      nome: '',
    });
    setSelectedItem(null);
  };

  const handleEdit = (item: Medicamento) => {
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Medicamento) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate({
        nome: selectedItem.nome,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { header: 'Nome', accessor: 'nome' as keyof Medicamento },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Medicamentos</h2>
          <p className="text-muted-foreground">
            Cadastro de medicamentos e controle de estoque
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
          Novo Medicamento
        </Button>
      </div>

      <DataTable
        data={medicamentos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar' : 'Novo'} Medicamento
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do medicamento
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                disabled={!!selectedItem}
                required
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
              <Button type="submit">
                {selectedItem ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o medicamento "
              {selectedItem?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedItem &&
                deleteMutation.mutate(selectedItem.nome)
              }
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
