import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";

const DEFAULT_EMAIL = "eduki.teste@gmail.com";
const DEFAULT_PASSWORD = "12121212";
const PREMIUM_LOCAL_FLAG = "edukids_is_premium";

export default function TestAccount() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const navigate = useNavigate();
  const { user, syncPremiumFromProfile } = useSupabase();

  // Helper para definir o status premium local
  const seedLocalPremium = async () => {
    try {
      localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
      const profile = {
        name: "Test User",
        avatarUrl: "https://i.pravatar.cc/150?u=test-user-edukids",
        email,
      };
      localStorage.setItem("edukids_profile", JSON.stringify(profile));
      const allPackages = [
        "matematica", "portugues", "ciencias", "historia", "geografia", "ingles",
      ];
      localStorage.setItem("edukids_help_packages", JSON.stringify(allPackages));
    } catch (e) {
      console.error("Falha ao semear premium local:", e);
      throw e;
    }
  };

  // Limpa o status premium local ao desmontar o componente para garantir um estado limpo para testes
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem(PREMIUM_LOCAL_FLAG);
        localStorage.removeItem("edukids_profile");
        localStorage.removeItem("edukids_help_packages");
      } catch (e) {
        console.error("Falha ao limpar dados de teste locais ao desmontar:", e);
      }
    };
  }, []);

  const handleCreateAndLogin = async () => {
    setLoading(true);
    const loadingToast = showLoading("Processando conta de teste...");
    let authenticatedUser = user;

    try {
      // 1) Garante que o usuário esteja autenticado com o Supabase
      if (!authenticatedUser) {
        let authResult = await supabase.auth.signInWithPassword({ email, password });

        if (authResult.error) {
          // Se o login falhou, tenta o registro
          const signUpResult = await supabase.auth.signUp({ email, password });

          if (signUpResult.error && !/already registered/i.test(signUpResult.error.message)) {
            console.warn("O registro retornou um erro; tentando prosseguir:", signUpResult.error.message);
          }
          // Após a tentativa de registro, tenta fazer login novamente para obter a sessão
          authResult = await supabase.auth.signInWithPassword({ email, password });
        }

        if (authResult.error || !authResult.data.user) {
          // Se a autenticação ainda falhou, fallback para premium local
          dismissToast(loadingToast);
          await seedLocalPremium();
          showSuccess("Autenticação online falhou; Premium ativado localmente para testes.");
          navigate("/dashboard", { replace: true });
          setLoading(false);
          return;
        }
        authenticatedUser = authResult.data.user;
      }

      // 2) Usuário autenticado, agora concede premium via função Edge
      const invokeOptions: any = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      };

      const { data: _grantData, error: grantError } = await supabase.functions.invoke("grant-premium", invokeOptions);

      if (grantError) {
        console.error("Erro na função de concessão de premium:", grantError);
        // Se a concessão de premium via função falhar, fallback para premium local
        dismissToast(loadingToast);
        await seedLocalPremium();
        showError("Falha ao conceder Premium via sistema; Premium ativado localmente para testes.");
        navigate("/dashboard", { replace: true });
        setLoading(false);
        return;
      }

      // 3) Sincroniza explicitamente o status premium do perfil após a concessão
      // Isso garante que o estado local seja atualizado imediatamente após o banco de dados.
      await syncPremiumFromProfile(authenticatedUser.id);

      dismissToast(loadingToast);
      showSuccess("Conta de teste pronta com Premium ativado. Você será redirecionado(a).");

      // Pequeno atraso para o toaster aparecer e o contexto ser atualizado
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);

    } catch (error: any) {
      dismissToast(loadingToast);
      console.error("Erro no fluxo da conta de teste:", error);
      // Fallback automático em qualquer erro inesperado
      try {
        await seedLocalPremium();
        showError("Ocorreu um erro, mas Premium foi ativado localmente para permitir testes.");
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
              // helper: limpar estado local de teste
              try {
                localStorage.removeItem(PREMIUM_LOCAL_FLAG);
                localStorage.removeItem("edukids_profile");
                localStorage.removeItem("edukids_help_packages");
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