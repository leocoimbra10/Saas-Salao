import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { Appointment, Service } from '../../../shared/types/types';
import { formatCurrency } from '../../../shared/lib/utils';

interface AgendaCardProps {
    appointment: Appointment;
    services: Service[];
    onClick: (apt: Appointment) => void;
    staffName?: string;
}

// Service color mapping
const SERVICE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    'maquiagem': {
        bg: 'bg-pink-50',
        border: 'border-l-[#E8A0B8]',
        text: 'text-pink-700',
        badge: 'bg-pink-100 border-pink-300 text-pink-700'
    },
    'cabelo': {
        bg: 'bg-purple-50',
        border: 'border-l-[#9B87C6]',
        text: 'text-purple-700',
        badge: 'bg-purple-100 border-purple-300 text-purple-700'
    },
    'noiva': {
        bg: 'bg-amber-50',
        border: 'border-l-[#D4AF37]',
        text: 'text-amber-700',
        badge: 'bg-amber-100 border-amber-300 text-amber-700'
    },
    'depilação': {
        bg: 'bg-teal-50',
        border: 'border-l-[#5DADE2]',
        text: 'text-teal-700',
        badge: 'bg-teal-100 border-teal-300 text-teal-700'
    },
    'estética': {
        bg: 'bg-green-50',
        border: 'border-l-[#82E0AA]',
        text: 'text-green-700',
        badge: 'bg-green-100 border-green-300 text-green-700'
    },
    'default': {
        bg: 'bg-neo-bg',
        border: 'border-l-neo-accent',
        text: 'text-neo-accent',
        badge: 'bg-neo-accent/10 border-neo-accent/20 text-neo-accent'
    }
};

function getServiceColor(serviceName: string): typeof SERVICE_COLORS['default'] {
    const normalized = serviceName.toLowerCase();
    for (const [key, value] of Object.entries(SERVICE_COLORS)) {
        if (normalized.includes(key)) {
            return value;
        }
    }
    return SERVICE_COLORS.default;
}

export const AgendaCard: React.FC<AgendaCardProps> = ({
    appointment,
    services,
    onClick,
    staffName
}) => {
    const serviceNames = appointment.services
        .map(sId => services.find(s => s.id === sId)?.name)
        .filter(Boolean)
        .join(', ');

    // Get first service for color coding
    const firstService = services.find(s => s.id === appointment.services[0]);
    const colors = getServiceColor(firstService?.name || '');
    const primaryCategory = firstService?.category || 'Geral';

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(appointment)}
            className="w-full mb-3 cursor-pointer group"
        >
            {/* Enhanced Neomorphic Container with Color Accent */}
            <div className={cn(
                "relative flex items-center p-4 rounded-neo overflow-hidden",
                "bg-neo-bg shadow-neo-out border border-white/50",
                "border-l-4", colors.border,
                "group-hover:translate-y-[-2px] group-hover:shadow-neo-out-lg transition-all duration-300"
            )}>

                {/* Left Side: Time Slot */}
                <div className="flex flex-col items-center justify-center pr-4 min-w-[4.5rem]">
                    <span className="text-xl font-bold tracking-widest text-neo-accent font-serif">
                        {appointment.time}
                    </span>
                </div>

                {/* Center Divider */}
                <div className="w-px h-10 bg-neo-text-secondary/20 mx-2" />

                {/* Center Side: Client & Service */}
                <div className="flex-1 px-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-neo-text tracking-tight">
                            {appointment.clientName}
                        </span>
                        {/* Secured Badge */}
                        {appointment.depositPaid > 0 && (
                            <div className="px-2 py-0.5 rounded-full bg-neo-accent/10 border border-neo-accent/20 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-neo-accent tracking-widest uppercase">
                                    PAGO
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Service Category Badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className={cn(
                            "px-2 py-0.5 rounded-full border flex items-center justify-center",
                            colors.badge
                        )}>
                            <span className="text-[10px] font-bold tracking-wider uppercase">
                                {primaryCategory}
                            </span>
                        </div>
                    </div>

                    <span className="text-sm text-neo-text font-medium">
                        {serviceNames}
                    </span>
                </div>

                {/* Right Side: Avatar */}
                <div className="pl-4">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "bg-neo-bg shadow-neo-out text-neo-text-secondary"
                    )}>
                        {/* Placeholder for Staff Avatar logic */}
                        <User size={18} />
                    </div>
                </div>

            </div>
        </motion.div>
    );
};
