import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const TEST_EMAIL = "tester+premium@edukids.test";
const TEST_PASSWORD = "Test1234!";

export default function TestAccount() {
  const [loading, setLoading] = useState(false);
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
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      if (signIn.error) {
        // If sign-in failed due to not existing, attempt sign up
        const signUp = await supabase.auth.signUp({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        });

        if (signUp.error && signUp.error.message && !/already registered/i.test(signUp.error.message)) {
          dismissToast(loadingToast);
          showError("Falha ao criar usuário: " + signUp.error.message);
          setLoading(false);
          return;
        }

        // After signUp, try sign in again
        const signIn2 = await supabase.auth.signInWithPassword({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        });

        if (signIn2.error) {
          dismissToast(loadingToast);
          showError("Falha ao autenticar usuário de teste: " + signIn2.error.message);
          setLoading(false);
          return;
        }

        // success
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
          <CardTitle>Conta de Teste (Ambiente de QA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use esta conta para testes manuais. O botão abaixo criará/entrará com um usuário fictício e ativará o Premium localmente (armazenamento local),
            além de marcar pacotes de ajuda como comprados para facilitar a verificação de funcionalidades.
          </p>

          <div className="bg-secondary/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Credenciais (fictícias)</div>
            <div className="mt-2 font-mono">
              <div>Email: <span className="font-semibold">{TEST_EMAIL}</span></div>
              <div>Senha: <span className="font-semibold">{TEST_PASSWORD}</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleCreateAndLogin} disabled={loading} className="bg-primary">
              {loading ? "Processando..." : "Create & Login as Test User (Premium)"}
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

          <p className="text-xs text-muted-foreground mt-2">
            Nota: A ativação do premium aqui altera apenas o armazenamento local (útil para testes manuais). Para testar o fluxo real de assinatura, use a loja.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}