/**
 * BEAUTY SALON NEOMORPHIC APP - Utility Functions
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parse, addMinutes, isWithinInterval, areIntervalsOverlapping } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export { format, parse, addMinutes, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(d, 'dd/MM/yyyy');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}h${minutes}`;
}

export function getWeekday(date: Date | string): number {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return d.getDay();
}

export function isWeekdayDiscount(day: number): boolean {
  return [1, 2, 3, 4].includes(day); // Monday to Thursday
}

export function calculateServiceDuration(serviceIds: string[], services: { id: string; duration: number }[]): number {
  return serviceIds.reduce((total, id) => {
    const service = services.find(s => s.id === id);
    return total + (service?.duration || 0);
  }, 0);
}

export function calculateTotalPrice(
  serviceIds: string[],
  services: { id: string; price: number }[],
  isWeekday: boolean
): { subtotal: number; discount: number; total: number } {
  const subtotal = serviceIds.reduce((total, id) => {
    const service = services.find(s => s.id === id);
    return total + (service?.price || 0);
  }, 0);

  const discount = isWeekday ? subtotal * 0.10 : 0;
  const total = subtotal - discount;

  return { subtotal, discount, total };
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 19,
  interval: number = 30
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
}

export function isSlotAvailable(
  slotTime: string,
  duration: number,
  bookedAppointments: { time: string; duration: number }[]
): boolean {
  const slotStart = parse(slotTime, 'HH:mm', new Date());
  const slotEnd = addMinutes(slotStart, duration);

  for (const apt of bookedAppointments) {
    const aptStart = parse(apt.time, 'HH:mm', new Date());
    const aptEnd = addMinutes(aptStart, apt.duration + 15); // Add turnover buffer

    if (areIntervalsOverlapping(
      { start: slotStart, end: slotEnd },
      { start: aptStart, end: aptEnd }
    )) {
      return false;
    }
  }
  return true;
}

export function formatWhatsAppMessage(appointment: {
  clientName: string;
  date: string;
  time: string;
  services: string[];
  totalAmount: number;
  status: string;
}): string {
  const message = `Olá ${appointment.clientName}! 👋

Seu agendamento foi ${appointment.status === 'confirmed' ? 'confirmado' : 'realizado'}!

📅 Data: ${formatDate(appointment.date)}
⏰ Horário: ${appointment.time}
💅 Serviços: ${appointment.services.join(', ')}
💰 Total: ${formatCurrency(appointment.totalAmount)}

Em breve retornamos com mais detalhes.`;
  return encodeURIComponent(message);
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/55${cleanPhone}?text=${message}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'neo-badge-success';
    case 'pending':
      return 'neo-badge-warning';
    case 'completed':
      return 'neo-badge-info';
    case 'cancelled':
      return 'neo-badge-danger';
    default:
      return 'neo-badge-info';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const STATS_INITIAL = {
  monthlyRevenue: 0,
  monthlyAppointments: 0,
  clientRetention: 0,
  topServices: [],
  revenueByDay: [],
};
