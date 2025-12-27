import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs
} from 'firebase/firestore';
import { db } from '../../../shared/lib/firebase';
import { Service } from '../../../shared/types/types';

const COLLECTION = 'services';

export const subscribeToServices = (orgId: string, onUpdate: (data: Service[]) => void) => {
    const q = query(collection(db, COLLECTION), where('orgId', '==', orgId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        onUpdate(items);
    });
};

export const getServices = async (orgId: string): Promise<Service[]> => {
    const q = query(collection(db, COLLECTION), where('orgId', '==', orgId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
};

export const createService = async (data: Omit<Service, 'id'>) => {
    return addDoc(collection(db, COLLECTION), data);
};

export const updateService = async (id: string, data: Partial<Service>) => {
    return updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteService = async (id: string) => {
    return deleteDoc(doc(db, COLLECTION, id));
};
