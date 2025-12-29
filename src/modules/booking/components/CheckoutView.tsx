import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    QrCode,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import { NeoCard, NeoButton, Badge } from '../../../shared/components/ui/NeoComponents';
import { cn, formatCurrency } from '../../../shared/lib/utils';

interface CheckoutViewProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    appointmentId: string;
    onSuccess: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
    isOpen,
    onClose,
    amount,
    appointmentId,
    onSuccess
}) => {
    const [method, setMethod] = useState<'pix' | 'card'>('pix');
    const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

    const signalAmount = amount * 0.3;
    const remainingAmount = amount * 0.7;

    const handlePayment = () => {
        setStep('processing');
        // Simulate payment delay
        setTimeout(() => {
            setStep('success');
            setTimeout(onSuccess, 2000);
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {step === 'selection' && (
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <button onClick={onClose} className="p-2 rounded-full bg-neo-bg shadow-neo-out">
                                    <ArrowLeft size={18} />
                                </button>
                                <h2 className="text-xl font-bold text-neo-text">Pagamento do Sinal</h2>
                            </div>

                            {/* Summary Card */}
                            <div className="p-6 rounded-3xl bg-neo-accent/5 border border-neo-accent/10 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-neo-text-secondary">Total do Serviço</span>
                                    <span className="font-semibold text-neo-text">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-neo-accent/10">
                                    <span className="text-neo-text font-medium">Sinal (30%)</span>
                                    <span className="text-2xl font-bold text-neo-accent">{formatCurrency(signalAmount)}</span>
                                </div>
                                <p className="text-[10px] text-neo-text-secondary text-center mt-2">
                                    O restante ({formatCurrency(remainingAmount)}) será pago no dia do serviço.
                                </p>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-3 mb-8">
                                <button
                                    onClick={() => setMethod('pix')}
                                    className={cn(
                                        "w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2",
                                        method === 'pix'
                                            ? "bg-neo-accent/10 border-neo-accent shadow-neo-in"
                                            : "bg-neo-bg border-transparent shadow-neo-out"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-neo-success/10 text-neo-success flex items-center justify-center">
                                        <QrCode size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-neo-text">PIX</p>
                                        <p className="text-xs text-neo-text-secondary">Confirmação instantânea</p>
                                    </div>
                                    <div className={cn("w-5 h-5 rounded-full border-2", method === 'pix' ? "border-neo-accent bg-neo-accent" : "border-neo-text-secondary/30")} />
                                </button>

                                <button
                                    onClick={() => setMethod('card')}
                                    className={cn(
                                        "w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2",
                                        method === 'card'
                                            ? "bg-neo-accent/10 border-neo-accent shadow-neo-in"
                                            : "bg-neo-bg border-transparent shadow-neo-out"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-neo-accent/10 text-neo-accent flex items-center justify-center">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-neo-text">Cartão de Crédito</p>
                                        <p className="text-xs text-neo-text-secondary">Até 12x no cartão</p>
                                    </div>
                                    <div className={cn("w-5 h-5 rounded-full border-2", method === 'card' ? "border-neo-accent bg-neo-accent" : "border-neo-text-secondary/30")} />
                                </button>
                            </div>

                            <NeoButton
                                variant="gradient"
                                className="w-full py-4 rounded-full text-lg shadow-neo-out-lg"
                                onClick={handlePayment}
                            >
                                Pagar Agora
                                <ChevronRight className="ml-2" size={20} />
                            </NeoButton>

                            <div className="flex items-center justify-center gap-2 mt-6 text-neo-text-secondary">
                                <ShieldCheck size={14} className="text-neo-success" />
                                <span className="text-[10px] uppercase tracking-wider font-semibold">Ambiente Seguro & Criptografado</span>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="p-12 text-center">
                            <div className="relative w-20 h-20 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-neo-accent/20 rounded-full" />
                                <motion.div
                                    className="absolute inset-0 border-4 border-neo-accent rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-neo-text mb-2">Processando...</h2>
                            <p className="text-neo-text-secondary">Estamos confirmando sua transação com segurança.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-neo-success/10 text-neo-success rounded-full flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-neo-text mb-2">Pagamento Confirmado!</h2>
                            <p className="text-neo-text-secondary mb-8">Seu agendamento foi garantido. Prepare-se para brilhar!</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
