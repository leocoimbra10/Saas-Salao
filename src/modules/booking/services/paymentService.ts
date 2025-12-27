import { db } from '../../../shared/lib/firebase';
import { doc, updateDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { functions } from '../../../shared/lib/firebase';
import { httpsCallable } from 'firebase/functions';

const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
if (!MP_PUBLIC_KEY) {
    console.warn('[Payment Service] Warning: VITE_MERCADOPAGO_PUBLIC_KEY is missing. Payments will not initialize.');
}

export interface PaymentDetails {
    appointmentId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    method: 'pix' | 'credit_card';
    metadata?: any;
}

/**
 * Service to handle client-side payment logic and Firestore tracking
 */
export const paymentService = {
    /**
     * Initializes a Stripe checkout or PIX generation
     * In a real app, this would call a Cloud Function to create a PaymentIntent
     */
    async createPaymentRecord(details: Omit<PaymentDetails, 'status'>) {
        const paymentRef = doc(collection(db, 'payments'));
        const paymentData: PaymentDetails = {
            ...details,
            status: 'pending',
        };

        await setDoc(paymentRef, {
            ...paymentData,
            createdAt: serverTimestamp(),
        });

        return paymentRef.id;
    },

    /**
     * Creates a Mercado Pago payment preference
     */
    async createPreference(appointmentId: string, amount: number, items: any[]) {
        const createPreferenceFn = httpsCallable(functions, 'createMercadoPagoPreference');
        const response = await createPreferenceFn({ appointmentId, amount, items });
        return response.data as { preferenceId: string };
    },

    /**
     * Processes a payment from Mercado Pago Brick
     */
    async processPayment(paymentData: any) {
        const processPaymentFn = httpsCallable(functions, 'processMercadoPagoPayment');
        const response = await processPaymentFn(paymentData);
        return response.data as { status: string, paymentId?: string, pixData?: any };
    },

    /**
     * Updates appointment with payment status
     */
    async confirmPayment(appointmentId: string, paymentId: string, status: 'completed' | 'failed') {
        const appointmentRef = doc(db, 'appointments', appointmentId);
        const paymentRef = doc(db, 'payments', paymentId);

        await updateDoc(appointmentRef, {
            paymentStatus: status === 'completed' ? 'paid' : 'failed',
            updatedAt: serverTimestamp(),
        });

        await updateDoc(paymentRef, {
            status,
            updatedAt: serverTimestamp(),
        });
    }
};
