/**
 * SMART UPSELL COMPONENT (Marcela AI)
 * Displays personalized service recommendations during the booking process.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';
import { NeoCard, NeoButton } from './NeoComponents';
import { getSmartUpsell, AISuggestion } from '../../services/AIService';

interface SmartUpsellProps {
    selectedServices: string[];
    onAddService: (serviceId: string) => void;
}

export const SmartUpsell: React.FC<SmartUpsellProps> = ({ selectedServices, onAddService }) => {
    const suggestion = getSmartUpsell(selectedServices);

    if (!suggestion) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6"
            >
                <NeoCard className="p-5 border-2 border-neo-accent/30 bg-gradient-to-br from-neo-bg to-neo-accent/5 overflow-hidden relative">
                    {/* AI Badge */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-neo-accent text-white text-[10px] font-bold rounded-bl-neo shadow-sm flex items-center gap-1">
                        <Sparkles size={12} />
                        MARCELA AI
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-white shadow-neo-out flex items-center justify-center text-neo-accent flex-shrink-0">
                            <TrendingUp size={24} />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-neo-text text-sm mb-1">{suggestion.title}</h4>
                            <p className="text-xs text-neo-text-secondary leading-relaxed mb-3">
                                {suggestion.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-neo-accent font-bold uppercase tracking-widest">
                                    + RECOMENDADO
                                </span>
                                <NeoButton
                                    size="sm"
                                    variant="glass"
                                    className="h-8 px-4 text-xs"
                                    onClick={() => onAddService(suggestion.serviceId)}
                                >
                                    <Plus size={14} /> Adicionar
                                </NeoButton>
                            </div>
                        </div>
                    </div>

                    {/* Subtle Glow Background */}
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-neo-accent/10 blur-3xl rounded-full" />
                </NeoCard>
            </motion.div>
        </AnimatePresence>
    );
};
