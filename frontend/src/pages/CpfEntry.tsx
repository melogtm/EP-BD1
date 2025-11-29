import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pacienteService } from "@/services/pacienteService";
import { funcionarioSaudeService } from "@/services/funcionarioService";
import { toast } from "sonner";

interface CpfEntryProps {
  role: "paciente" | "medico";
}

export default function CpfEntry({ role }: CpfEntryProps) {
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Busca paciente ou médico no backend
  const checkUserExists = async (cleanedCpf: string) => {
    try {
      if (role === "paciente") {
        const paciente = await pacienteService.getById(cleanedCpf);
        return { exists: true, data: paciente, type: "paciente" as const };
      } else {
        const medico = await funcionarioSaudeService.getById(cleanedCpf);
        return { exists: true, data: medico, type: "medico" as const };
      }
    } catch (error) {
      return { exists: false, data: null, type: role };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedCpf = cpf.replace(/\D/g, "");

    setIsLoading(true);

    try {
      const result = await checkUserExists(cleanedCpf);

      if (result.exists) {
        // ✅ Usuário encontrado - armazena e redireciona
        localStorage.setItem("userCpf", cleanedCpf);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userData", JSON.stringify(result.data));

        toast.success(
          `Bem-vindo(a), ${role === "paciente" ? "Paciente" : "Dr(a)."}!`
        );
        navigate(`/${role}`);
      } else {
        toast.error("CPF não encontrado no sistema.");
      }
    } catch (error) {
      toast.error("Erro ao verificar CPF. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card border rounded-xl shadow-xl">
      <div className="text-center mb-8">
        <div
          className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 border-4 ${
            role === "paciente"
              ? "bg-blue-500/10 border-blue-500/40 text-blue-600"
              : "bg-green-500/10 border-green-500/40 text-green-600"
          }`}
        >
          <span className="text-3xl">{role === "paciente" ? "👤" : "👨‍⚕️"}</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {role === "paciente" ? "Acesso Paciente" : "Acesso Médico"}
        </h2>
        <p className="text-muted-foreground text-lg">
          Digite seu CPF para acessar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-semibold text-foreground mb-3"
          >
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled={isLoading}
            className="w-full px-4 py-4 rounded-xl border-2 border-input bg-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-all text-lg font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-75 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verificando...
            </>
          ) : (
            "Acessar Dashboard →"
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Demo - dados reais do backend
      </p>
    </div>
  );
}
