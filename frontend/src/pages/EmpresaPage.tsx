import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/services/empresaService';
import { Empresa } from '@/types';
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
import { Plus, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmpresaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<Empresa>({
    cnpj: '',
    razaoSocial: '',
    endRua: '',
    endNum: '',
    endBairro: '',
    endCidade: '',
    endUf: '',
    endPais: 'Brasil',
    endCep: '',
  });

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn: empresaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: empresaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Empresa criada com sucesso',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Empresa> }) =>
      empresaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Empresa atualizada com sucesso',
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
    mutationFn: empresaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Empresa excluída com sucesso',
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
      cnpj: '',
      razaoSocial: '',
      endRua: '',
      endNum: '',
      endBairro: '',
      endCidade: '',
      endUf: '',
      endPais: 'Brasil',
      endCep: '',
    });
    setSelectedItem(null);
  };

  const handleEdit = (item: Empresa) => {
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Empresa) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.cnpj, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { header: 'CNPJ', accessor: 'cnpj' as keyof Empresa },
    { header: 'Razão Social', accessor: 'razaoSocial' as keyof Empresa },
    { header: 'Cidade', accessor: 'endCidade' as keyof Empresa },
    { header: 'UF', accessor: 'endUf' as keyof Empresa },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Empresas
          </h2>
          <p className="text-muted-foreground">
            Gerenciar empresas parceiras e fornecedoras
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
          Nova Empresa
        </Button>
      </div>

      <DataTable
        data={empresas}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Editar' : 'Nova'} Empresa</DialogTitle>
            <DialogDescription>Preencha os dados da empresa</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  disabled={!!selectedItem}
                  required
                />
              </div>
              <div>
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endRua">Rua *</Label>
                <Input
                  id="endRua"
                  value={formData.endRua}
                  onChange={(e) => setFormData({ ...formData, endRua: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endNum">Número *</Label>
                <Input
                  id="endNum"
                  value={formData.endNum}
                  onChange={(e) => setFormData({ ...formData, endNum: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endBairro">Bairro *</Label>
                <Input
                  id="endBairro"
                  value={formData.endBairro}
                  onChange={(e) => setFormData({ ...formData, endBairro: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endCidade">Cidade *</Label>
                <Input
                  id="endCidade"
                  value={formData.endCidade}
                  onChange={(e) => setFormData({ ...formData, endCidade: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endUf">UF *</Label>
                <Input
                  id="endUf"
                  value={formData.endUf}
                  onChange={(e) => setFormData({ ...formData, endUf: e.target.value })}
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endCep">CEP *</Label>
                <Input
                  id="endCep"
                  value={formData.endCep}
                  onChange={(e) => setFormData({ ...formData, endCep: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{selectedItem ? 'Atualizar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa "{selectedItem?.razaoSocial}"? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.cnpj)}
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
