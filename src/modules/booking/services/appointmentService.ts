/**
 * BEAUTY SALON NEOMORPHIC APP - Appointment Service
 * Handles real-time synchronization with Firestore
 */
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    where
} from 'firebase/firestore';
import { db } from '../../../shared/lib/firebase';
import { Appointment } from '../../../shared/types/types';

const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Subscribe to real-time appointment updates
 * @param onUpdate Callback function to receive the updated list of appointments
 * @returns Unsubscribe function to stop listening
 */
export const subscribeToAppointments = (orgId: string, onUpdate: (appointments: Appointment[]) => void) => {
    const q = query(
        collection(db, APPOINTMENTS_COLLECTION),
        where('orgId', '==', orgId),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
            } as Appointment;
        });

        onUpdate(appointments);
    }, (error) => {
        console.error("Error fetching appointments:", error);
    });
};

/**
 * Create a new appointment
 */
export const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
            ...appointment,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }
};

/**
 * Update an existing appointment
 */
export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
        const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        throw error;
    }
};

/**
 * Delete an appointment
 */
export const deleteAppointment = async (id: string) => {
    try {
        const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting appointment:", error);
        throw error;
    }
};
