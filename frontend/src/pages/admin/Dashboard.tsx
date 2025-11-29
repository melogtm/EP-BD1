import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Pill, FileText, Calendar, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  {
    title: 'Diagnósticos',
    description: 'Gerenciar diagnósticos e códigos CID-10',
    icon: FileText,
    path: '/admin/diagnosticos',
    color: 'text-primary',
  },
  {
    title: 'Medicamentos',
    description: 'Cadastro de medicamentos e controle de estoque',
    icon: Pill,
    path: '/admin/medicamentos',
    color: 'text-primary',
  },
  {
    title: 'Pacientes',
    description: 'Cadastro e gerenciamento de pacientes',
    icon: Users,
    path: '/admin/pacientes',
    color: 'text-primary',
  },
  {
    title: 'Consultas',
    description: 'Agendamento e registro de consultas',
    icon: Calendar,
    path: '/admin/consultas',
    color: 'text-primary',
  },
  {
    title: 'Exames',
    description: 'Solicitação e resultados de exames',
    icon: Activity,
    path: '/admin/exames',
    color: 'text-primary',
  },
  {
    title: 'Funcionários',
    description: 'Gestão de equipe médica e administrativa',
    icon: Stethoscope,
    path: '/admin/funcionarios',
    color: 'text-primary',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Bem-vindo ao Sistema
        </h2>
        <p className="text-muted-foreground mt-2">
          Selecione um módulo para começar a gerenciar o sistema hospitalar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          
          return (
            <Link
              key={module.title}
              to={module.path}
              className="group"
            >
              <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg bg-accent p-3 ${module.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-accent/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-accent-foreground">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="text-accent-foreground/80">
          <ul className="space-y-2 list-disc list-inside">
            <li>26 entidades de banco de dados implementadas</li>
            <li>Backend rodando em http://localhost:3000</li>
            <li>CRUD completo para todas as entidades</li>
            <li>Interface responsiva e intuitiva</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
