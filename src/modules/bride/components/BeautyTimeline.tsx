/**
 * BEAUTY TIMELINE DISPLAY
 * Visual timeline for wedding day beauty schedule
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Crown, User, Sparkles, Check } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { BeautyTimelineSlot } from '../../../bride/services/brideIntelligence';

// Brand Colors
const ROSE = '#E8A0B8';
const GOLD = '#D4AF37';

interface BeautyTimelineProps {
    slots: BeautyTimelineSlot[];
    weddingDate?: Date;
    onSlotClick?: (slot: BeautyTimelineSlot) => void;
}

const getClientTypeStyle = (type: BeautyTimelineSlot['clientType']) => {
    switch (type) {
        case 'bride':
            return {
                color: GOLD,
                bg: 'from-amber-500/30 to-pink-500/20',
                icon: Crown,
                label: 'Noiva'
            };
        case 'mother':
            return {
                color: ROSE,
                bg: 'from-pink-500/20 to-rose-500/10',
                icon: Sparkles,
                label: 'Mãe'
            };
        default:
            return {
                color: '#8b5cf6',
                bg: 'from-violet-500/20 to-purple-500/10',
                icon: User,
                label: 'Madrinha'
            };
    }
};

const getStatusBadge = (status: BeautyTimelineSlot['status']) => {
    switch (status) {
        case 'completed':
            return { label: 'Concluído', color: 'bg-green-100 text-green-600' };
        case 'in_progress':
            return { label: 'Em Andamento', color: 'bg-blue-100 text-blue-600' };
        case 'confirmed':
            return { label: 'Confirmado', color: 'bg-amber-100 text-amber-600' };
        default:
            return { label: 'Pendente', color: 'bg-gray-100 text-gray-600' };
    }
};

export const BeautyTimeline: React.FC<BeautyTimelineProps> = ({
    slots,
    weddingDate,
    onSlotClick
}) => {
    if (slots.length === 0) {
        return (
            <div className="p-6 text-center rounded-2xl bg-neo-bg shadow-neo-in">
                <Clock size={32} className="mx-auto mb-2 text-neo-text-secondary/50" />
                <p className="text-sm text-neo-text-secondary">
                    Cronograma será gerado quando definir o horário da cerimônia
                </p>
            </div>
        );
    }

    return (
        <section className="mb-6">
            <h2 className="text-subtitle flex items-center gap-2 mb-4">
                <Clock size={18} style={{ color: GOLD }} />
                Cronograma de Beleza
                {weddingDate && (
                    <span className="text-xs text-neo-text-secondary ml-auto">
                        {weddingDate.toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short'
                        })}
                    </span>
                )}
            </h2>

            <div className="relative">
                {/* Timeline Line */}
                <div
                    className="absolute left-5 top-4 bottom-4 w-0.5"
                    style={{ backgroundColor: `${ROSE}30` }}
                />

                <div className="space-y-3">
                    {slots.map((slot, index) => {
                        const style = getClientTypeStyle(slot.clientType);
                        const statusBadge = getStatusBadge(slot.status);
                        const Icon = style.icon;
                        const isBride = slot.clientType === 'bride';

                        return (
                            <motion.div
                                key={slot.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSlotClick?.(slot)}
                                className={cn(
                                    "relative pl-12 pr-4 py-3 rounded-xl cursor-pointer transition-all",
                                    "bg-gradient-to-br backdrop-blur-sm",
                                    style.bg,
                                    isBride ? "ring-2" : "",
                                    "hover:shadow-lg"
                                )}
                                style={{
                                    ringColor: isBride ? GOLD : 'transparent'
                                }}
                            >
                                {/* Timeline Dot */}
                                <div
                                    className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2",
                                        "w-5 h-5 rounded-full flex items-center justify-center",
                                        slot.status === 'completed' ? "bg-green-500" : ""
                                    )}
                                    style={{
                                        backgroundColor: slot.status !== 'completed' ? style.color : undefined
                                    }}
                                >
                                    {slot.status === 'completed' ? (
                                        <Check size={12} className="text-white" />
                                    ) : (
                                        <Icon size={10} className="text-white" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-lg font-bold"
                                                style={{ color: style.color }}
                                            >
                                                {slot.startTime}
                                            </span>
                                            <span className="text-xs text-neo-text-secondary">
                                                até {slot.endTime}
                                            </span>
                                        </div>
                                        <p className="font-medium text-neo-text text-sm truncate">
                                            {slot.clientName}
                                        </p>
                                        <p className="text-[11px] text-neo-text-secondary truncate">
                                            {slot.services.join(' • ')}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-[10px] font-medium",
                                            statusBadge.color
                                        )}>
                                            {statusBadge.label}
                                        </span>
                                        {slot.staffName && (
                                            <p className="text-[10px] text-neo-text-secondary mt-1">
                                                {slot.staffName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Bride Special Indicator */}
                                {isBride && (
                                    <div
                                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)`,
                                            boxShadow: `0 0 10px ${GOLD}60`
                                        }}
                                    >
                                        <Crown size={12} className="text-white" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BeautyTimeline;
