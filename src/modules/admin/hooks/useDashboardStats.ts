import { useMemo } from 'react';
import { Appointment } from '../../../shared/types/types';
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, isSameMonth, getDaysInMonth, getDate } from 'date-fns';
import { useAppointments } from '../../booking/hooks/useAppointments';

export interface DashboardStats {
    monthlyRevenue: number;
    monthlyAppointments: number;
    clientRetention: number;
    newClients: number;
    topServices: { name: string; count: number }[];
    revenueGrowth: number; // Percentage
    appointmentGrowth: number; // Percentage
    projectedRevenue: number;
    projectedAppointments: number;
    averageTicket: number;
}

export const useDashboardStats = (orgId: string | undefined) => {
    const { data: appointments = [], isLoading: loadingApps } = useAppointments(orgId);

    const stats = useMemo<DashboardStats>(() => {
        if (!appointments.length) {
            return {
                monthlyRevenue: 0,
                monthlyAppointments: 0,
                clientRetention: 0,
                newClients: 0,
                topServices: [],
                revenueGrowth: 0,
                appointmentGrowth: 0,
                projectedRevenue: 0,
                projectedAppointments: 0,
                averageTicket: 0
            };
        }

        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const daysInMonth = getDaysInMonth(now);
        const daysPassed = getDate(now);

        // --- Current Month Data ---
        const currentMonthAppointments = appointments.filter(app => {
            return isWithinInterval(new Date(app.date + 'T12:00:00'), { start: currentMonthStart, end: currentMonthEnd });
        });

        const currentMonthRevenue = currentMonthAppointments
            .filter(app => app.status === 'completed' || app.status === 'confirmed')
            .reduce((sum, app) => sum + (app.totalAmount || 0), 0);

        const currentMonthCount = currentMonthAppointments.length;

        // --- Last Month Data (for Growth) ---
        const lastMonthAppointments = appointments.filter(app =>
            isWithinInterval(new Date(app.date + 'T12:00:00'), { start: lastMonthStart, end: lastMonthEnd })
        );

        const lastMonthRevenue = lastMonthAppointments
            .filter(app => app.status === 'completed' || app.status === 'confirmed')
            .reduce((sum, app) => sum + (app.totalAmount || 0), 0);

        const lastMonthCount = lastMonthAppointments.length;

        // --- Growth Calculation ---
        const revenueGrowth = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        const appointmentGrowth = lastMonthCount > 0
            ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
            : 0;


        // --- Top Services ---
        const serviceCounts: Record<string, number> = {};
        currentMonthAppointments.forEach(app => {
            app.services.forEach(serviceId => {
                serviceCounts[serviceId] = (serviceCounts[serviceId] || 0) + 1;
            });
        });

        // Convert to array and sort
        const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // --- New Clients & Retention ---
        const clientVisits: Record<string, Date[]> = {};
        appointments.forEach(app => {
            if (!clientVisits[app.clientId]) clientVisits[app.clientId] = [];
            clientVisits[app.clientId].push(new Date(app.date));
        });

        let newClientsCount = 0;
        let returningClientsCount = 0;
        const totalClients = Object.keys(clientVisits).length;

        Object.values(clientVisits).forEach(visits => {
            visits.sort((a, b) => a.getTime() - b.getTime());
            const firstVisit = visits[0];

            if (isSameMonth(firstVisit, now)) {
                newClientsCount++;
            }

            if (visits.length > 1) {
                returningClientsCount++;
            }
        });

        const retentionRate = totalClients > 0 ? (returningClientsCount / totalClients) * 100 : 0;

        // --- Projections ---
        // Simple linear extrapolation
        const projectedRevenue = daysPassed > 0
            ? (currentMonthRevenue / daysPassed) * daysInMonth
            : 0;

        const projectedAppointments = daysPassed > 0
            ? Math.round((currentMonthCount / daysPassed) * daysInMonth)
            : 0;

        const averageTicket = currentMonthCount > 0
            ? currentMonthRevenue / currentMonthCount
            : 0;

        return {
            monthlyRevenue: currentMonthRevenue,
            monthlyAppointments: currentMonthCount,
            clientRetention: Math.round(retentionRate),
            newClients: newClientsCount,
            topServices,
            revenueGrowth: Math.round(revenueGrowth),
            appointmentGrowth: Math.round(appointmentGrowth),
            projectedRevenue: Math.round(projectedRevenue),
            projectedAppointments,
            averageTicket: Math.round(averageTicket)
        };

    }, [appointments]);

    return { stats, isLoading: loadingApps };
};
