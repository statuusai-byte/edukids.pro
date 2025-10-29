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

  componentDidCatch(error: Error, _info: any) {
    // Aqui poderíamos reportar o erro para um serviço externo
    console.error("ErrorBoundary caught:", error, _info);
  }

  handleReload = () => {
    // Reinicia a aplicação para tentar recuperar do erro
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
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
            {this.state.error && (
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