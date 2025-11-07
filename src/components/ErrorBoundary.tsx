import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Report the error to console (or external service)
    console.error("ErrorBoundary caught:", error, info);
    // NOTE: we intentionally DO NOT auto-redirect the user to the home page.
    // Automatic redirects hide the real error and make debugging on mobile difficult.
  }

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message ?? "Erro desconhecido";
      const stack = this.state.error?.stack ?? null;

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-400">Ocorreu um erro</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Algo deu errado ao carregar esta página. Você pode recarregar ou voltar para a tela inicial.
            </p>

            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={this.handleGoHome}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow hover:brightness-95"
              >
                Voltar para a Home
              </button>
              <button
                onClick={this.handleReload}
                className="bg-secondary text-foreground px-4 py-2 rounded-md shadow hover:brightness-95"
              >
                Recarregar
              </button>
            </div>

            <div className="mt-4 text-left">
              <div className="text-sm font-medium text-foreground mb-2">Resumo do erro</div>
              <div className="bg-black/60 p-3 rounded-md text-xs text-white break-words">
                <div><strong>Mensagem:</strong> {errorMessage}</div>
                {stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-muted-foreground">Mostrar stack trace</summary>
                    <pre className="whitespace-pre-wrap mt-2 text-xs">{String(stack)}</pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;