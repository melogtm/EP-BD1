import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salaService } from '@/services/salaService';
import { LocalSala } from '@/types';
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

export default function SalaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LocalSala | null>(null);
  const [formData, setFormData] = useState<LocalSala>({
    numeroSala: 0,
    tipoSala: '',
  });

  const { data: salas = [], isLoading } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: salaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Sala criada com sucesso',
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
    mutationFn: ({ id, data }: { id: number; data: Partial<LocalSala> }) =>
      salaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Sala atualizada com sucesso',
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
    mutationFn: salaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Sala excluída com sucesso',
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
      numeroSala: 0,
      tipoSala: '',
    });
    setSelectedItem(null);
  };

  const handleEdit = (item: LocalSala) => {
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: LocalSala) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate({
        id: selectedItem.numeroSala,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { header: 'Número', accessor: 'numeroSala' as keyof LocalSala },
    { header: 'Tipo', accessor: 'tipoSala' as keyof LocalSala },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Salas</h2>
          <p className="text-muted-foreground">
            Gerenciar salas e espaços do hospital
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
          Nova Sala
        </Button>
      </div>

      <DataTable
        data={salas}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar' : 'Nova'} Sala
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da sala
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="numeroSala">Número da Sala *</Label>
              <Input
                id="numeroSala"
                type="number"
                value={formData.numeroSala}
                onChange={(e) =>
                  setFormData({ ...formData, numeroSala: parseInt(e.target.value) })
                }
                disabled={!!selectedItem}
                required
              />
            </div>
            <div>
              <Label htmlFor="tipoSala">Tipo *</Label>
              <Input
                id="tipoSala"
                value={formData.tipoSala}
                onChange={(e) =>
                  setFormData({ ...formData, tipoSala: e.target.value })
                }
                placeholder="Ex: Consultório, Cirurgia, UTI"
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
              Tem certeza que deseja excluir a sala {selectedItem?.numeroSala}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedItem && deleteMutation.mutate(selectedItem.numeroSala)
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
