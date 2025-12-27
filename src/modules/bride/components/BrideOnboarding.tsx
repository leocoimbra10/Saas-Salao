import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    ChevronRight,
    Heart,
    Stars
} from 'lucide-react';
import { Card, Button, Input } from '../../../shared/components/ui/NeoComponents';
import { cn } from '../../../shared/lib/utils';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

interface BrideOnboardingProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    onComplete: (data: any) => void;
}

export const BrideOnboarding: React.FC<BrideOnboardingProps> = ({
    isOpen,
    onClose,
    clientId,
    onComplete
}) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        weddingDate: '',
        ceremonyTime: '',
        location: '',
        notes: ''
    });

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
        else onComplete(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#FFF5F7]/80 backdrop-blur-md z-[70] flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-xl border border-pink-100 p-10 overflow-hidden relative"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 text-pink-200">
                        <Heart size={120} className=" opacity-10" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-gray-800">Personalize sua Jornada</h2>
                                <p className="text-sm text-pink-400 font-medium">Faltam poucos passos para o seu grande dia</p>
                            </div>
                        </div>

                        {step === 1 ? (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100/50">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <Calendar size={18} className="text-pink-500" />
                                        Data & Hora
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Data do Casamento"
                                            type="date"
                                            value={formData.weddingDate}
                                            onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                                            className="bg-white"
                                        />
                                        <Input
                                            label="Hora da Cerimônia"
                                            type="time"
                                            value={formData.ceremonyTime}
                                            onChange={(e) => setFormData({ ...formData, ceremonyTime: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100/50">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <MapPin size={18} className="text-pink-500" />
                                        Onde será o sonho?
                                    </h3>
                                    <Input
                                        label="Local da Cerimônia/Festa"
                                        placeholder="Nome do buffet ou igreja"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="bg-white"
                                    />
                                    <div className="mt-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Observações Especiais</label>
                                        <textarea
                                            className="w-full h-32 p-4 rounded-2xl bg-white border border-pink-100 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none text-gray-700"
                                            placeholder="Conte-nos algum detalhe importante..."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="mt-10 flex gap-4">
                            {step > 1 && (
                                <Button
                                    variant="ghost"
                                    className="flex-1 py-4 rounded-full border border-pink-100 text-pink-400"
                                    onClick={() => setStep(1)}
                                >
                                    Voltar
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                className="flex-[2] py-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200"
                                onClick={handleNext}
                            >
                                {step === 1 ? 'Continuar' : 'Finalizar Mágica'}
                                <ChevronRight className="ml-2" size={20} />
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-8 text-pink-300">
                            <Stars size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Sua jornada de noiva começa aqui</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
