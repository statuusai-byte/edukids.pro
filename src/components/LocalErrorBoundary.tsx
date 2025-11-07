import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface State {
  hasError: boolean;
  error?: Error | null;
}

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}

export class LocalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error for debugging
    console.error("LocalErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null }, () => {
      this.props.onReset?.();
    });
  };

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message ?? "Erro ao carregar este componente.";
      const stack = this.state.error?.stack ?? null;

      return (
        <Card className="glass-card p-4">
          <CardHeader className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <CardTitle>Falha ao carregar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div>Ocorreu um erro ao carregar este conteúdo: <strong>{message}</strong></div>
            {stack && (
              <details className="text-xs text-foreground bg-black/40 p-2 rounded-md">
                <summary>Mostrar detalhes técnicos</summary>
                <pre className="whitespace-pre-wrap text-xs mt-2">{String(stack)}</pre>
              </details>
            )}
            <div className="flex gap-2 mt-2">
              <Button onClick={this.handleRetry} className="bg-primary">
                <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Recarregar página
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default LocalErrorBoundary;