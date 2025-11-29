import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserCog, Stethoscope, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
  {
    title: 'Paciente',
    description: 'Acessar histórico médico, agendamentos e resultados',
    icon: User,
    path: '/login/paciente',
    color: 'text-blue-500',
  },
  {
    title: 'Médico',
    description: 'Gerenciar consultas, prescrições e pacientes atendidos',
    icon: Stethoscope,
    path: '/login/medico',
    color: 'text-green-500',
  },
  {
    title: 'Admin',
    description: 'Controle total do sistema e gerenciamento administrativo',
    icon: UserCog,
    path: '/admin',
    color: 'text-purple-500',
  },
];

export default function RoleSelector() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Selecione seu Perfil
        </h2>
        <p className="text-muted-foreground mt-2">
          Escolha uma visão para explorar o sistema hospitalar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          
          return (
            <Link
              key={role.title}
              to={role.path}
              className="group"
            >
              <Card className="h-full transition-all hover:shadow-xl hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]">
                <CardHeader className="pb-4">
                  <div className={`rounded-2xl bg-gradient-to-br ${role.color === 'text-blue-500' ? 'from-blue-500/10 to-blue-600/10 border-blue-500/20' : 
                    role.color === 'text-green-500' ? 'from-green-500/10 to-green-600/10 border-green-500/20' : 
                    'from-purple-500/10 to-purple-600/10 border-purple-500/20'} p-4 border flex justify-center mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-all duration-200 font-semibold">
                      {role.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Entrar na visão →
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-muted/50 to-accent/50 border-primary/30">
        <CardHeader>
          <CardTitle className="text-accent-foreground font-semibold">Modo Demonstração</CardTitle>
        </CardHeader>
        <CardContent className="text-accent-foreground/90">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary/70" />
              Sem autenticação necessária
            </li>
            <li className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary/70" />
              3 visões diferentes para apresentação
            </li>
            <li className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary/70" />
              Navegação fluida entre módulos
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
