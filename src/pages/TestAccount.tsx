import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const DEFAULT_EMAIL = "eduki.teste@gmail.com";
const DEFAULT_PASSWORD = "12121212";
const PREMIUM_LOCAL_FLAG = "edukids_is_premium";

export default function TestAccount() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const navigate = useNavigate();

  const seedLocalPremium = async () => {
    try {
      localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
      // mark profile
      const profile = {
        name: "Test User",
        avatarUrl: "https://i.pravatar.cc/150?u=test-user-edukids",
        email,
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
      // Dispara um evento para que o hook usePremium reaja à mudança
      window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_LOCAL_FLAG, newValue: 'true' }));
    } catch (e) {
      console.error("Failed to seed local premium:", e);
      throw e;
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
        // If sign-in failed, attempt sign up
        const signUp = await supabase.auth.signUp({
          email,
          password,
        });

        // If signUp produced an error that is not "already registered", continue to fallback
        if (signUp.error && signUp.error.message && !/already registered/i.test(signUp.error.message)) {
          // We'll fallback to local premium immediately below
          console.warn("Sign up returned an error; continuing to local fallback:", signUp.error.message);
        }

        // Try sign in after sign up attempt
        const signIn2 = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signIn2.error) {
          // Authentication still failed — automatically fallback to local premium
          dismissToast(loadingToast);
          await seedLocalPremium();
          showSuccess("Autenticação online falhou; Premium ativado localmente para testes.");
          navigate("/dashboard", { replace: true });
          setLoading(false);
          return;
        }

        // signIn2 succeeded -> proceed further
      }

      // If initial signIn succeeded or signIn2 succeeded, seed local premium/profile for immediate access
      await seedLocalPremium();

      dismissToast(loadingToast);
      showSuccess("Conta de teste pronta com Premium ativado. Você será redirecionado(a).");

      // small delay to let the toaster show
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (error: any) {
      dismissToast(loadingToast);
      console.error("Test account flow error:", error);
      // Automatic fallback on any unexpected error
      try {
        await seedLocalPremium();
        showSuccess("Ocorreu um erro, mas Premium foi ativado localmente para permitir testes.");
        navigate("/dashboard", { replace: true });
      } catch (e) {
        showError("Falha ao ativar Premium localmente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActivateLocalOnly = async () => {
    try {
      await seedLocalPremium();
      showSuccess("Premium ativado localmente para este dispositivo.");
      // Redirect to dashboard so user can check premium areas
      navigate("/dashboard", { replace: true });
    } catch (e) {
      showError("Falha ao ativar Premium localmente.");
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
            Os campos estão pré-preenchidos com o email solicitado. Se a autenticação online falhar,
            o aplicativo fará automaticamente um fallback e ativará uma conta Premium local para testes.
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
                window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_LOCAL_FLAG, newValue: 'false' }));
                showSuccess("Dados locais de teste removidos.");
              } catch (e) {
                showError("Falha ao limpar dados locais.");
              }
            }}>
              Limpar estado local de teste
            </Button>

            <Button onClick={handleActivateLocalOnly} className="bg-yellow-400 text-black">
              Ativar Premium localmente (sem login)
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