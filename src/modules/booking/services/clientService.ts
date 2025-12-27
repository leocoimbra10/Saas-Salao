import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../../../shared/lib/firebase';

export interface Client {
    id: string;
    orgId: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    notes?: string;
    totalVisits?: number;
    lastVisit?: Date;
}

const COLLECTION = 'clients';

export const subscribeToClients = (orgId: string, onUpdate: (data: Client[]) => void) => {
    const q = query(collection(db, COLLECTION), where('orgId', '==', orgId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        onUpdate(items);
    });
};

export const createClient = async (data: Omit<Client, 'id'>) => {
    return addDoc(collection(db, COLLECTION), data);
};

export const updateClient = async (id: string, data: Partial<Client>) => {
    return updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteClient = async (id: string) => {
    return deleteDoc(doc(db, COLLECTION, id));
};
