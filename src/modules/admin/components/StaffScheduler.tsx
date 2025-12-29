/**
 * BEAUTY SALON NEOMORPHIC APP - Staff Scheduler component
 * Professional European-style timeline view
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addMinutes, startOfDay, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Clock,
    User,
    Sparkles,
    Scissors,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Search,
    Plus,
    Heart,
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Appointment, Service, Staff } from '../../../shared/types/types';
import { Badge, Card, Avatar } from '../../../shared/components/ui/NeoComponents';

interface StaffSchedulerProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    staff: Staff[];
    appointments: Appointment[];
    services: Service[];
    onAppointmentClick: (apt: Appointment) => void;
    onAddAppointment: (time: string, staffId: string) => void;
}

export const StaffScheduler: React.FC<StaffSchedulerProps> = ({
    selectedDate,
    onDateChange,
    staff,
    appointments,
    services,
    onAppointmentClick,
    onAddAppointment,
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time indicator every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    }, []);

    const getSlotPosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = (hours - 8) * 60 + minutes;
        return totalMinutes * 2; // 2px per minute
    };

    const getDurationHeight = (duration: number) => {
        return duration * 2; // 2px per minute
    };

    const getTimeIndicatorPosition = () => {
        if (!isSameDay(currentTime, selectedDate)) return -1;
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        if (hours < 8 || hours > 20) return -1;
        return ((hours - 8) * 60 + minutes) * 2;
    };

    const timeIndicatorPos = getTimeIndicatorPosition();

    return (
        <div className="flex flex-col h-full bg-neo-bg rounded-neo overflow-hidden border border-slate-100/50">
            {/* Scheduler Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100/50 bg-white/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-neo-bg rounded-full shadow-neo-in p-1">
                        <button className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-neo-accent bg-white shadow-sm transition-all">Dia</button>
                        <button className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-neo-text-secondary hover:text-neo-text transition-all">Semana</button>
                        <button className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-neo-text-secondary hover:text-neo-text transition-all">Mês</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onDateChange(addDays(selectedDate, -1))}
                        className="w-8 h-8 rounded-full shadow-neo-out flex items-center justify-center text-neo-text"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <h2 className="font-display text-lg font-semibold text-neo-text tracking-tight">
                        {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                    </h2>
                    <button
                        onClick={() => onDateChange(addDays(selectedDate, 1))}
                        className="w-8 h-8 rounded-full shadow-neo-out flex items-center justify-center text-neo-text"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full shadow-neo-out flex items-center justify-center text-neo-text-secondary">
                        <Search size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neo-accent shadow-neo-out flex items-center justify-center text-white">
                        <Plus size={20} />
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto relative no-scrollbar">
                <div className="flex min-w-max">
                    {/* Time Sidebar */}
                    <div className="w-20 sticky left-0 z-20 bg-neo-bg border-r border-slate-100/50">
                        <div className="h-16 border-b border-slate-100/50" /> {/* Corner spacer */}
                        {timeSlots.map(time => (
                            <div
                                key={time}
                                className="h-[60px] flex items-start justify-center pt-2"
                            >
                                <span className="text-[10px] font-medium text-neo-text-secondary tracking-tighter">
                                    {time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Staff Columns */}
                    <div className="flex relative">
                        {staff.map(member => (
                            <div key={member.id} className="w-48 border-r border-slate-100/50 group relative">
                                {/* Staff Header */}
                                <div className="h-16 sticky top-0 z-10 bg-white/50 backdrop-blur-md border-b border-slate-100/50 p-3 flex items-center gap-2">
                                    <Avatar size="sm" src={member.photo} className="shadow-sm border border-white" />
                                    <div>
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-neo-text truncate w-28">
                                            {member.name}
                                        </h3>
                                        <p className="text-[10px] text-neo-text-secondary lowercase font-medium">
                                            {member.specialty}
                                        </p>
                                    </div>
                                </div>

                                {/* Vertical Slots */}
                                <div className="relative h-[1560px]"> {/* 13 hours * 2slots * 60px */}
                                    {timeSlots.map(time => (
                                        <div
                                            key={time}
                                            className="h-[60px] border-b border-slate-100/20 active:bg-neo-accent/5 transition-colors cursor-crosshair"
                                            onClick={() => onAddAppointment(time, member.id)}
                                        />
                                    ))}

                                    {/* Appointments for this staff */}
                                    {appointments
                                        .filter(apt => apt.staffId === member.id && isSameDay(new Date(apt.date), selectedDate))
                                        .map(apt => {
                                            const serviceList = apt.services.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[];
                                            const totalDuration = serviceList.reduce((sum, s) => sum + s.duration, 0);
                                            const top = getSlotPosition(apt.time);
                                            const height = getDurationHeight(totalDuration);

                                            return (
                                                <motion.div
                                                    key={apt.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAppointmentClick(apt);
                                                    }}
                                                    className={cn(
                                                        "absolute inset-x-2 z-10 rounded-neo p-2 cursor-pointer overflow-hidden",
                                                        "bg-white/40 backdrop-blur-xl border border-white/40 shadow-neo-out-lg transition-all hover:scale-[1.02]",
                                                        "flex flex-col justify-between"
                                                    )}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        marginTop: '2px'
                                                    }}
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="text-[11px] font-bold text-neo-text leading-tight truncate">
                                                                {apt.clientName}
                                                            </h4>
                                                            {apt.depositPaid > 0 && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-neo-accent shadow-[0_0_5px_rgba(212,175,55,0.8)]" title="Sinal pago" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {serviceList.map(s => (
                                                                <span key={s.id} className="text-[9px] text-neo-text-secondary flex items-center gap-0.5">
                                                                    {s.category === 'makeup' ? <Sparkles size={8} /> : <Scissors size={8} />}
                                                                    {s.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-[9px] font-medium text-neo-text-secondary">
                                                            {apt.time} • {totalDuration}m
                                                        </span>
                                                        <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'} className="text-[8px] py-0 px-1">
                                                            {apt.status === 'confirmed' ? 'ok' : 'pending'}
                                                        </Badge>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}

                        {/* Current Time Indicator */}
                        {timeIndicatorPos !== -1 && (
                            <div
                                className="absolute left-0 right-0 h-[2px] bg-[var(--color-brand-gold)] z-30 pointer-events-none shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                style={{ top: `${timeIndicatorPos + 64}px` }} // +64 for staff header
                            >
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--color-brand-gold)]" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
