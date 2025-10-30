"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";

const PREMIUM_LOCAL_FLAG = "edukids_is_premium";
const ADMIN_EMAIL = "eduki.teste@gmail.com";

export default function AdminGrantPremium() {
  const { user, isLoading: authLoading } = useSupabase();
  const [email, setEmail] = useState("eduki.teste@gmail.com");
  const [password, setPassword] = useState("12121212");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const seedLocalPremium = async () => {
    try {
      localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
      // Mark profile locally for immediate access
      const profile = {
        name: "Admin Test User",
        avatarUrl: "https://i.pravatar.cc/150?u=admin-test-edukids",
        email,
      };
      localStorage.setItem("edukids_profile", JSON.stringify(profile));
      // Give all help packages (so testers can see content)
      const allPackages = [
        "matematica", "portugues", "ciencias", "historia", "geografia", "ingles",
      ];
      localStorage.setItem("edukids_help_packages", JSON.stringify(allPackages));
      return true; // Indicate success
    } catch (e) {
      console.error("Failed to seed local premium:", e);
      showError("Falha ao ativar Premium localmente.");
      return false; // Indicate failure
    }
  };

  const handleGrantPremium = async (createIfMissing: boolean) => {
    setLoading(true);
    setResult(null);
    const toastId = showLoading("Processando...");
    try {
      if (createIfMissing) {
        // Try to sign up the user; if already exists, ignore the error and continue.
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError && !/already registered/i.test(signUpError.message)) {
          console.warn("Sign up returned an error; continuing to try granting premium:", signUpError.message);
        }
      }

      // Invoke the server function grant-premium (should use service role internally)
      const invokeOptions: any = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      };

      const { data, error } = await supabase.functions.invoke("grant-premium", invokeOptions);

      dismissToast(toastId);

      if (error) {
        console.error("Grant premium function error:", error);
        showError("Falha ao conceder Premium: " + (error.message || String(error)));
        setResult("Erro: " + (error.message || JSON.stringify(error)));
        setLoading(false);
        return;
      }

      // If successful, also update local storage for immediate client-side effect
      await seedLocalPremium();

      showSuccess("Premium concedido e ativado localmente para " + email);
      setResult("Sucesso! Premium concedido para o usuário: " + email);
      
      // Redirect to dashboard after a short delay
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

  const handleActivateLocalOnly = async () => {
    setLoading(true);
    setResult(null);
    const toastId = showLoading("Ativando Premium localmente...");
    const success = await seedLocalPremium();
    dismissToast(toastId);
    if (success) {
      showSuccess("Premium ativado localmente para este dispositivo.");
      setResult("Sucesso! Premium ativado localmente.");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } else {
      setResult("Erro: Falha ao ativar Premium localmente.");
    }
    setLoading(false);
  };

  // Auth guard: only allow access to the admin email
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6">
          <div className="text-center">Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card p-6 text-center">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Esta página é somente para administração. Faça login com a conta administrativa para acessar.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate("/login")}>Ir para Login</Button>
              <Button variant="outline" onClick={() => navigate("/", { replace: true })}>Voltar para Home</Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Conta exigida: <strong>{ADMIN_EMAIL}</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we reach here, user is authenticated and is the admin
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card p-6">
        <CardHeader>
          <CardTitle>Administração: Conceder Premium</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use esta ferramenta para criar um usuário (se necessário) e conceder o status Premium no sistema.
            Isso também ativará o Premium localmente para este dispositivo.
          </p>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Email do Usuário</label>
            <Input
              className="w-full p-2 rounded-md bg-secondary/30 border border-white/6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <div className="text-center text-xs text-muted-foreground">
              Ou, para testes rápidos:
            </div>
            <Button onClick={handleActivateLocalOnly} disabled={loading} className="bg-yellow-400 text-black">
              {loading ? "Ativando..." : "Ativar Premium Localmente (Apenas Neste Dispositivo)"}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-3 rounded-md text-sm ${result.startsWith("Erro") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {result}
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p>Nota: As opções "Sistema" invocam a função <code>grant-premium</code> do Supabase Edge Function para atualizar o perfil do usuário no banco de dados e também salvam o status Premium localmente.</p>
            <p className="mt-1">A opção "Localmente" apenas salva o status Premium no armazenamento do seu navegador, ideal para testes rápidos sem afetar o backend.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}