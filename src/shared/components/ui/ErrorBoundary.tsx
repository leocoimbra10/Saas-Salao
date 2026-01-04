import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NeoCard, Typography, NeoButton } from './NeoComponents';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
                    <NeoCard className="max-w-md w-full p-8 text-center border-l-4 border-neo-danger" variant="raised">
                        <div className="w-16 h-16 bg-neo-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-neo-danger" />
                        </div>

                        <Typography variant="h3" className="text-neo-text font-bold mb-2">
                            Oops! Algo deu errado.
                        </Typography>

                        <Typography variant="body" className="text-neo-text-secondary mb-6">
                            Encontramos um erro inesperado. Tente recarregar a página.
                        </Typography>

                        {this.state.error && (
                            <div className="bg-neo-bg rounded-neo-sm p-3 mb-6 text-left overflow-auto max-h-32">
                                <Typography variant="caption" className="font-mono text-neo-danger break-all">
                                    {this.state.error.message}
                                </Typography>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <NeoButton
                                variant="gradient"
                                onClick={() => window.location.reload()}
                                icon={<RefreshCw size={18} />}
                            >
                                Recarregar Página
                            </NeoButton>

                            <NeoButton
                                variant="ghost"
                                onClick={() => window.location.href = '/'}
                                icon={<Home size={18} />}
                            >
                                Voltar ao Início
                            </NeoButton>
                        </div>
                    </NeoCard>
                </div>
            );
        }

        return this.props.children;
    }
}
