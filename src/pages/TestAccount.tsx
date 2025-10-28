import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const DEFAULT_EMAIL = "ekteste.@edukids.test";
const DEFAULT_PASSWORD = "12121212";

export default function TestAccount() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const navigate = useNavigate();

  const seedLocalPremium = async () => {
    try {
      localStorage.setItem("edukids_is_premium", "true");
      // mark profile
      const profile = {
        name: "Test User",
        avatarUrl: "https://i.pravatar.cc/150?u=test-user-edukids",
      };
      localStorage.setItem("edukids_profile", JSON.stringify(profile));
      // give all help packages (so testers can see content)
      const allPackages = [
        "matematica",
        "portugues",
        "ciencias",
        "historia",
        "geografia",
        "ingles",
      ];
      localStorage.setItem("edukids_help_packages", JSON.stringify(allPackages));
    } catch (e) {
      console.error("Failed to seed local premium:", e);
    }
  };

  const handleCreateAndLogin = async () => {
    setLoading(true);
    const loadingToast = showLoading("Processando conta de teste...");
    try {
      // 1) Try to sign in (if user already exists)
      const signIn = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signIn.error) {
        // If sign-in failed due to not existing, attempt sign up
        const signUp = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUp.error && signUp.error.message && !/already registered/i.test(signUp.error.message)) {
          dismissToast(loadingToast);
          showError("Falha ao criar usuário: " + signUp.error.message);
          setLoading(false);
          return;
        }

        // After signUp, try sign in again
        const signIn2 = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signIn2.error) {
          dismissToast(loadingToast);
          showError("Falha ao autenticar usuário de teste: " + signIn2.error.message);
          setLoading(false);
          return;
        }

        // success
      } else {
        // signIn succeeded; nothing further needed
      }

      // If initial signIn succeeded or signIn2 succeeded
      // seed local premium and profile
      await seedLocalPremium();

      dismissToast(loadingToast);
      showSuccess("Conta de teste pronta com Premium ativado. Você será redirecionado(a).");
      // small delay to let the toaster show
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } catch (error: any) {
      dismissToast(loadingToast);
      console.error("Test account flow error:", error);
      showError("Erro ao criar/entrar conta de teste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card p-6">
        <CardHeader>
          <CardTitle>Conta de Teste (Ativar Premium)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Informe as credenciais do usuário que você deseja ativar com Premium. As credenciais fornecidas foram pré-preenchidas.
            Ao criar/entrar com o usuário, o Premium será ativado localmente neste dispositivo (armazenamento local).
          </p>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              className="w-full p-2 rounded-md bg-secondary/30 border border-white/6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-xs text-muted-foreground">Senha</label>
            <input
              className="w-full p-2 rounded-md bg-secondary/30 border border-white/6"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleCreateAndLogin} disabled={loading} className="bg-primary">
              {loading ? "Processando..." : "Criar / Entrar e Ativar Premium"}
            </Button>

            <Button variant="outline" onClick={() => {
              // helper: clear test local state
              try {
                localStorage.removeItem("edukids_is_premium");
                localStorage.removeItem("edukids_profile");
                localStorage.removeItem("edukids_help_packages");
                showSuccess("Dados locais de teste removidos.");
              } catch (e) {
                showError("Falha ao limpar dados locais.");
              }
            }}>
              Limpar estado local de teste
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            <div>Nota: A ativação do premium aqui altera apenas o armazenamento local (útil para testes manuais).</div>
            <div className="mt-2">Se quiser, você pode ajustar as credenciais antes de pressionar o botão.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}