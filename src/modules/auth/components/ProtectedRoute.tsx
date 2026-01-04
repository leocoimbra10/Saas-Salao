/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Prevents navigation flicker and handles profile loading errors
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, NeoCard, Typography, EmptyState, NeoButton } from '../../../shared/components/ui/NeoComponents';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, profile, loading, error } = useAuth();
    const location = useLocation();

    // 1. Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neo-bg">
                <Spinner size="lg" />
                <Typography variant="caption" className="mt-4 animate-pulse">
                    Verificando acesso...
                </Typography>
            </div>
        );
    }

    // 2. Auth Context Error (e.g. Firebase init failed)
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-bg p-4">
                <NeoCard className="max-w-md w-full p-8 text-center border-l-4 border-neo-danger">
                    <EmptyState
                        icon={<AlertTriangle size={32} className="text-neo-danger" />}
                        title="Erro de Autenticação"
                        description={error}
                        action={
                            <NeoButton onClick={() => window.location.reload()} size="sm" variant="outline">
                                Tentar Novamente
                            </NeoButton>
                        }
                    />
                </NeoCard>
            </div>
        );
    }

    // 3. Not Authenticated -> Redirect to Login
    if (!user) {
        // Save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. Authenticated but Profile Check Failed (If roles are required)
    if (allowedRoles && !profile) {
        // This happens if getUserProfile failed or isn't ready, but loading is false
        // Could technically happen if user is created in Auth but not Firestore yet
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-bg p-4">
                <NeoCard className="max-w-md w-full p-8 text-center">
                    <Typography variant="h3" className="mb-2">Perfil Incompleto</Typography>
                    <Typography variant="body" className="mb-6">
                        Não foi possível carregar suas informações de perfil.
                    </Typography>
                    <NeoButton onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </NeoButton>
                </NeoCard>
            </div>
        );
    }

    // 5. Role Authorization Check
    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // User has profile but wrong role
        return <Navigate to="/" replace />;
    }

    // 6. Access Granted
    return <>{children}</>;
};
