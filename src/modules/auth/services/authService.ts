/**
 * Authentication Service - Multi-Tenant Firebase Auth Integration
 */

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User,
    UserCredential,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../../shared/lib/firebase';
import {
    UserProfile,
    UserRole,
    UserPermissions,
    Organization,
    DEFAULT_EMPLOYEE_PERMISSIONS,
    OWNER_PERMISSIONS
} from '../../../shared/types/types';

// Re-export types for convenience
export type { UserProfile, UserRole, UserPermissions };

// Create organization and owner profile
async function createOrganizationWithOwner(
    user: User,
    businessName: string
): Promise<{ org: Organization; profile: UserProfile }> {
    const orgRef = doc(collection(db, 'organizations'));
    const slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const organization: Organization = {
        id: orgRef.id,
        name: businessName,
        slug,
        ownerId: user.uid,
        createdAt: new Date(),
        settings: {}
    };

    await setDoc(orgRef, {
        ...organization,
        createdAt: serverTimestamp()
    });

    const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        orgId: orgRef.id,
        role: 'owner',
        permissions: OWNER_PERMISSIONS,
        createdAt: new Date(),
        lastLogin: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
    });

    return { org: organization, profile };
}

// Create or update user profile in Firestore
async function createUserProfile(
    user: User,
    role: UserRole = 'client',
    orgId?: string,
    permissions?: UserPermissions
): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const profile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName,
            photoURL: user.photoURL,
            orgId: orgId || '',
            role: role,
            permissions: permissions || (role === 'owner' ? OWNER_PERMISSIONS : DEFAULT_EMPLOYEE_PERMISSIONS),
            createdAt: new Date(),
            lastLogin: new Date()
        };

        await setDoc(userRef, {
            ...profile,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });

        return profile;
    } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        return { uid: user.uid, ...userSnap.data() } as UserProfile;
    }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return { uid: userSnap.id, ...userSnap.data() } as UserProfile;
    }
    return null;
}

// Check if user is owner or has specific permission
export async function checkUserPermission(
    uid: string,
    permission: keyof UserPermissions
): Promise<boolean> {
    const profile = await getUserProfile(uid);
    if (!profile) return false;
    if (profile.role === 'owner') return true;
    return profile.permissions?.[permission] ?? false;
}

// Check if user is owner
export function isOwner(profile: UserProfile | null): boolean {
    return profile?.role === 'owner';
}

// Sign in with email and password
export async function signInWithEmail(
    email: string,
    password: string
): Promise<{ user: User; profile: UserProfile; isAdmin: boolean }> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await createUserProfile(userCredential.user);
    const isAdmin = profile.role === 'owner' || profile.role === 'employee';
    return { user: userCredential.user, profile, isAdmin };
}

// Register new business (Owner Onboarding)
export async function registerBusiness(
    email: string,
    password: string,
    businessName: string,
    ownerName: string
): Promise<{ user: User; org: Organization; profile: UserProfile }> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(userCredential.user, { displayName: ownerName });

    // Create organization and owner profile
    const { org, profile } = await createOrganizationWithOwner(userCredential.user, businessName);

    return { user: userCredential.user, org, profile };
}

// Create new client account
export async function createClientAccount(
    email: string,
    password: string
): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user, 'client');
    return userCredential;
}

// Add employee to organization
export async function addEmployee(
    email: string,
    password: string,
    orgId: string,
    name: string,
    specialty?: string,
    commissionRate?: number
): Promise<UserProfile> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, { displayName: name });

    const profile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: name,
        photoURL: null,
        orgId: orgId,
        role: 'employee',
        permissions: DEFAULT_EMPLOYEE_PERMISSIONS,
        specialty: specialty,
        commissionRate: commissionRate,
        createdAt: new Date(),
        lastLogin: new Date()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
    });

    return profile;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<{ user: User; profile: UserProfile; isAdmin: boolean }> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const profile = await createUserProfile(userCredential.user);
    const isAdmin = profile.role === 'owner' || profile.role === 'employee';
    return { user: userCredential.user, profile, isAdmin };
}

// Sign out
export async function signOutUser(): Promise<void> {
    await signOut(auth);
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
}

// Auth state observer
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

