/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-neo-bg text-neo-text">Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
