import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { funcionarioService, funcionarioSaudeService } from '@/services/funcionarioService';
import { pessoaService } from '@/services/pacienteService';
import { Funcionario, FuncionarioSaude, Pessoa } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FuncionarioPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Funcionario | null>(null);
  const [isSaude, setIsSaude] = useState(false);
  
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

  const [funcionarioData, setFuncionarioData] = useState<Funcionario>({
    cpf: '',
    dataAdmissao: '',
    salarioBase: 0,
    statusCargo: 'Ativo',
    horarioTrab: '',
    salaAlocacao: 0,
  });

  const [funcionarioSaudeData, setFuncionarioSaudeData] = useState<FuncionarioSaude>({
    cpf: '',
    registroProfissional: '',
    funcao: '',
    especialidade: '',
  });

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: funcionarioService.getAll,
  });

  const createPessoaMutation = useMutation({
    mutationFn: pessoaService.create,
  });

  const createFuncionarioMutation = useMutation({
    mutationFn: funcionarioService.create,
  });

  const createFuncionarioSaudeMutation = useMutation({
    mutationFn: funcionarioSaudeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: 'Sucesso',
        description: 'Funcionário criado com sucesso',
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
      await funcionarioService.delete(cpf);
      await pessoaService.delete(cpf);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      setIsDeleteOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Funcionário excluído com sucesso',
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
    setFuncionarioData({
      cpf: '',
      dataAdmissao: '',
      salarioBase: 0,
      statusCargo: 'Ativo',
      horarioTrab: '',
      salaAlocacao: 0,
    });
    setFuncionarioSaudeData({
      cpf: '',
      registroProfissional: '',
      funcao: '',
      especialidade: '',
    });
    setIsSaude(false);
    setSelectedItem(null);
  };

  const handleDelete = (item: Funcionario) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPessoaMutation.mutateAsync(pessoaData);
      await createFuncionarioMutation.mutateAsync({
        ...funcionarioData,
        cpf: pessoaData.cpf,
      });
      if (isSaude) {
        await createFuncionarioSaudeMutation.mutateAsync({
          ...funcionarioSaudeData,
          cpf: pessoaData.cpf,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
        setIsFormOpen(false);
        resetForm();
        toast({
          title: 'Sucesso',
          description: 'Funcionário criado com sucesso',
        });
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const columns = [
    { header: 'CPF', accessor: 'cpf' as keyof Funcionario },
    {
      header: 'Admissão',
      accessor: ((row: Funcionario) =>
        new Date(row.dataAdmissao).toLocaleDateString('pt-BR')) as any,
    },
    {
      header: 'Salário',
      accessor: ((row: Funcionario) =>
        `R$ ${row.salarioBase.toFixed(2)}`) as any,
    },
    { header: 'Status', accessor: 'statusCargo' as keyof Funcionario },
    { header: 'Sala', accessor: 'salaAlocacao' as keyof Funcionario },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Funcionários
          </h2>
          <p className="text-muted-foreground">
            Gerenciar equipe médica e administrativa
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
          Novo Funcionário
        </Button>
      </div>

      <DataTable
        data={funcionarios}
        columns={columns}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados do funcionário
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="pessoa" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pessoa">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="funcionario">Dados do Cargo</TabsTrigger>
                <TabsTrigger value="saude">Saúde (Opcional)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pessoa" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={pessoaData.cpf}
                      onChange={(e) => setPessoaData({ ...pessoaData, cpf: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={pessoaData.nome}
                      onChange={(e) => setPessoaData({ ...pessoaData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={pessoaData.email}
                      onChange={(e) => setPessoaData({ ...pessoaData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genero">Gênero *</Label>
                    <Input
                      id="genero"
                      value={pessoaData.genero}
                      onChange={(e) => setPessoaData({ ...pessoaData, genero: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="funcionario" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                    <Input
                      id="dataAdmissao"
                      type="date"
                      value={funcionarioData.dataAdmissao}
                      onChange={(e) =>
                        setFuncionarioData({ ...funcionarioData, dataAdmissao: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salarioBase">Salário Base (R$) *</Label>
                    <Input
                      id="salarioBase"
                      type="number"
                      step="0.01"
                      value={funcionarioData.salarioBase}
                      onChange={(e) =>
                        setFuncionarioData({
                          ...funcionarioData,
                          salarioBase: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="horarioTrab">Horário de Trabalho *</Label>
                    <Input
                      id="horarioTrab"
                      value={funcionarioData.horarioTrab}
                      onChange={(e) =>
                        setFuncionarioData({ ...funcionarioData, horarioTrab: e.target.value })
                      }
                      placeholder="Ex: 08:00-17:00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaAlocacao">Sala de Alocação *</Label>
                    <Input
                      id="salaAlocacao"
                      type="number"
                      value={funcionarioData.salaAlocacao}
                      onChange={(e) =>
                        setFuncionarioData({
                          ...funcionarioData,
                          salaAlocacao: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="saude" className="space-y-4 mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="isSaude"
                    checked={isSaude}
                    onChange={(e) => setIsSaude(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isSaude">Este é um funcionário da área de saúde</Label>
                </div>
                {isSaude && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registroProfissional">Registro Profissional *</Label>
                      <Input
                        id="registroProfissional"
                        value={funcionarioSaudeData.registroProfissional}
                        onChange={(e) =>
                          setFuncionarioSaudeData({
                            ...funcionarioSaudeData,
                            registroProfissional: e.target.value,
                          })
                        }
                        required={isSaude}
                      />
                    </div>
                    <div>
                      <Label htmlFor="funcao">Função *</Label>
                      <Input
                        id="funcao"
                        value={funcionarioSaudeData.funcao}
                        onChange={(e) =>
                          setFuncionarioSaudeData({
                            ...funcionarioSaudeData,
                            funcao: e.target.value,
                          })
                        }
                        placeholder="Ex: Médico, Enfermeiro"
                        required={isSaude}
                      />
                    </div>
                    <div>
                      <Label htmlFor="especialidade">Especialidade *</Label>
                      <Input
                        id="especialidade"
                        value={funcionarioSaudeData.especialidade}
                        onChange={(e) =>
                          setFuncionarioSaudeData({
                            ...funcionarioSaudeData,
                            especialidade: e.target.value,
                          })
                        }
                        placeholder="Ex: Cardiologia, Clínico Geral"
                        required={isSaude}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Funcionário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o funcionário com CPF "{selectedItem?.cpf}"? Esta
              ação não pode ser desfeita.
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
