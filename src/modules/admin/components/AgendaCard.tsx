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

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(appointment)}
            className="w-full mb-3 cursor-pointer group"
        >
            {/* Standard Neomorphic Container */}
            <div className={cn(
                "relative flex items-center p-4 rounded-neo overflow-hidden",
                "bg-neo-bg shadow-neo-out border border-white/50", // Standard Neo
                "group-hover:translate-y-[-2px] transition-all duration-300"
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
                    <div className="flex items-center gap-2 mb-0.5">
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
                    <span className="text-sm text-neo-text-secondary font-medium">
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
