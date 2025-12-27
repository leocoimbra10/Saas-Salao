/**
 * Auth Context
 * Manages user authentication state
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseInitialized } from '@/shared/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider: useEffect triggered, subcribing to auth state change...");

        if (!isFirebaseInitialized) {
            console.warn("AuthProvider: Firebase not initialized. Skipping auth check.");
            setLoading(false);
            return;
        }

        // Safeguard: If Firebase hangs, don't keep the app blank forever
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("AuthProvider: Auth state detection timed out after 5s. Rendering app anyway.");
                setLoading(false);
            }
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("AuthProvider: onAuthStateChanged fired. User:", user ? user.uid : "null");
            setUser(user);
            setLoading(false);
            clearTimeout(timeoutId);
        });

        return () => {
            console.log("AuthProvider: unsubscribing...");
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
