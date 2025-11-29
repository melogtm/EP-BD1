import { ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Activity,
  Home,
  Pill,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Building2,
  DoorOpen,
} from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Detecta o role da URL atual
  const getCurrentRole = () => {
    const path = location.pathname;
    if (path.startsWith("/paciente")) return "paciente";
    if (path.startsWith("/medico")) return "medico";
    if (path.startsWith("/admin")) return "admin";
    return "";
  };

  const currentRole = getCurrentRole();

  // Filtra navegação baseado no role
  const getNavigationItems = () => {
    const rolePrefix = `/${currentRole}`;
    const baseItems = [{ path: rolePrefix, label: "Dashboard", icon: Home }];

    if (currentRole === "admin") {
      return [
        ...baseItems,
        {
          path: `${rolePrefix}/diagnosticos`,
          label: "Diagnósticos",
          icon: Activity,
        },
        {
          path: `${rolePrefix}/medicamentos`,
          label: "Medicamentos",
          icon: Pill,
        },
        { path: `${rolePrefix}/pacientes`, label: "Pacientes", icon: Users },
        { path: `${rolePrefix}/consultas`, label: "Consultas", icon: Calendar },
        { path: `${rolePrefix}/exames`, label: "Exames", icon: FileText },
        {
          path: `${rolePrefix}/funcionarios`,
          label: "Funcionários",
          icon: Stethoscope,
        },
        { path: `${rolePrefix}/empresas`, label: "Empresas", icon: Building2 },
        { path: `${rolePrefix}/salas`, label: "Salas", icon: DoorOpen },
      ];
    }

    if (currentRole === "medico") {
      return [
        ...baseItems
      ];
    }

    if (currentRole === "paciente") {
      return [
        ...baseItems
      ];
    }

    // Para RoleSelector na home (/)
    return [{ path: "/", label: "Início", icon: Home }];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Activity className="h-6 w-6 text-sidebar-primary" />
          <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
            {currentRole
              ? `${
                  currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
                } - EP-BD1`
              : "EP-BD1 Hospital"}
          </span>
        </div>

        <nav className="space-y-1 p-4">
          {getNavigationItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
              {currentRole
                ? `Visão ${
                    currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
                  }`
                : "Seletor de Perfil"}
            </h1>
          </div>
        </div>

        <div className="p-8">{children || <Outlet />}</div>
      </main>
    </div>
  );
};
