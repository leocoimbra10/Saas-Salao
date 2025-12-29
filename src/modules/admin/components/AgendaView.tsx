/**
 * BEAUTY SALON NEOMORPHIC APP - Agenda View
 * iPhone-inspired Dual View: Month Grid + Daily List
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { NeoButton, Typography } from '../../../shared/components/ui/NeoComponents';
import { Calendar } from '../../booking/components/Calendar';
import { AgendaCard } from './AgendaCard';
import { Appointment, Service, Staff } from '../../../shared/types/types';
import { cn } from '../../../shared/lib/utils'; // Keep cn for custom classes if needed or removal

interface AgendaViewProps {
    // ... existing interface ...
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    appointments: Appointment[];
    services: Service[];
    staff: Staff[];
    onAppointmentClick: (apt: Appointment) => void;
    onAddAppointment: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
    selectedDate,
    onDateChange,
    appointments,
    services,
    staff,
    onAppointmentClick,
    onAddAppointment
}) => {

    const dailyAppointments = useMemo(() => {
        return appointments
            .filter(apt => isSameDay(new Date(apt.date), selectedDate))
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [appointments, selectedDate]);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] relative overflow-hidden">

            {/* 1. THE NAVIGATOR (Top 35%) */}
            <div className="shrink-0 h-[35%] z-20 pb-4 pt-2 flex flex-col items-center justify-center rounded-b-[3rem] relative
                bg-neo-bg shadow-neo-out border-b border-white/40">
                <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={onDateChange}
                    appointments={appointments}
                    variant="mini"
                    className="bg-transparent shadow-none p-0 w-full px-4"
                />

                {/* Accent Thread Divider */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-neo-accent rounded-t-full shadow-neo-pressed" />
            </div>

            {/* 2. THE AGENDA LIST (Bottom 65%) */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 custom-scrollbar">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Typography variant="h2" className="text-3xl font-bold">
                            {format(selectedDate, 'd', { locale: ptBR })}
                        </Typography>
                        <div className="h-8 w-px bg-neo-text/20" />
                        <div className="flex flex-col">
                            <Typography variant="caption" className="text-xs uppercase tracking-widest text-neo-accent font-bold">
                                {format(selectedDate, 'EEEE', { locale: ptBR })}
                            </Typography>
                            <Typography variant="body" className="text-sm text-neo-text-secondary italic">
                                {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                            </Typography>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate.toISOString()}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4, ease: "easeOut" }} // Liquid feel
                            className="space-y-1"
                        >
                            {dailyAppointments.length > 0 ? (
                                dailyAppointments.map((apt, index) => (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <AgendaCard
                                            appointment={apt}
                                            services={services}
                                            staffName={staff.find(s => s.id === apt.staffId)?.name}
                                            onClick={onAppointmentClick}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Typography variant="h4" className="text-neo-text/70 italic text-center mb-2">
                                        Agenda livre para hoje
                                    </Typography>
                                    <Typography variant="caption" className="text-neo-text-secondary tracking-widest uppercase">
                                        Nenhum agendamento
                                    </Typography>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>


            {/* Floating Action Button - Repositioned near calendar */}
            <NeoButton
                variant="gradient"
                onClick={onAddAppointment}
                className={cn(
                    "absolute top-4 right-6 z-30",
                    "w-14 h-14 rounded-full p-0",
                    "shadow-[0_8px_32px_rgba(232,160,184,0.5)]",
                    "flex items-center justify-center",
                    "hover:scale-110 hover:shadow-[0_12px_40px_rgba(232,160,184,0.6)] active:scale-95",
                    "transition-all duration-300",
                    "border-2 border-white/30 backdrop-blur-md",
                    "animate-in fade-in slide-in-from-top-4 duration-500"
                )}
                title="Novo Agendamento"
            >
                <Plus size={26} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-90" />
            </NeoButton>

        </div>
    );
};
