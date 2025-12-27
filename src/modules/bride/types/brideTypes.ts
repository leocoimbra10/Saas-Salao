/**
 * BRIDE PORTAL TYPES
 * Types for the exclusive Bride Portal feature
 */

// Bridal Package Status
export type BridalStatus = 'lead' | 'confirmed' | 'trial_done' | 'completed' | 'cancelled';

// Attendant (Bridesmaid/Family)
export interface Attendant {
    id: string;
    name: string;
    relation: 'bridesmaid' | 'mother' | 'sister' | 'friend' | 'other';
    services: string[]; // service IDs
    totalPrice: number;
    isPaid: boolean;
    notes?: string;
}

// Moodboard Photo
export interface MoodboardPhoto {
    id: string;
    imageUrl: string;
    category: 'dress' | 'bouquet' | 'makeup' | 'hair' | 'inspiration';
    uploadDate: Date;
    notes?: string;
}

// Timeline Milestone
export interface TimelineMilestone {
    id: string;
    type: 'trial' | 'pre_wedding' | 'wedding_day';
    date: Date | null;
    time?: string;
    status: 'pending' | 'scheduled' | 'completed';
    notes?: string;
    services?: string[];
}

// Main Bridal Package
export interface BridalPackage {
    id: string;
    clientId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    orgId: string;

    // Wedding Details
    weddingDate: Date;
    weddingVenue?: string;
    weddingCity?: string;

    // Status & Timeline
    status: BridalStatus;
    timeline: TimelineMilestone[];

    // Attendants
    attendants: Attendant[];

    // Moodboard
    moodboardPhotos: MoodboardPhoto[];

    // Financials
    packageValue: number;
    depositPaid: number;
    balanceDue: number;
    contractUrl?: string;

    // Services included
    brideServices: string[]; // service IDs for bride

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    assignedProfessionalId?: string;
    notes?: string;
}

// Service Pricing for Attendants
export const ATTENDANT_SERVICES = [
    { id: 'makeup-attendant', name: 'Maquiagem', price: 160 },
    { id: 'hair-attendant', name: 'Penteado', price: 140 },
    { id: 'combo-attendant', name: 'Maquiagem + Penteado', price: 280 },
] as const;

// Bride Service Pricing
export const BRIDE_SERVICES = [
    { id: 'bride-makeup', name: 'Maquiagem Noiva', price: 450 },
    { id: 'bride-hair', name: 'Penteado Noiva', price: 380 },
    { id: 'bride-combo', name: 'Combo Noiva Completo', price: 750 },
    { id: 'bride-trial', name: 'Prova de Maquiagem', price: 200 },
    { id: 'bride-prep', name: 'Dia da Noiva (Preparação)', price: 150 },
] as const;
