"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PREMIUM_LOCAL_FLAG = "edukids_is_premium";

export default function AdminGrantPremium() {
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
    } catch (e) {
      console.error("Failed to seed local premium:", e);
      throw e;
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card p-6">
        <CardHeader>
          <CardTitle>Administração: Conceder Premium</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use esta ferramenta para criar um usuário (se necessário) e conceder o status Premium.
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
              {loading ? "Processando..." : "Criar/Entrar e Conceder Premium"}
            </Button>
            <Button variant="outline" onClick={() => handleGrantPremium(false)} disabled={loading}>
              {loading ? "Concedendo..." : "Conceder Premium (Usuário Existente)"}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-3 rounded-md text-sm ${result.startsWith("Erro") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {result}
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-2">
            <p>Nota: A função `grant-premium` do Supabase Edge Function é invocada para atualizar o perfil do usuário no banco de dados.</p>
            <p className="mt-1">O status Premium também é salvo localmente para testes imediatos.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}