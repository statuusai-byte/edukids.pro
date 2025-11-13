import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { usePremium } from "@/context/PremiumContext";

const DEFAULT_EMAIL = "eduki.teste@gmail.com";
const DEFAULT_PASSWORD = "12121212";

export default function TestAccount() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const navigate = useNavigate();
  const { startTrial } = usePremium();

  const handleCreateAndLogin = async () => {
    setLoading(true);
    const loadingToast = showLoading("Processando conta de teste...");
    try {
      // 1) Try to sign in (if user already exists)
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign-in failed, attempt sign up
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        // If sign up also failed (and not because user exists), show error
        if (signUpError && !/already registered/i.test(signUpError.message)) {
          throw signUpError;
        }

        // Try to sign in again after sign up attempt
        const { error: signInAfterSignUpError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInAfterSignUpError) {
          throw signInAfterSignUpError;
        }
      }

      // If authentication succeeded, start trial in DB
      const trialSuccess = await startTrial();
      if (!trialSuccess) {
        // This can happen if user already has premium/trial
        showError("Não foi possível iniciar o teste. A conta já pode ser Premium.");
      }

      dismissToast(loadingToast);
      showSuccess("Conta de teste pronta com Teste Premium ativado. Você será redirecionado(a).");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (error: any) {
      dismissToast(loadingToast);
      console.error("Test account flow error:", error);
      showError(`Falha na autenticação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTrial = async () => {
    const loadingToast = showLoading("Ativando teste...");
    try {
      const success = await startTrial();
      dismissToast(loadingToast);
      if (success) {
        showSuccess("Teste Premium ativado para o usuário atual.");
        navigate("/dashboard", { replace: true });
      } else {
        showError("Não foi possível ativar o teste. Você precisa estar logado ou já pode ser Premium.");
      }
    } catch (e) {
      dismissToast(loadingToast);
      showError("Falha ao ativar o teste.");
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
            Use os dados pré-preenchidos para criar ou entrar em uma conta de teste.
            A conta receberá um Teste Premium de 7 dias.
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
              {loading ? "Processando..." : "Criar / Entrar e Ativar Teste Premium"}
            </Button>

            <Button onClick={handleActivateTrial} className="bg-yellow-400 text-black">
              Ativar Teste (para usuário logado)
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            <div>Nota: A ativação do premium aqui tenta atualizar o banco de dados.</div>
            <div className="mt-2">Se quiser, você pode ajustar as credenciais antes de pressionar o botão.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}