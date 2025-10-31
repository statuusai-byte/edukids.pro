dot).">
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

/**
 * Helper to normalize an email string:
 * - trims spaces
 * - replaces a comma used in place of a dot in the local part (common typo from the user)
 */
function normalizeEmail(raw: string) {
  return raw.trim().replace(/\s+/g, "").replace(",", ".");
}

export default function AdminGrantPremium() {
  const { user, isLoading: authLoading } = useSupabase();
  const [email, setEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("12121212");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const allowedEmailsDescription = useMemo(() => (ADMIN_EMAILS as readonly string[]).join(", "), []);

  // Seed local premium/profile for a given email (used for immediate local testing)
  const seedLocalPremiumFor = async (targetEmail: string) => {
    try {
      localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
      const profile = {
        name: "Administrador EDUKIDS+",
        avatarUrl: "https://i.pravatar.cc/150?u=admin-edukids",
        email: targetEmail,
      };
      localStorage.setItem("edukids_profile", JSON.stringify(profile));
      const allPackages = ["matematica", "portugues", "ciencias", "historia", "geografia", "ingles"];
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
      const normalized = normalizeEmail(email);

      if (createIfMissing) {
        const { error: signUpError } = await supabase.auth.signUp({ email: normalized, password });
        if (signUpError && !/already registered/i.test(signUpError.message)) {
          console.warn("Sign up returned an error; continuing to try granting premium:", signUpError.message);
        }
      }

      const invokeOptions: Record<string, unknown> = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
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

      await seedLocalPremiumFor(normalized);

      showSuccess("Premium concedido e ativado localmente para " + normalized);
      setResult("Sucesso! Premium concedido para o usuário: " + normalized);

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

  // New: Grant premium for the predefined ADMIN_EMAILS in batch (normalizes commas -> dots)
  const handleGrantPremiumForAdmins = async () => {
    setLoading(true);
    setResult(null);
    const toastId = showLoading("Concedendo Premium para contas permitidas...");
    try {
      const results: string[] = [];

      for (const rawEmail of ADMIN_EMAILS) {
        const normalized = normalizeEmail(rawEmail);
        const invokeOptions: Record<string, unknown> = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalized }),
        };

        const { error } = await supabase.functions.invoke("grant-premium", invokeOptions);

        if (error) {
          results.push(`${normalized}: erro (${error.message || String(error)})`);
          console.error("Error granting premium for", normalized, error);
          // continue with others
        } else {
          // seed local so tests show premium immediately
          try {
            await seedLocalPremiumFor(normalized);
            results.push(`${normalized}: sucesso`);
          } catch (seedingError) {
            results.push(`${normalized}: sucesso (falha ao marcar localmente)`);
          }
        }
      }

      dismissToast(toastId);

      const anyErrors = results.some(r => r.includes("erro"));
      if (anyErrors) {
        showError("Algumas contas falharam ao receber Premium. Veja o resultado abaixo.");
      } else {
        showSuccess("Premium concedido para todas as contas permitidas.");
      }

      setResult(results.join("\n"));
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 700);
    } catch (err: any) {
      dismissToast(toastId);
      console.error("Batch grant error:", err);
      showError("Erro ao processar a operação em lote.");
      setResult("Erro inesperado: " + (err?.message || String(err)));
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
              <Button onClick={() => window.location.href = "/login"}>Ir para Login</Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>Voltar para Home</Button>
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

            <hr className="my-2 border-white/6" />

            {/* New batch button for the allowed admin emails */}
            <Button onClick={handleGrantPremiumForAdmins} disabled={loading} className="bg-yellow-400 text-black">
              {loading ? "Concedendo para listas..." : "Conceder Premium para contas permitidas"}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-3 rounded-md text-sm ${result.includes("erro") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              <pre className="whitespace-pre-wrap text-xs">{result}</pre>
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p>Esta ação invoca a função <code>grant-premium</code> do Supabase Edge Function para atualizar o perfil do usuário no banco de dados e também salva o status Premium localmente.</p>
            <p className="mt-1">Obs: endereços com vírgula serão normalizados para usar ponto (ex.: <code>statuus,ai@gmail.com</code> → <code>statuus.ai@gmail.com</code>).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}