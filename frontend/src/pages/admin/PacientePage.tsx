import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pacienteService, pessoaService } from '@/services/pacienteService';
import { Paciente, Pessoa } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PacientePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Paciente | null>(null);
  
  const [pessoaData, setPessoaData] = useState<Pessoa>({
    cpf: '',
    nome: '',
    email: '',
    genero: '',
    dataNascDia: 1,
    dataNascMes: 1,
    dataNascAno: 2000,
    endRua: '',
    endNum: '',
    endBairro: '',
    endCidade: '',
    endUf: '',
    endPais: 'Brasil',
    endCep: '',
  });

  const [pacienteData, setPacienteData] = useState<Paciente>({
    cpf: '',
    tipoSanguineo: '',
    profissao: '',
    statusCadastro: 'Ativo',
  });

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ['pacientes'],
    queryFn: pacienteService.getAll,
  });

  const createPessoaMutation = useMutation({
    mutationFn: pessoaService.create,
  });

  const createPacienteMutation = useMutation({
    mutationFn: pacienteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Paciente criado com sucesso',
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
    mutationFn: async (cpf: string) => {
      await pacienteService.delete(cpf);
      await pessoaService.delete(cpf);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Paciente excluído com sucesso',
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
    setPessoaData({
      cpf: '',
      nome: '',
      email: '',
      genero: '',
      dataNascDia: 1,
      dataNascMes: 1,
      dataNascAno: 2000,
      endRua: '',
      endNum: '',
      endBairro: '',
      endCidade: '',
      endUf: '',
      endPais: 'Brasil',
      endCep: '',
    });
    setPacienteData({
      cpf: '',
      tipoSanguineo: '',
      profissao: '',
      statusCadastro: 'Ativo',
    });
    setSelectedItem(null);
  };

  const handleDelete = (item: Paciente) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First create the Pessoa
      await createPessoaMutation.mutateAsync(pessoaData);
      // Then create the Paciente
      await createPacienteMutation.mutateAsync({
        ...pacienteData,
        cpf: pessoaData.cpf,
      });
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  const columns = [
    { header: 'CPF', accessor: 'cpf' as keyof Paciente },
    { header: 'Tipo Sanguíneo', accessor: 'tipoSanguineo' as keyof Paciente },
    { header: 'Profissão', accessor: 'profissao' as keyof Paciente },
    { header: 'Status', accessor: 'statusCadastro' as keyof Paciente },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pacientes</h2>
          <p className="text-muted-foreground">
            Cadastro e gerenciamento de pacientes
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
          Novo Paciente
        </Button>
      </div>

      <DataTable
        data={pacientes}
        columns={columns}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados pessoais e médicos do paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="pessoa" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pessoa">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="paciente">Dados Médicos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pessoa" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={pessoaData.cpf}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, cpf: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={pessoaData.nome}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, nome: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={pessoaData.email}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genero">Gênero *</Label>
                    <Input
                      id="genero"
                      value={pessoaData.genero}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, genero: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Data de Nascimento *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        placeholder="Dia"
                        min="1"
                        max="31"
                        value={pessoaData.dataNascDia}
                        onChange={(e) =>
                          setPessoaData({
                            ...pessoaData,
                            dataNascDia: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Mês"
                        min="1"
                        max="12"
                        value={pessoaData.dataNascMes}
                        onChange={(e) =>
                          setPessoaData({
                            ...pessoaData,
                            dataNascMes: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Ano"
                        min="1900"
                        max="2024"
                        value={pessoaData.dataNascAno}
                        onChange={(e) =>
                          setPessoaData({
                            ...pessoaData,
                            dataNascAno: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="endCep">CEP *</Label>
                    <Input
                      id="endCep"
                      value={pessoaData.endCep}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endCep: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endRua">Rua *</Label>
                    <Input
                      id="endRua"
                      value={pessoaData.endRua}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endRua: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endNum">Número *</Label>
                    <Input
                      id="endNum"
                      value={pessoaData.endNum}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endNum: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endBairro">Bairro *</Label>
                    <Input
                      id="endBairro"
                      value={pessoaData.endBairro}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endBairro: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endCidade">Cidade *</Label>
                    <Input
                      id="endCidade"
                      value={pessoaData.endCidade}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endCidade: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endUf">UF *</Label>
                    <Input
                      id="endUf"
                      value={pessoaData.endUf}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endUf: e.target.value })
                      }
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endPais">País *</Label>
                    <Input
                      id="endPais"
                      value={pessoaData.endPais}
                      onChange={(e) =>
                        setPessoaData({ ...pessoaData, endPais: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paciente" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipoSanguineo">Tipo Sanguíneo *</Label>
                    <Input
                      id="tipoSanguineo"
                      value={pacienteData.tipoSanguineo}
                      onChange={(e) =>
                        setPacienteData({
                          ...pacienteData,
                          tipoSanguineo: e.target.value,
                        })
                      }
                      placeholder="Ex: A+, O-, AB+"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="profissao">Profissão *</Label>
                    <Input
                      id="profissao"
                      value={pacienteData.profissao}
                      onChange={(e) =>
                        setPacienteData({
                          ...pacienteData,
                          profissao: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="statusCadastro">Status *</Label>
                    <Input
                      id="statusCadastro"
                      value={pacienteData.statusCadastro}
                      onChange={(e) =>
                        setPacienteData({
                          ...pacienteData,
                          statusCadastro: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Paciente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o paciente com CPF "
              {selectedItem?.cpf}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.cpf)}
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
