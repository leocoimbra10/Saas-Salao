/**
 * WAITLIST BUTTON COMPONENT
 * Shows an "Avisar-me" button when slots are full.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Button, Card, Input } from '../../../shared/components/ui/NeoComponents';
import { addToWaitlist } from '../services/WaitlistService';

interface WaitlistButtonProps {
    serviceId: string;
    date: string;
}

export const WaitlistButton: React.FC<WaitlistButtonProps> = ({ serviceId, date }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [phone, setPhone] = useState('');

    const handleJoin = async () => {
        setLoading(true);
        await addToWaitlist({
            clientName: 'Cliente Interessada', // Should come from context if logged in
            clientPhone: phone,
            serviceId,
            preferredDate: date
        });
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            setIsOpen(false);
            setSuccess(false);
        }, 2000);
    };

    return (
        <div className="mt-4">
            <Button
                variant="ghost"
                className="w-full gap-2 text-neo-accent border border-neo-accent/20"
                onClick={() => setIsOpen(true)}
            >
                <Bell size={18} /> Entrar na Lista de Espera
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
                    >
                        <Card className="w-full max-w-sm p-6 space-y-4">
                            <h3 className="text-lg font-bold text-neo-text">Fique sabendo primeiro!</h3>
                            <p className="text-sm text-neo-text-secondary">
                                Se alguém cancelar no dia {date}, avisaremos você via WhatsApp imediatamente.
                            </p>

                            <Input
                                label="Seu WhatsApp"
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" className="flex-1" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={handleJoin}
                                    disabled={loading || success || !phone}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : success ? <Check /> : 'Confirmar'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
