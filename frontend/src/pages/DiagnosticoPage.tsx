import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diagnosticoService } from "@/services/diagnosticoService";
import { Diagnostico } from "@/types";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DiagnosticoPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Diagnostico | null>(null);
  const [formData, setFormData] = useState<Diagnostico>({
    cid: "",
    descricao: "",
  });

  const { data: diagnosticos = [], isLoading } = useQuery({
    queryKey: ["diagnosticos"],
    queryFn: async () => {
      const result = await diagnosticoService.getAll();
      console.log("Resultado da query:", result); // ← Veja aqui o que retorna
      return result;
    },
  });

  const createMutation = useMutation({
    mutationFn: diagnosticoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Diagnóstico criado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cid, data }: { cid: string; data: Partial<Diagnostico> }) =>
      diagnosticoService.update(cid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Diagnóstico atualizado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: diagnosticoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      setIsDeleteOpen(false);
      toast({
        title: "Sucesso",
        description: "Diagnóstico excluído com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      cid: "",
      descricao: "",
    });
    setSelectedItem(null);
  };

  const handleEdit = (item: Diagnostico) => {
    setSelectedItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Diagnostico) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate({
        cid: selectedItem.cid,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { header: "CID", accessor: "cid" as keyof Diagnostico },
    { header: "Descrição", accessor: "descricao" as keyof Diagnostico },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Diagnósticos</h2>
          <p className="text-muted-foreground">
            Gerenciar diagnósticos e códigos CID-10
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
          Novo Diagnóstico
        </Button>
      </div>

      <DataTable
        data={diagnosticos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Editar" : "Novo"} Diagnóstico
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do diagnóstico
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cid">CID *</Label>
              <Input
                id="cid"
                value={formData.cid}
                onChange={(e) =>
                  setFormData({ ...formData, cid: e.target.value })
                }
                disabled={!!selectedItem}
                required
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
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
                {selectedItem ? "Atualizar" : "Criar"}
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
              Tem certeza que deseja excluir o diagnóstico "
              {selectedItem?.descricao}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedItem && deleteMutation.mutate(selectedItem.cid)
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
