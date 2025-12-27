import { db } from '../../../shared/lib/firebase';
import { doc, updateDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (Publishable Key should be in .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

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
