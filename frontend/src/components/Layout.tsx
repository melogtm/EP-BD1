import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Home, 
  Pill, 
  Users, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Building2,
  DoorOpen
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/diagnosticos', label: 'Diagnósticos', icon: Activity },
  { path: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { path: '/pacientes', label: 'Pacientes', icon: Users },
  { path: '/consultas', label: 'Consultas', icon: Calendar },
  { path: '/exames', label: 'Exames', icon: FileText },
  { path: '/funcionarios', label: 'Funcionários', icon: Stethoscope },
  { path: '/empresas', label: 'Empresas', icon: Building2 },
  { path: '/salas', label: 'Salas', icon: DoorOpen },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Activity className="h-6 w-6 text-sidebar-primary" />
          <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
            EP-BD1 Hospital
          </span>
        </div>
        
        <nav className="space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <div className="border-b border-border bg-card">
          <div className="flex h-16 items-center px-8">
            <h1 className="text-xl font-semibold text-foreground">
              Sistema de Gerenciamento Hospitalar
            </h1>
          </div>
        </div>
        
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
