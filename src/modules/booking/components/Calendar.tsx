/**
 * BEAUTY SALON NEOMORPHIC APP - Calendar Component
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatTime } from '../../../shared/lib/utils';
import { Appointment, TimeSlot } from '../../../shared/types/types';
import { Badge } from '../../../shared/components/ui/NeoComponents';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointments: Appointment[];
  onTimeSelect?: (time: string) => void;
  selectedTime?: string;
  availableSlots?: string[];
  className?: string;
  variant?: 'default' | 'mini';
}

// Month View Calendar
export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  appointments,
  className,
  variant = 'default',
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const dateArray = [];
    let day = startDate;

    while (day <= endDate) {
      dateArray.push(day);
      day = addDays(day, 1);
    }

    return dateArray;
  }, [currentMonth]);

  const hasAppointment = (date: Date) => {
    return appointments.some(apt => isSameDay(new Date(apt.date), date));
  };

  const getAppointmentCount = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date)).length;
  };

  const isMini = variant === 'mini';

  return (
    <div className={cn(
      isMini ? 'w-full max-w-lg mx-auto' : 'bg-neo-bg rounded-neo p-4',
      className
    )}>
      {/* Month Navigation */}
      <div className={cn(
        "flex items-center justify-between mb-2",
        isMini ? "px-2" : "mb-6"
      )}>
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className={cn(
            "flex items-center justify-center transition-all",
            isMini ? "w-8 h-8 text-neo-text-secondary hover:text-neo-text" : "w-10 h-10 bg-neo-bg rounded-full shadow-neo-out text-neo-text active:shadow-neo-pressed"
          )}
        >
          <ChevronLeft size={isMini ? 18 : 20} />
        </button>
        <h3 className={cn(
          "font-semibold text-neo-text transition-all",
          isMini ? "text-xl font-serif tracking-tight" : "text-lg"
        )}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className={cn(
            "flex items-center justify-center transition-all",
            isMini ? "w-8 h-8 text-neo-text-secondary hover:text-neo-text" : "w-10 h-10 bg-neo-bg rounded-full shadow-neo-out text-neo-text active:shadow-neo-pressed"
          )}
        >
          <ChevronRight size={isMini ? 18 : 20} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className={cn(
            "text-center text-[10px] uppercase tracking-widest py-2 font-sans", // Enforced font-sans
            isMini ? "text-white/60 font-semibold" : "text-neo-text-secondary font-bold"
          )}>
            {day.charAt(0)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={cn("grid grid-cols-7", isMini ? "gap-x-0 gap-y-2" : "gap-1")}>
        {days.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const appointmentCount = getAppointmentCount(day);

          return (
            <div key={index} className="flex flex-col items-center justify-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDateSelect(day)}
                className={cn(
                  'relative flex items-center justify-center transition-all duration-200',
                  isMini
                    ? 'w-10 h-10 rounded-full text-base font-medium font-serif'
                    : 'w-full aspect-square rounded-neo-sm flex-col',
                  !isCurrentMonth && 'opacity-20',
                  isSelected
                    ? (isMini
                      ? 'bg-neo-accent text-white shadow-neo-pressed' // Standard Neo Accent
                      : 'shadow-neo-pressed bg-neo-bg text-neo-accent')
                    : (isMini
                      ? 'text-neo-text hover:bg-black/5' // Standard Neo Text
                      : 'bg-neo-bg shadow-neo-out hover:shadow-neo-out-lg text-neo-text'),
                  isCurrentDay && !isSelected && (isMini ? 'text-neo-accent font-bold' : 'ring-2 ring-neo-accent/30')
                )}
              >
                {/* Day Number */}
                <span>{format(day, 'd')}</span>

                {/* Event Indicators (Mini - Gold Dot) */}
                {isMini && appointmentCount > 0 && !isSelected && (
                  <span className="absolute -bottom-1 w-[4px] h-[4px] rounded-full bg-[var(--color-brand-gold)]" />
                )}

                {/* Event Indicators (Default) */}
                {!isMini && appointmentCount > 0 && (
                  <span className={cn(
                    'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                    isSelected ? 'bg-neo-accent' : 'bg-neo-success'
                  )} />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Legend (Only for Default) */}
      {!isMini && (
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-neo-text-secondary/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neo-success" />
            <span className="text-xs text-neo-text-secondary">Agendamentos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neo-bg shadow-neo-out ring-2 ring-neo-accent/30" />
            <span className="text-xs text-neo-text-secondary">Hoje</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Time Slots Component
interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSlotSelect: (time: string) => void;
  appointments: Appointment[];
  className?: string;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  appointments,
  className,
}) => {
  const getAppointmentForSlot = (time: string) => {
    return appointments.find(apt => apt.time === time);
  };

  return (
    <div className={cn('bg-neo-bg rounded-neo p-4', className)}>
      <h4 className="text-sm font-semibold text-neo-text-secondary mb-4">Horários Disponíveis</h4>

      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const appointment = getAppointmentForSlot(slot.time);
          const isSelected = selectedSlot === slot.time;
          const isBooked = !!appointment;

          return (
            <motion.button
              key={slot.time}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isBooked && onSlotSelect(slot.time)}
              className={cn(
                'p-3 rounded-neo-sm text-center transition-all duration-200',
                isBooked
                  ? 'bg-neo-bg shadow-neo-pressed cursor-not-allowed'
                  : isSelected
                    ? 'bg-neo-bg shadow-neo-pressed border-2 border-neo-accent'
                    : 'bg-neo-bg shadow-neo-out hover:shadow-neo-out-lg',
                isSelected && 'text-neo-accent'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                isBooked ? 'text-neo-text-secondary' : 'text-neo-text'
              )}>
                {formatTime(slot.time)}
              </span>
              {isBooked && appointment && (
                <div className="mt-1">
                  <Badge variant="warning" className="text-[10px] px-1 py-0.5">
                    {appointment.clientName.split(' ')[0]}
                  </Badge>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {slots.every(s => getAppointmentForSlot(s.time)) && (
        <div className="text-center py-8 text-neo-text-secondary text-sm">
          Nenhum horário disponível para este dia
        </div>
      )}
    </div>
  );
};

// Day View Schedule
interface DayScheduleProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onAddAppointment?: (time: string) => void;
  className?: string;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  date,
  appointments,
  onAppointmentClick,
  onAddAppointment,
  className,
}) => {
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className={cn('bg-neo-bg rounded-neo', className)}>
      {/* Date Header */}
      <div className="p-4 border-b border-neo-text-secondary/10">
        <h3 className="text-lg font-semibold text-neo-text">
          {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h3>
        <p className="text-sm text-neo-text-secondary">
          {sortedAppointments.length} agendamento{sortedAppointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
        {timeSlots.map((time) => {
          const appointment = sortedAppointments.find(apt => apt.time === time);
          const isCurrentHour = time.endsWith(':00') &&
            new Date().getHours() === parseInt(time.split(':')[0]);

          return (
            <div key={time} className="flex gap-3">
              {/* Time Label */}
              <div className="w-14 pt-1">
                <span className={cn(
                  'text-xs font-medium',
                  isCurrentHour ? 'text-neo-accent' : 'text-neo-text-secondary'
                )}>
                  {time.endsWith(':00') ? time.replace(':00', 'h') : ''}
                </span>
              </div>

              {/* Slot Content */}
              <div className="flex-1">
                {appointment ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onAppointmentClick?.(appointment)}
                    className={cn(
                      'p-3 rounded-neo shadow-neo-in cursor-pointer',
                      'active:scale-[0.98] transition-transform'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-neo-text">{appointment.clientName}</p>
                        <p className="text-xs text-neo-text-secondary mt-1">
                          {appointment.services.join(', ')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          appointment.status === 'confirmed' ? 'success' :
                            appointment.status === 'pending' ? 'warning' :
                              appointment.status === 'completed' ? 'info' : 'danger'
                        }
                      >
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                          appointment.status === 'pending' ? 'Pendente' :
                            appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neo-text-secondary">
                      <span>{formatTime(appointment.time)}</span>
                      <span>R$ {appointment.totalAmount.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => onAddAppointment?.(time)}
                    className="w-full p-3 rounded-neo shadow-neo-out text-left text-sm text-neo-text-secondary hover:text-neo-text transition-colors"
                  >
                    + Adicionar agendamento
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
