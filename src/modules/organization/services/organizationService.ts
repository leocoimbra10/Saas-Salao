/**
 * Organization Service - Multi-Tenant Management
 */

import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../../shared/lib/firebase';
import { Organization, UserProfile, UserPermissions } from '../../../shared/types/types';

// Create new organization
export async function createOrganization(
    name: string,
    ownerId: string
): Promise<Organization> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const orgRef = doc(collection(db, 'organizations'));

    const organization: Organization = {
        id: orgRef.id,
        name,
        slug,
        ownerId,
        createdAt: new Date(),
        settings: {}
    };

    await setDoc(orgRef, {
        ...organization,
        createdAt: serverTimestamp()
    });

    return organization;
}

// Get organization by ID
export async function getOrganization(orgId: string): Promise<Organization | null> {
    const orgRef = doc(db, 'organizations', orgId);
    const orgSnap = await getDoc(orgRef);

    if (orgSnap.exists()) {
        return { id: orgSnap.id, ...orgSnap.data() } as Organization;
    }
    return null;
}

// Update organization settings
export async function updateOrganization(
    orgId: string,
    updates: Partial<Organization>
): Promise<void> {
    const orgRef = doc(db, 'organizations', orgId);
    await updateDoc(orgRef, updates);
}

// Get all employees for an organization
export async function getOrgEmployees(orgId: string): Promise<UserProfile[]> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('orgId', '==', orgId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    })) as UserProfile[];
}

// Real-time listener for employees
export function subscribeToOrgEmployees(
    orgId: string,
    callback: (employees: UserProfile[]) => void
): () => void {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('orgId', '==', orgId));

    return onSnapshot(q, (snapshot) => {
        const employees = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        })) as UserProfile[];
        callback(employees);
    });
}

// Update user permissions
export async function updateUserPermissions(
    userId: string,
    permissions: Partial<UserPermissions>
): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error('User not found');
    }

    const currentPermissions = userSnap.data().permissions || {};
    await updateDoc(userRef, {
        permissions: { ...currentPermissions, ...permissions }
    });
}

// Update user commission rate
export async function updateUserCommission(
    userId: string,
    commissionRate: number
): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { commissionRate });
}

// Remove employee from organization
export async function removeEmployee(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
}

// Check if user is org owner
export async function isOrgOwner(userId: string, orgId: string): Promise<boolean> {
    const org = await getOrganization(orgId);
    return org?.ownerId === userId;
}

// Real-time listener for user profile (for permission sync)
export function subscribeToUserProfile(
    userId: string,
    callback: (user: UserProfile | null) => void
): () => void {
    const userRef = doc(db, 'users', userId);

    return onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ uid: snapshot.id, ...snapshot.data() } as UserProfile);
        } else {
            callback(null);
        }
    });
}
