/**
 * BRIDE ONBOARDING MODAL
 * Glassmorphic modal to register wedding date and ceremony time
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    X,
    ChevronRight
} from 'lucide-react';
import { cn } from '../../../shared/lib/utils';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = 'var(--color-brand-gold)';

interface BrideOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: {
        weddingDate: Date;
        ceremonyTime: string;
        venue: string;
    }) => void;
    initialData?: {
        weddingDate?: Date;
        ceremonyTime?: string;
        venue?: string;
    };
}

export const BrideOnboardingModal: React.FC<BrideOnboardingModalProps> = ({
    isOpen,
    onClose,
    onComplete,
    initialData
}) => {
    const [step, setStep] = useState(1);
    const [weddingDate, setWeddingDate] = useState<string>(
        initialData?.weddingDate
            ? initialData.weddingDate.toISOString().split('T')[0]
            : ''
    );
    const [ceremonyTime, setCeremonyTime] = useState(initialData?.ceremonyTime || '');
    const [venue, setVenue] = useState(initialData?.venue || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!weddingDate || !ceremonyTime) return;

        setIsSubmitting(true);
        try {
            await onComplete({
                weddingDate: new Date(weddingDate),
                ceremonyTime,
                venue
            });
            onClose();
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = step === 1 ? !!weddingDate : !!ceremonyTime;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={cn(
                        "relative w-full max-w-md rounded-3xl overflow-hidden",
                        "bg-white/15 backdrop-blur-2xl border border-white/20",
                        "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    )}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="p-6 pb-4 text-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)`,
                                boxShadow: `0 0 30px ${ROSE}60`
                            }}
                        >
                            <Sparkles size={28} className="text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-display font-bold text-white mb-1">
                            {step === 1 ? 'Quando é o Grande Dia?' : 'Detalhes da Cerimônia'}
                        </h2>
                        <p className="text-white/60 text-sm">
                            {step === 1
                                ? 'Vamos começar sua jornada de noiva!'
                                : 'Para montar seu cronograma perfeito'}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    s === step ? "w-6" : "",
                                    s <= step ? "bg-white" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Wedding Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                            <Calendar size={16} style={{ color: ROSE }} />
                                            Data do Casamento
                                        </label>
                                        <input
                                            type="date"
                                            value={weddingDate}
                                            onChange={(e) => setWeddingDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl text-white",
                                                "bg-white/10 border border-white/20",
                                                "focus:outline-none focus:ring-2",
                                                "placeholder:text-white/40"
                                            )}
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Ceremony Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                            <Clock size={16} style={{ color: ROSE }} />
                                            Horário da Cerimônia
                                        </label>
                                        <input
                                            type="time"
                                            value={ceremonyTime}
                                            onChange={(e) => setCeremonyTime(e.target.value)}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl text-white text-lg",
                                                "bg-white/10 border border-white/20",
                                                "focus:outline-none focus:ring-2",
                                            )}
                                            style={{ colorScheme: 'dark' }}
                                        />
                                        <p className="text-xs text-white/50 mt-1">
                                            Usamos isso para calcular o cronograma de beleza
                                        </p>
                                    </div>

                                    {/* Venue */}
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                            <MapPin size={16} style={{ color: ROSE }} />
                                            Local da Cerimônia (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={venue}
                                            onChange={(e) => setVenue(e.target.value)}
                                            placeholder="Ex: Espaço Villa Real"
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl text-white",
                                                "bg-white/10 border border-white/20",
                                                "focus:outline-none focus:ring-2",
                                                "placeholder:text-white/40"
                                            )}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 rounded-xl font-medium text-white/70 bg-white/10 border border-white/20 transition-all hover:bg-white/20"
                                >
                                    Voltar
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (step === 1) {
                                        setStep(2);
                                    } else {
                                        handleSubmit();
                                    }
                                }}
                                disabled={!canProceed || isSubmitting}
                                className={cn(
                                    "flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all",
                                    !canProceed && "opacity-50 cursor-not-allowed"
                                )}
                                style={{
                                    background: canProceed
                                        ? `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)`
                                        : 'rgba(255,255,255,0.1)',
                                    boxShadow: canProceed ? `0 10px 30px -10px ${ROSE}80` : 'none'
                                }}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : step === 2 ? (
                                    <>
                                        <Sparkles size={18} />
                                        Começar Jornada
                                    </>
                                ) : (
                                    <>
                                        Continuar
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BrideOnboardingModal;
