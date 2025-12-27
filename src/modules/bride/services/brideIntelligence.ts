/**
 * BRIDE INTELLIGENCE ENGINE
 * Automated alerts, timeline generation, and smart calculations
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../shared/lib/firebase';
import {
    differenceInDays,
    differenceInMonths,
    differenceInHours,
    subMonths,
    subDays,
    subHours,
    format,
    addMinutes,
    isBefore,
    isAfter,
    startOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================
// TYPES
// ============================================

export interface BrideJourney {
    id?: string;
    brideId: string;
    brideName: string;
    weddingDate: Date | Timestamp;
    ceremonyTime: string; // "15:00"
    venue?: string;
    journeyProgress: number; // 0-100
    moodboardComplete: boolean;
    trialComplete: boolean;
    attendantsConfirmed: number;
    totalExpected: number;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
}

export interface BrideNotification {
    id?: string;
    type: 'task' | 'reminder' | 'alert' | 'tip';
    title: string;
    message: string;
    icon: string;
    priority: 'low' | 'medium' | 'high';
    triggerDate: Date | Timestamp;
    isRead: boolean;
    isCompleted: boolean;
    category: 'moodboard' | 'trial' | 'hydration' | 'timeline' | 'payment' | 'general';
    createdAt: Date | Timestamp;
}

export interface BeautyTimelineSlot {
    id: string;
    startTime: string;
    endTime: string;
    clientName: string;
    clientType: 'bride' | 'bridesmaid' | 'mother' | 'guest';
    services: string[];
    staffId?: string;
    staffName?: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
}

export interface BrideFinancials {
    totalServices: number;
    totalPaid: number;
    totalPending: number;
    depositPaid: number;
    bridePackageValue: number;
    attendantsValue: number;
}

// ============================================
// LUXURY TASKS TEMPLATES
// ============================================

const LUXURY_TASKS = [
    {
        monthsBefore: 6,
        type: 'task' as const,
        title: 'Definir Paleta de Cores',
        message: 'É hora de criar o moodboard dos seus sonhos! Defina as cores que irão guiar sua maquiagem e penteado.',
        icon: '🎨',
        priority: 'medium' as const,
        category: 'moodboard' as const
    },
    {
        monthsBefore: 3,
        type: 'reminder' as const,
        title: 'Escolher Referências de Make',
        message: 'Comece a salvar inspirações de maquiagem para a prova. Pinterest e Instagram são seus aliados!',
        icon: '✨',
        priority: 'medium' as const,
        category: 'moodboard' as const
    },
    {
        monthsBefore: 2,
        type: 'task' as const,
        title: 'Agendar Teste de Beleza',
        message: 'A prova de noiva é essencial! Agende com antecedência para ter tempo de ajustes.',
        icon: '💄',
        priority: 'high' as const,
        category: 'trial' as const
    },
    {
        daysBefore: 30,
        type: 'reminder' as const,
        title: 'Confirmar Teste Final',
        message: 'Falta 1 mês! Confirme sua prova de noiva e traga todas as referências do moodboard.',
        icon: '📅',
        priority: 'high' as const,
        category: 'trial' as const
    },
    {
        daysBefore: 14,
        type: 'tip' as const,
        title: 'Iniciar Cuidados com a Pele',
        message: 'Hidratação intensiva! Use máscaras faciais 2x por semana para uma pele radiante.',
        icon: '💧',
        priority: 'medium' as const,
        category: 'hydration' as const
    },
    {
        daysBefore: 7,
        type: 'reminder' as const,
        title: 'Confirmar Timeline do Dia',
        message: 'Revise o cronograma de beleza com todas as madrinhas. Horários confirmados?',
        icon: '⏰',
        priority: 'high' as const,
        category: 'timeline' as const
    },
    {
        daysBefore: 3,
        type: 'tip' as const,
        title: 'Evitar Novidades na Pele',
        message: 'Não experimente produtos novos! Mantenha sua rotina de skincare habitual.',
        icon: '🧴',
        priority: 'high' as const,
        category: 'hydration' as const
    },
    {
        daysBefore: 1,
        type: 'alert' as const,
        title: 'Dicas de Hidratação Final',
        message: 'Beba muita água, durma bem e prepare-se para brilhar amanhã! 🌟',
        icon: '💎',
        priority: 'high' as const,
        category: 'hydration' as const
    },
    {
        hoursBefore: 12,
        type: 'alert' as const,
        title: 'Checklist Final',
        message: 'Separe: acessórios, robe, chinelo, vestido. Tudo pronto para amanhã!',
        icon: '✅',
        priority: 'high' as const,
        category: 'general' as const
    }
];

// ============================================
// JOURNEY MANAGEMENT
// ============================================

/**
 * Create or update bride journey
 */
export const saveBrideJourney = async (
    brideId: string,
    brideName: string,
    weddingDate: Date,
    ceremonyTime: string,
    venue?: string
): Promise<string> => {
    const journeyRef = doc(db, 'bride_journeys', brideId);
    const existingJourney = await getDoc(journeyRef);

    const journeyData: Partial<BrideJourney> = {
        brideId,
        brideName,
        weddingDate: Timestamp.fromDate(weddingDate),
        ceremonyTime,
        venue,
        updatedAt: serverTimestamp() as Timestamp
    };

    if (!existingJourney.exists()) {
        // New journey
        await setDoc(journeyRef, {
            ...journeyData,
            journeyProgress: 10, // Started journey
            moodboardComplete: false,
            trialComplete: false,
            attendantsConfirmed: 0,
            totalExpected: 0,
            createdAt: serverTimestamp()
        });

        // Generate automated notifications
        await generateAutomatedNotifications(brideId, weddingDate, ceremonyTime);
    } else {
        // Update existing
        await updateDoc(journeyRef, journeyData);

        // Regenerate notifications if date changed
        const oldDate = existingJourney.data().weddingDate?.toDate();
        if (oldDate?.getTime() !== weddingDate.getTime()) {
            await generateAutomatedNotifications(brideId, weddingDate, ceremonyTime);
        }
    }

    return brideId;
};

/**
 * Get bride journey with real-time updates
 */
export const subscribeToBrideJourney = (
    brideId: string,
    callback: (journey: BrideJourney | null) => void
): (() => void) => {
    const journeyRef = doc(db, 'bride_journeys', brideId);

    return onSnapshot(journeyRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            callback({
                id: snapshot.id,
                ...data,
                weddingDate: data.weddingDate?.toDate() || new Date(),
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as BrideJourney);
        } else {
            callback(null);
        }
    });
};

/**
 * Calculate countdown data
 */
export const calculateCountdown = (weddingDate: Date): {
    days: number;
    weeks: number;
    months: number;
    hours: number;
    isToday: boolean;
    isPast: boolean;
    label: string;
} => {
    const now = new Date();
    const days = differenceInDays(weddingDate, now);
    const weeks = Math.floor(days / 7);
    const months = differenceInMonths(weddingDate, now);
    const hours = differenceInHours(weddingDate, now);
    const isToday = days === 0 && hours > 0;
    const isPast = isBefore(weddingDate, now);

    let label = '';
    if (isPast) {
        label = 'O grande dia passou! 💍';
    } else if (isToday) {
        label = 'HOJE É O DIA! 💎';
    } else if (days === 1) {
        label = 'AMANHÃ! ✨';
    } else if (days <= 7) {
        label = `${days} dias para o grande dia!`;
    } else if (weeks <= 4) {
        label = `${weeks} semanas e ${days % 7} dias`;
    } else if (months <= 6) {
        label = `${months} meses e ${weeks % 4} semanas`;
    } else {
        label = `${months} meses para o grande dia`;
    }

    return { days, weeks, months, hours, isToday, isPast, label };
};

// ============================================
// AUTOMATED NOTIFICATIONS
// ============================================

/**
 * Generate all automated notifications based on wedding date
 */
export const generateAutomatedNotifications = async (
    brideId: string,
    weddingDate: Date,
    ceremonyTime: string
): Promise<void> => {
    const notificationsRef = collection(db, 'bride_journeys', brideId, 'notifications');

    // Clear existing auto-generated notifications
    const existingQuery = query(notificationsRef);
    const existing = await getDocs(existingQuery);

    // Don't delete, just skip if already exists (could add cleanup logic)

    const now = new Date();

    for (const task of LUXURY_TASKS) {
        let triggerDate: Date;

        if (task.monthsBefore) {
            triggerDate = subMonths(weddingDate, task.monthsBefore);
        } else if (task.daysBefore) {
            triggerDate = subDays(weddingDate, task.daysBefore);
        } else if (task.hoursBefore) {
            // Parse ceremony time and subtract hours
            const [hours, minutes] = ceremonyTime.split(':').map(Number);
            const ceremonyDateTime = new Date(weddingDate);
            ceremonyDateTime.setHours(hours, minutes, 0, 0);
            triggerDate = subHours(ceremonyDateTime, task.hoursBefore);
        } else {
            continue;
        }

        // Only create future notifications
        if (isAfter(triggerDate, now)) {
            await addDoc(notificationsRef, {
                type: task.type,
                title: task.title,
                message: task.message,
                icon: task.icon,
                priority: task.priority,
                category: task.category,
                triggerDate: Timestamp.fromDate(triggerDate),
                isRead: false,
                isCompleted: false,
                createdAt: serverTimestamp()
            });
        }
    }
};

/**
 * Subscribe to bride notifications
 */
export const subscribeToNotifications = (
    brideId: string,
    callback: (notifications: BrideNotification[]) => void
): (() => void) => {
    const notificationsRef = collection(db, 'bride_journeys', brideId, 'notifications');
    const q = query(notificationsRef, orderBy('triggerDate', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            triggerDate: doc.data().triggerDate?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as BrideNotification[];

        callback(notifications);
    });
};

/**
 * Get active notifications (triggered but not completed)
 */
export const getActiveNotifications = (notifications: BrideNotification[]): BrideNotification[] => {
    const now = new Date();
    return notifications.filter(n =>
        isBefore(n.triggerDate as Date, now) && !n.isCompleted
    );
};

/**
 * Mark notification as completed
 */
export const completeNotification = async (brideId: string, notificationId: string): Promise<void> => {
    const notificationRef = doc(db, 'bride_journeys', brideId, 'notifications', notificationId);
    await updateDoc(notificationRef, {
        isCompleted: true,
        completedAt: serverTimestamp()
    });
};

// ============================================
// AUTOMATED BEAUTY TIMELINE
// ============================================

/**
 * Generate beauty timeline based on ceremony time
 * - Start 5 hours before ceremony
 * - 45min intervals for bridesmaids
 * - Last 2 hours for bride only
 */
export const generateBeautyTimeline = (
    ceremonyTime: string,
    attendants: Array<{ name: string; type: 'bridesmaid' | 'mother' | 'guest' }>,
    brideName: string = 'Noiva'
): BeautyTimelineSlot[] => {
    const slots: BeautyTimelineSlot[] = [];

    // Parse ceremony time
    const [hours, minutes] = ceremonyTime.split(':').map(Number);
    const ceremonyDate = new Date();
    ceremonyDate.setHours(hours, minutes, 0, 0);

    // Start time = Ceremony - 5 hours
    const startTime = subHours(ceremonyDate, 5);

    // Bride reserved time = Last 2 hours (120 min)
    const brideStartTime = subHours(ceremonyDate, 2);

    // Available time for attendants = 3 hours (180 min)
    // Each attendant gets 45 min slot
    const slotDuration = 45;

    let currentTime = new Date(startTime);
    let slotId = 1;

    // Generate attendant slots (sorted by type priority)
    const sortedAttendants = [...attendants].sort((a, b) => {
        const priority = { mother: 0, bridesmaid: 1, guest: 2 };
        return priority[a.type] - priority[b.type];
    });

    for (const attendant of sortedAttendants) {
        // Check if we still have time before bride's slot
        if (isBefore(currentTime, brideStartTime)) {
            const slotEnd = addMinutes(currentTime, slotDuration);

            slots.push({
                id: `slot-${slotId}`,
                startTime: format(currentTime, 'HH:mm'),
                endTime: format(slotEnd, 'HH:mm'),
                clientName: attendant.name,
                clientType: attendant.type,
                services: attendant.type === 'mother'
                    ? ['Maquiagem VIP', 'Penteado Especial']
                    : ['Maquiagem Social', 'Penteado'],
                status: 'pending'
            });

            currentTime = slotEnd;
            slotId++;
        }
    }

    // Add bride slot (2 hours - 120 min)
    slots.push({
        id: `slot-bride`,
        startTime: format(brideStartTime, 'HH:mm'),
        endTime: format(ceremonyDate, 'HH:mm'),
        clientName: brideName,
        clientType: 'bride',
        services: ['Make Noiva Completa', 'Penteado Noiva', 'Retoques Finais'],
        status: 'pending'
    });

    return slots;
};

/**
 * Save timeline to Firestore
 */
export const saveBeautyTimeline = async (
    brideId: string,
    timeline: BeautyTimelineSlot[]
): Promise<void> => {
    const journeyRef = doc(db, 'bride_journeys', brideId);
    await updateDoc(journeyRef, {
        beautyTimeline: timeline,
        updatedAt: serverTimestamp()
    });
};

// ============================================
// FINANCIAL CALCULATIONS
// ============================================

/**
 * Calculate bride financials from services and attendants
 */
export const calculateBrideFinancials = (
    bridePackageValue: number,
    attendants: Array<{ totalPrice: number; paidAmount: number }>
): BrideFinancials => {
    const attendantsValue = attendants.reduce((sum, a) => sum + a.totalPrice, 0);
    const attendantsPaid = attendants.reduce((sum, a) => sum + a.paidAmount, 0);

    const totalServices = bridePackageValue + attendantsValue;
    const totalPaid = attendantsPaid; // Assuming bride deposit handled separately
    const totalPending = totalServices - totalPaid;

    return {
        totalServices,
        totalPaid,
        totalPending,
        depositPaid: 0, // To be set from actual data
        bridePackageValue,
        attendantsValue
    };
};

/**
 * Calculate journey progress
 * - 10% for registering
 * - +20% for completing moodboard
 * - +20% for completing trial
 * - +5% for each confirmed attendant (up to 30%)
 * - +20% for timeline confirmed
 */
export const calculateJourneyProgress = (journey: Partial<BrideJourney>): number => {
    let progress = 10; // Base for registering

    if (journey.moodboardComplete) progress += 20;
    if (journey.trialComplete) progress += 20;

    // Attendants progress (up to 30%)
    const attendantProgress = Math.min(
        (journey.attendantsConfirmed || 0) * 5,
        30
    );
    progress += attendantProgress;

    // Timeline progress handled separately
    // progress += journey.timelineConfirmed ? 20 : 0;

    return Math.min(progress, 100);
};

/**
 * Update journey progress
 */
export const updateJourneyProgress = async (
    brideId: string,
    updates: Partial<Pick<BrideJourney, 'moodboardComplete' | 'trialComplete' | 'attendantsConfirmed'>>
): Promise<void> => {
    const journeyRef = doc(db, 'bride_journeys', brideId);
    const journey = await getDoc(journeyRef);

    if (journey.exists()) {
        const currentData = journey.data() as BrideJourney;
        const updatedData = { ...currentData, ...updates };
        const newProgress = calculateJourneyProgress(updatedData);

        await updateDoc(journeyRef, {
            ...updates,
            journeyProgress: newProgress,
            updatedAt: serverTimestamp()
        });
    }
};

export default {
    saveBrideJourney,
    subscribeToBrideJourney,
    calculateCountdown,
    generateAutomatedNotifications,
    subscribeToNotifications,
    getActiveNotifications,
    completeNotification,
    generateBeautyTimeline,
    saveBeautyTimeline,
    calculateBrideFinancials,
    calculateJourneyProgress,
    updateJourneyProgress
};
