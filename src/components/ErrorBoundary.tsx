import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  private redirectTimer: number | null = null;

  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _info: any) {
    // Aqui poderíamos reportar o erro para um serviço externo
    console.error("ErrorBoundary caught:", error, _info);

    // Em ambientes de produção, iniciamos um redirecionamento automático
    // para a tela inicial após alguns segundos, evitando que o usuário
    // fique preso numa tela de erro que exige ação manual.
    try {
      // import.meta.env is available in Vite; em dev deixamos o comportamento para debugging
      const isDev = (import.meta as any).env?.MODE === "development";
      if (!isDev) {
        this.redirectTimer = window.setTimeout(() => {
          // Use location replace para não poluir o histórico
          window.location.href = "/";
        }, 2500);
      }
    } catch (e) {
      // Se import.meta não estiver disponível por algum motivo, não vamos bloquear a experiência
      console.warn("Could not determine environment mode for ErrorBoundary redirect:", e);
    }
  }

  componentWillUnmount() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
  }

  handleReload = () => {
    // Reinicia a aplicação para tentar recuperar do erro
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const isDev = (import.meta as any).env?.MODE === "development";

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-400">Ocorreu um erro</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Algo deu errado ao carregar esta página. Você pode tentar recarregar a página ou voltar para o início.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:brightness-95"
              >
                Voltar para a Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-secondary text-foreground px-4 py-2 rounded-md shadow hover:brightness-95"
              >
                Recarregar
              </button>
            </div>

            {!isDev && (
              <div className="mt-4 text-sm text-muted-foreground">
                Você será redirecionado para a tela inicial em alguns segundos.
              </div>
            )}

            {this.state.error && isDev && (
              <details className="mt-6 text-xs text-muted-foreground text-left break-words">
                <summary className="cursor-pointer">Detalhes do erro (para depuração)</summary>
                <pre className="whitespace-pre-wrap mt-2">{String(this.state.error.stack || this.state.error.message)}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;