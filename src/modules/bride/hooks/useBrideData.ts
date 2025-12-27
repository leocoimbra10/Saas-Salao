/**
 * BRIDE DATA HOOKS
 * React hooks for bride journey, notifications, and financials
 */

import { useState, useEffect, useCallback } from 'react';
import {
    BrideJourney,
    BrideNotification,
    BrideFinancials,
    BeautyTimelineSlot,
    subscribeToBrideJourney,
    subscribeToNotifications,
    calculateCountdown,
    getActiveNotifications,
    saveBrideJourney,
    completeNotification,
    generateBeautyTimeline,
    saveBeautyTimeline,
    calculateBrideFinancials,
    updateJourneyProgress
} from '../services/brideIntelligence';

// ============================================
// useBrideJourney
// ============================================

interface UseBrideJourneyReturn {
    journey: BrideJourney | null;
    countdown: ReturnType<typeof calculateCountdown> | null;
    loading: boolean;
    error: string | null;
    saveJourney: (weddingDate: Date, ceremonyTime: string, venue?: string) => Promise<void>;
    updateProgress: (updates: Partial<Pick<BrideJourney, 'moodboardComplete' | 'trialComplete' | 'attendantsConfirmed'>>) => Promise<void>;
}

export const useBrideJourney = (brideId: string | null, brideName: string = ''): UseBrideJourneyReturn => {
    const [journey, setJourney] = useState<BrideJourney | null>(null);
    const [countdown, setCountdown] = useState<ReturnType<typeof calculateCountdown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to journey updates
    useEffect(() => {
        if (!brideId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToBrideJourney(brideId, (data) => {
            setJourney(data);
            if (data?.weddingDate) {
                const weddingDate = data.weddingDate instanceof Date
                    ? data.weddingDate
                    : (data.weddingDate as any).toDate();
                setCountdown(calculateCountdown(weddingDate));
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [brideId]);

    // Update countdown every minute
    useEffect(() => {
        if (!journey?.weddingDate) return;

        const interval = setInterval(() => {
            const weddingDate = journey.weddingDate instanceof Date
                ? journey.weddingDate
                : (journey.weddingDate as any).toDate();
            setCountdown(calculateCountdown(weddingDate));
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, [journey?.weddingDate]);

    const saveJourney = useCallback(async (weddingDate: Date, ceremonyTime: string, venue?: string) => {
        if (!brideId) {
            setError('Bride ID is required');
            return;
        }

        try {
            setLoading(true);
            await saveBrideJourney(brideId, brideName, weddingDate, ceremonyTime, venue);
            setError(null);
        } catch (err) {
            console.error('Error saving journey:', err);
            setError('Erro ao salvar jornada');
        } finally {
            setLoading(false);
        }
    }, [brideId, brideName]);

    const updateProgress = useCallback(async (
        updates: Partial<Pick<BrideJourney, 'moodboardComplete' | 'trialComplete' | 'attendantsConfirmed'>>
    ) => {
        if (!brideId) return;

        try {
            await updateJourneyProgress(brideId, updates);
        } catch (err) {
            console.error('Error updating progress:', err);
            setError('Erro ao atualizar progresso');
        }
    }, [brideId]);

    return { journey, countdown, loading, error, saveJourney, updateProgress };
};

// ============================================
// useNotifications
// ============================================

interface UseNotificationsReturn {
    notifications: BrideNotification[];
    activeNotifications: BrideNotification[];
    upcomingNotifications: BrideNotification[];
    loading: boolean;
    markComplete: (notificationId: string) => Promise<void>;
}

export const useNotifications = (brideId: string | null): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<BrideNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!brideId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToNotifications(brideId, (data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [brideId]);

    const activeNotifications = getActiveNotifications(notifications);

    const upcomingNotifications = notifications.filter(n => {
        const now = new Date();
        const triggerDate = n.triggerDate instanceof Date ? n.triggerDate : (n.triggerDate as any).toDate();
        return triggerDate > now && !n.isCompleted;
    }).slice(0, 5); // Next 5

    const markComplete = useCallback(async (notificationId: string) => {
        if (!brideId) return;
        await completeNotification(brideId, notificationId);
    }, [brideId]);

    return { notifications, activeNotifications, upcomingNotifications, loading, markComplete };
};

// ============================================
// useBeautyTimeline
// ============================================

interface UseBeautyTimelineReturn {
    timeline: BeautyTimelineSlot[];
    generateTimeline: (
        ceremonyTime: string,
        attendants: Array<{ name: string; type: 'bridesmaid' | 'mother' | 'guest' }>,
        brideName?: string
    ) => BeautyTimelineSlot[];
    saveTimeline: (timeline: BeautyTimelineSlot[]) => Promise<void>;
}

export const useBeautyTimeline = (brideId: string | null): UseBeautyTimelineReturn => {
    const [timeline, setTimeline] = useState<BeautyTimelineSlot[]>([]);

    const generateTimelineLocal = useCallback((
        ceremonyTime: string,
        attendants: Array<{ name: string; type: 'bridesmaid' | 'mother' | 'guest' }>,
        brideName: string = 'Noiva'
    ) => {
        const generated = generateBeautyTimeline(ceremonyTime, attendants, brideName);
        setTimeline(generated);
        return generated;
    }, []);

    const saveTimelineLocal = useCallback(async (timelineData: BeautyTimelineSlot[]) => {
        if (!brideId) return;
        await saveBeautyTimeline(brideId, timelineData);
    }, [brideId]);

    return {
        timeline,
        generateTimeline: generateTimelineLocal,
        saveTimeline: saveTimelineLocal
    };
};

// ============================================
// useBrideFinancials
// ============================================

interface UseBrideFinancialsReturn {
    financials: BrideFinancials;
    recalculate: (
        bridePackageValue: number,
        attendants: Array<{ totalPrice: number; paidAmount: number }>
    ) => void;
}

export const useBrideFinancials = (): UseBrideFinancialsReturn => {
    const [financials, setFinancials] = useState<BrideFinancials>({
        totalServices: 0,
        totalPaid: 0,
        totalPending: 0,
        depositPaid: 0,
        bridePackageValue: 0,
        attendantsValue: 0
    });

    const recalculate = useCallback((
        bridePackageValue: number,
        attendants: Array<{ totalPrice: number; paidAmount: number }>
    ) => {
        const calculated = calculateBrideFinancials(bridePackageValue, attendants);
        setFinancials(calculated);
    }, []);

    return { financials, recalculate };
};

// ============================================
// Combined Hook for Bride Portal
// ============================================

export interface UseBrideDataReturn {
    journey: UseBrideJourneyReturn;
    notifications: UseNotificationsReturn;
    timeline: UseBeautyTimelineReturn;
    financials: UseBrideFinancialsReturn;
}

export const useBrideData = (brideId: string | null, brideName: string = ''): UseBrideDataReturn => {
    const journey = useBrideJourney(brideId, brideName);
    const notifications = useNotifications(brideId);
    const timeline = useBeautyTimeline(brideId);
    const financials = useBrideFinancials();

    return { journey, notifications, timeline, financials };
};

export default useBrideData;
