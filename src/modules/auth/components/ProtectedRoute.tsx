/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, profile, loading } = useAuth();
    // Use location to redirect back after login
    // const location = useLocation(); // Need to import useLocation if used

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-neo-bg text-neo-text">Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
        // Redirect to unauthorized page or home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
