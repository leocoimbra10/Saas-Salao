/**
 * Auth Context
 * Manages user authentication state and role-based access
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseInitialized } from '../../../shared/lib/firebase';
import { getUserProfile } from '../services/authService';
import { UserProfile, OWNER_PERMISSIONS } from '../../../shared/types/types';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    isOwner: boolean;
    loginAsTestUser: (role: 'client' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
    isOwner: false,
    loginAsTestUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMocking, setIsMocking] = useState(false);

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

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("AuthProvider: onAuthStateChanged fired. User:", firebaseUser ? firebaseUser.uid : "null");

            // If we are mocking, ignore updates from real Firebase (unless it's a real login event, but usually it's just null)
            if (isMocking) {
                console.log("AuthProvider: Ignoring Firebase update because Mock Mode is active.");
                return;
            }

            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setProfile(null);
                }
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
            clearTimeout(timeoutId);
        });

        return () => {
            console.log("AuthProvider: unsubscribing...");
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [isMocking]); // Re-subscribe if mocking changes (though logically we just want the guard inside)

    const loginAsTestUser = (role: 'client' | 'admin') => {
        setIsMocking(true); // Enable mock mode
        const mockUid = role === 'admin' ? 'test-admin-uid' : 'test-client-uid';
        const mockRole = role === 'admin' ? 'owner' : 'client';

        const mockUser = {
            uid: mockUid,
            email: role === 'admin' ? 'admin@teste.com' : 'cliente@teste.com',
            displayName: role === 'admin' ? 'Administrador Teste' : 'Cliente Teste',
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => { },
            getIdToken: async () => 'mock-token',
            getIdTokenResult: async () => ({} as any),
            reload: async () => { },
            toJSON: () => ({}),
            phoneNumber: null,
            photoURL: null,
            providerId: 'custom',
        } as unknown as User;

        const mockPermissions = role === 'admin'
            ? OWNER_PERMISSIONS
            : {
                canViewGlobalAgenda: false,
                canManagePayments: false,
                canViewFinancialReports: false,
                canEditServices: false,
                canManageTeam: false,
                canViewClients: false,
                canManageAppointments: true
            };

        const mockProfile: UserProfile = {
            uid: mockUid,
            email: role === 'admin' ? 'admin@teste.com' : 'cliente@teste.com',
            displayName: role === 'admin' ? 'Administrador Teste' : 'Cliente Teste',
            role: mockRole,
            orgId: 'default',
            permissions: mockPermissions,
            createdAt: new Date(),
            lastLogin: new Date(),
            photoURL: '',
            stats: {
                totalAppointments: 0,
                totalSpent: 0,
                lastVisit: undefined
            }
        };

        setUser(mockUser);
        setProfile(mockProfile);
        setLoading(false);
    };

    const value = {
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'owner',
        isOwner: profile?.role === 'owner',
        loginAsTestUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
