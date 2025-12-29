/**
 * BRIDE ALERTS/NOTIFICATIONS DISPLAY
 * Elegant glassmorphic notifications for the bridal journey
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Bell, AlertTriangle, Lightbulb, Calendar } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { BrideNotification } from '../../../bride/services/brideIntelligence';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = 'var(--color-brand-gold)';

interface BrideAlertsProps {
    notifications: BrideNotification[];
    onComplete: (id: string) => void;
    title?: string;
    showAll?: boolean;
}

const getNotificationStyle = (type: BrideNotification['type'], priority: BrideNotification['priority']) => {
    const baseStyle = {
        task: { icon: Calendar, color: ROSE, bg: 'from-pink-500/20 to-pink-600/10' },
        reminder: { icon: Bell, color: GOLD, bg: 'from-amber-500/20 to-amber-600/10' },
        alert: { icon: AlertTriangle, color: '#ef4444', bg: 'from-red-500/20 to-red-600/10' },
        tip: { icon: Lightbulb, color: '#22c55e', bg: 'from-green-500/20 to-green-600/10' }
    };

    return baseStyle[type] || baseStyle.reminder;
};

export const BrideAlerts: React.FC<BrideAlertsProps> = ({
    notifications,
    onComplete,
    title = 'Sua Jornada',
    showAll = false
}) => {
    const displayNotifications = showAll ? notifications : notifications.slice(0, 3);

    if (notifications.length === 0) {
        return (
            <div className="p-6 text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Bell size={32} className="mx-auto mb-2 text-neo-text-secondary/50" />
                <p className="text-sm text-neo-text-secondary">Nenhuma tarefa pendente</p>
            </div>
        );
    }

    return (
        <section className="mb-6">
            <h2 className="text-subtitle flex items-center gap-2 mb-4">
                <Bell size={18} style={{ color: GOLD }} />
                {title}
            </h2>

            <div className="space-y-3">
                {displayNotifications.map((notification, index) => {
                    const style = getNotificationStyle(notification.type, notification.priority);
                    const Icon = style.icon;
                    const triggerDate = notification.triggerDate instanceof Date
                        ? notification.triggerDate
                        : (notification.triggerDate as any).toDate();

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-4 rounded-xl overflow-hidden",
                                "bg-gradient-to-br",
                                style.bg,
                                "backdrop-blur-sm border border-white/10",
                                "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                            )}
                        >
                            <div className="flex gap-3">
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: `${style.color}20`,
                                        color: style.color
                                    }}
                                >
                                    {notification.icon ? (
                                        <span className="text-lg">{notification.icon}</span>
                                    ) : (
                                        <Icon size={18} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-neo-text text-sm">
                                            {notification.title}
                                        </h3>
                                        {notification.priority === 'high' && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-red-600 bg-red-100">
                                                Urgente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-neo-text-secondary mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-neo-text-secondary/70 mt-2">
                                        {format(triggerDate, "d 'de' MMMM", { locale: ptBR })}
                                    </p>
                                </div>

                                {/* Complete Button */}
                                {!notification.isCompleted && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onComplete(notification.id!)}
                                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 hover:bg-white/30 transition-colors"
                                    >
                                        <Check size={16} className="text-neo-text" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {!showAll && notifications.length > 3 && (
                <button className="w-full mt-3 py-2 text-sm text-center text-neo-accent font-medium">
                    Ver todas ({notifications.length})
                </button>
            )}
        </section>
    );
};

export default BrideAlerts;
