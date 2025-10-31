"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";

const ADMIN_EMAILS = ["statuus.ai@gmail.com", "eduki.teste@gmail.com"] as const;
const DEFAULT_ADMIN_EMAIL = ADMIN_EMAILS[0];
const PREMIUM_LOCAL_FLAG = "edukids_is_premium";

export default function AdminGrantPremium() {
  const { user, isLoading: authLoading } = useSupabase();
  // ensure the state is a general string (not a narrow literal type)
  const [email, setEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("12121212");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const allowedEmailsDescription = useMemo(() => ADMIN_EMAILS.join(", "), []);

  const seedLocalPremium = async () => {
    try {
      localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
      const profile = {
        name: "Administrador EDUKIDS+",
        avatarUrl: "https://i.pravatar.cc/150?u=admin-edukids",
        email,
      };
      localStorage.setItem("edukids_profile", JSON.stringify(profile));
      const allPackages = ["matematica", "portugues", "ciencias", "historia", "geografia", "ingles"];
      localStorage.setItem("edukids_help_packages", JSON.stringify(allPackages));
    } catch (e) {
      console.error("Failed to seed local premium:", e);
      showError("Falha ao ativar Premium localmente.");
    }
  };

  const handleGrantPremium = async (createIfMissing: boolean) => {
    setLoading(true);
    setResult(null);
    const toastId = showLoading("Processando...");
    try {
      if (createIfMissing) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError && !/already registered/i.test(signUpError.message)) {
          console.warn("Sign up returned an error; continuing to try granting premium:", signUpError.message);
        }
      }

      const invokeOptions: Record<string, unknown> = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      };

      const { error } = await supabase.functions.invoke("grant-premium", invokeOptions);

      dismissToast(toastId);

      if (error) {
        console.error("Grant premium function error:", error);
        showError("Falha ao conceder Premium: " + (error.message || String(error)));
        setResult("Erro: " + (error.message || JSON.stringify(error)));
        setLoading(false);
        return;
      }

      await seedLocalPremium();

      showSuccess("Premium concedido e ativado localmente para " + email);
      setResult("Sucesso! Premium concedido para o usuário: " + email);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (error: any) {
      dismissToast(toastId);
      console.error("Admin grant premium flow error:", error);
      showError("Ocorreu um erro inesperado: " + (error.message || String(error)));
      setResult("Erro inesperado: " + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const normalizedUserEmail = user?.email?.toLowerCase();
  const isAuthorized = normalizedUserEmail ? (ADMIN_EMAILS as readonly string[]).includes(normalizedUserEmail) : false;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6">
          <div className="text-center">Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card p-6 text-center">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Esta página é somente para administração da família. Faça login com uma conta autorizada para acessar.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate("/login")}>Ir para Login</Button>
              <Button variant="outline" onClick={() => navigate("/", { replace: true })}>Voltar para Home</Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Contas permitidas: <strong>{allowedEmailsDescription}</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card p-6">
        <CardHeader>
          <CardTitle>Administração: Conceder Premium</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use esta ferramenta para criar um usuário (se necessário) e conceder o status Premium no sistema.
            Isso também ativa o Premium localmente para este dispositivo.
          </p>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Email do Usuário</label>
            <Input
              className="w-full p-2 rounded-md bg-secondary/30 border border-white/6"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              type="email"
            />
            <label className="text-xs text-muted-foreground">Senha (para criação/login)</label>
            <Input
              className="w-full p-2 rounded-md bg-secondary/30 border border-white/6"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => handleGrantPremium(true)} disabled={loading} className="bg-primary">
              {loading ? "Processando..." : "Criar/Entrar e Conceder Premium (Sistema)"}
            </Button>
            <Button variant="outline" onClick={() => handleGrantPremium(false)} disabled={loading}>
              {loading ? "Concedendo..." : "Conceder Premium (Usuário Existente no Sistema)"}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-3 rounded-md text-sm ${result.startsWith("Erro") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {result}
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p>Esta ação invoca a função <code>grant-premium</code> do Supabase Edge Function para atualizar o perfil do usuário no banco de dados e também salva o status Premium localmente.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}