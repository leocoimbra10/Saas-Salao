/**
 * Auth Context
 * Manages user authentication state and role-based access
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseInitialized } from '../../../shared/lib/firebase';
import { getUserProfile } from '../services/authService'; // Keep for other usages if any
import { UserProfile, OWNER_PERMISSIONS } from '../../../shared/types/types';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
    isOwner: boolean;
    loginAsTestUser: (role: 'client' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    error: null,
    isAdmin: false,
    isOwner: false,
    loginAsTestUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMocking, setIsMocking] = useState(false);

    // Internal state to manage subscriptions
    const [currentState, setCurrentState] = useState<{ profileUnsubscribe: (() => void) | null }>({
        profileUnsubscribe: null
    });

    useEffect(() => {
        // console.log("AuthProvider: useEffect triggered, subcribing to auth state change...");

        if (!isFirebaseInitialized) {
            console.warn("AuthProvider: Firebase not initialized. Skipping auth check.");
            setError("Firebase não inicializado.");
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

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (isMocking) return;

            // Unsubscribe from previous profile listener if exists
            if (currentState.profileUnsubscribe) {
                currentState.profileUnsubscribe();
            }

            if (firebaseUser) {
                setUser(firebaseUser);

                // Real-time listener for profile changes
                const userRef = doc(db, 'users', firebaseUser.uid);
                const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
                        setLoading(false); // Valid profile loaded
                    } else {
                        console.warn("AuthContext: User authenticated but no profile found (yet).");
                        setProfile(null);
                        // If it's a new user, we might still be loading until the profile is created
                        // However, we set loading false to allow the UI to decide (e.g. show "Complete Registration")
                        setLoading(false);
                    }
                }, (err) => {
                    console.error("AuthContext: Profile sync error", err);
                    setError("Erro ao sincronizar perfil do usuário.");
                    setLoading(false);
                });

                // Store unsubscribe function to clean up later
                setCurrentState(prev => ({ ...prev, profileUnsubscribe: unsubscribeProfile }));

            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (currentState.profileUnsubscribe) currentState.profileUnsubscribe();
            clearTimeout(timeoutId);
        };
    }, [isMocking]);

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
        error,
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
