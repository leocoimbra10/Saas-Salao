/**
 * WAITLIST SERVICE
 * Manages clients waiting for an available slot in the calendar.
 */

export interface WaitlistEntry {
    id: string;
    clientName: string;
    clientPhone: string;
    serviceId: string;
    preferredDate?: string;
    preferredTimeRange?: string; // "morning", "afternoon", "evening"
    status: 'waiting' | 'notified' | 'booked' | 'expired';
}

export const addToWaitlist = async (entry: Omit<WaitlistEntry, 'id' | 'status'>) => {
    console.log('Adding to waitlist:', entry);
    // Simulate Firestore call
    return { success: true, id: `WL-${Date.now()}` };
};

export const getWaitlistByService = (serviceId: string): WaitlistEntry[] => {
    return [
        { id: '1', clientName: 'Alice Silva', clientPhone: '11999999999', serviceId, status: 'waiting' },
        { id: '2', clientName: 'Bruna Gomes', clientPhone: '11888888888', serviceId, status: 'waiting' },
    ];
};
