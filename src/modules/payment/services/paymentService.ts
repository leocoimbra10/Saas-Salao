/**
 * PAYMENT SERVICE
 * Handle payment links and payment processing
 */
import { db } from '../../../shared/lib/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

export interface PaymentLink {
    id: string;
    clientType: 'bride' | 'regular';
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    appointmentDate: string;
    appointmentTime: string;
    services: Array<{
        id: string;
        name: string;
        price: number;
    }>;
    totalAmount: number;
    depositAmount: number;
    paymentDeadline: Date;
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    createdAt: Date;
    paidAt?: Date;
    orgId: string;
}

/**
 * Create a new payment link
 */
export const createPaymentLink = async (data: Omit<PaymentLink, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'paymentLinks'), {
            ...data,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
};

/**
 * Get payment link by ID
 */
export const getPaymentLink = async (id: string): Promise<PaymentLink | null> => {
    try {
        const docRef = doc(db, 'paymentLinks', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                clientType: data.clientType,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                appointmentDate: data.appointmentDate,
                appointmentTime: data.appointmentTime,
                services: data.services,
                totalAmount: data.totalAmount,
                depositAmount: data.depositAmount,
                paymentDeadline: data.paymentDeadline?.toDate() || new Date(),
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                paidAt: data.paidAt?.toDate(),
                orgId: data.orgId
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting payment link:', error);
        throw error;
    }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
    id: string,
    status: 'paid' | 'expired' | 'cancelled'
): Promise<void> => {
    try {
        const docRef = doc(db, 'paymentLinks', id);
        const updateData: any = {
            status,
            updatedAt: serverTimestamp()
        };

        if (status === 'paid') {
            updateData.paidAt = serverTimestamp();
        }

        await updateDoc(docRef, updateData);
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};

/**
 * Get all payment links for an organization
 */
export const getPaymentLinksByOrg = async (orgId: string): Promise<PaymentLink[]> => {
    try {
        const q = query(
            collection(db, 'paymentLinks'),
            where('orgId', '==', orgId)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                clientType: data.clientType,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                appointmentDate: data.appointmentDate,
                appointmentTime: data.appointmentTime,
                services: data.services,
                totalAmount: data.totalAmount,
                depositAmount: data.depositAmount,
                paymentDeadline: data.paymentDeadline?.toDate() || new Date(),
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                paidAt: data.paidAt?.toDate(),
                orgId: data.orgId
            };
        });
    } catch (error) {
        console.error('Error getting payment links:', error);
        throw error;
    }
};

/**
 * Check if payment link is expired
 */
export const isPaymentLinkExpired = (paymentLink: PaymentLink): boolean => {
    return new Date() > paymentLink.paymentDeadline && paymentLink.status === 'pending';
};
