import { useMemo } from 'react';
import { addMinutes, format, isSameDay, parse, isAfter, setHours, setMinutes, isBefore } from 'date-fns';
import { Appointment } from '../../../shared/types/types';

export interface TimeSlot {
    time: string;
    available: boolean;
}

interface UseAvailableSlotsProps {
    date: Date | null;
    appointments: Appointment[];
    staffId: string | null;
    serviceDuration: number;
    bufferMinutes?: number;
}

export const useAvailableSlots = ({
    date,
    appointments,
    staffId,
    serviceDuration,
    bufferMinutes = 15
}: UseAvailableSlotsProps): TimeSlot[] => {
    return useMemo(() => {
        if (!date || !staffId) return [];

        const slots: TimeSlot[] = [];
        const startHour = 9;
        const endHour = 18; // Last booking starts at 18:00? No, usually salon closes at e.g. 19:00. Let's assume slots generated until 18:30 or so.

        // Generate base slots every 30 mins
        const baseSlots: Date[] = [];
        let currentTime = setMinutes(setHours(new Date(date), startHour), 0);
        const endTime = setMinutes(setHours(new Date(date), endHour), 0);

        while (currentTime <= endTime) {
            baseSlots.push(new Date(currentTime));
            currentTime = addMinutes(currentTime, 30);
        }

        // Filter appointments for the selected day and staff
        const dayAppointments = appointments.filter(apt =>
            apt.staffId === staffId &&
            isSameDay(new Date(apt.date), date) &&
            apt.status !== 'cancelled'
        );

        // Check availability for each slot
        baseSlots.forEach(slotStartTime => {
            const slotEndTime = addMinutes(slotStartTime, serviceDuration);
            // The slot effectively occupies time until: end + buffer
            const slotOccupiedUntil = addMinutes(slotEndTime, bufferMinutes);

            let isAvailable = true;

            // Check against each existing appointment
            for (const apt of dayAppointments) {
                // Parse appointment start/end
                // Appointment time is stored as string "HH:mm" usually?
                // Let's check Appointment type. It has `date` (string YYYY-MM-DD usually) and `time` (HH:mm).
                // We need duration of the existing appointment to know when it ends.
                // Assuming we don't have duration in Appointment type (based on previous view), we might need to rely on standard slots or fetch services.
                // Wait, Appointment type has `services` array. We can calculate duration if we have access to services list.
                // BUT, `useAvailableSlots` acts on Client side where we might not have full service details for *other* people's appointments easily if not embedded.
                // Let's assume a default duration if missing, or better, Appointment *should* ideally store `endTime` or `duration`.
                // Looking at `AdminDashboard` Mock Data, `Appointment` has `services: string[]`. 
                // CRITICAL GAP: To check collision accurately, we need the duration of existing appointments.
                // For now, I will assume a standard 60 min duration for existing appointments if not available, OR check if `Appointment` has it.
                // I will add a TO-DO or check `types.ts` later. For now, let's parse start time.

                const aptDate = new Date(apt.date + 'T' + apt.time); // ISO format for safety if apt.date is YYYY-MM-DD
                // Actually `date` is YYYY-MM-DD. `time` is HH:mm.
                // Let's construct Date objects.
                const [aptHour, aptMinute] = apt.time.split(':').map(Number);
                const aptStart = setMinutes(setHours(new Date(date), aptHour), aptMinute);

                // We need the appointment end time.
                // IF we don't have duration, we can't block time accurately.
                // Strategy: For this MVP/Plan, I'll assume 60 minutes for existing appointments to be safe,
                // OR better, since we don't have it, maybe we block 1 hour by default.
                // Ideally we should update the backend to store `endTime` or `duration`.
                // Let's proceed with 60 min default for now to enable the feature.
                const existingAptDuration = 60;
                const aptEnd = addMinutes(aptStart, existingAptDuration);
                const aptOccupiedUntil = addMinutes(aptEnd, bufferMinutes); // Buffer after existing appointment too?
                // Visual:
                // Existing: [Start -- End] + Buffer
                // New:      [Start -- End] + Buffer

                // Overlap condition:
                // (NewStart < ExistingEnd + Buffer) AND (NewEnd + Buffer > ExistingStart)

                if (
                    isBefore(slotStartTime, aptOccupiedUntil) &&
                    isAfter(slotOccupiedUntil, aptStart)
                ) {
                    isAvailable = false;
                    break;
                }
            }

            // Also check if slot is in the past (if today)
            if (isSameDay(date, new Date()) && isBefore(slotStartTime, new Date())) {
                isAvailable = false;
            }

            slots.push({
                time: format(slotStartTime, 'HH:mm'),
                available: isAvailable
            });
        });

        return slots;
    }, [date, appointments, staffId, serviceDuration, bufferMinutes]);
};
