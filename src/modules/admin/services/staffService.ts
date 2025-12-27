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
import { Staff } from '../../../shared/types/types';

const COLLECTION = 'staff';

export const subscribeToStaff = (orgId: string, onUpdate: (data: Staff[]) => void) => {
    const q = query(collection(db, COLLECTION), where('orgId', '==', orgId));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
        onUpdate(items);
    });
};

export const createStaff = async (data: Omit<Staff, 'id'>) => {
    return addDoc(collection(db, COLLECTION), data);
};

export const updateStaff = async (id: string, data: Partial<Staff>) => {
    return updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteStaff = async (id: string) => {
    return deleteDoc(doc(db, COLLECTION, id));
};
