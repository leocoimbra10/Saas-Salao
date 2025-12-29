/**
 * PAYMENT PAGE
 * Public page for clients to view appointment details and make payment
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    CreditCard,
    Timer,
    CheckCircle,
    XCircle,
    Crown,
    Sparkles,
    MessageCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../shared/lib/utils';
import { getPaymentLink, updatePaymentStatus, isPaymentLinkExpired } from '../services/paymentService';
import type { PaymentLink } from '../services/paymentService';

export const PaymentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (id) {
            loadPaymentLink(id);
        }
    }, [id]);

    const loadPaymentLink = async (linkId: string) => {
        try {
            setIsLoading(true);
            const link = await getPaymentLink(linkId);

            if (!link) {
                setError('Link de pagamento não encontrado');
                return;
            }

            // Check if expired
            if (isPaymentLinkExpired(link)) {
                await updatePaymentStatus(linkId, 'expired');
                link.status = 'expired';
            }

            setPaymentLink(link);
        } catch (err) {
            console.error('Error loading payment link:', err);
            setError('Erro ao carregar informações do pagamento');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!paymentLink) return;

        setIsProcessing(true);
        try {
            // In a real app, integrate with payment gateway (Stripe, MercadoPago, etc.)
            // For now, simulate payment
            await new Promise(resolve => setTimeout(resolve, 2000));

            await updatePaymentStatus(paymentLink.id, 'paid');
            setPaymentLink({ ...paymentLink, status: 'paid' });
        } catch (err) {
            console.error('Payment error:', err);
            alert('Erro ao processar pagamento. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neo-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neo-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neo-text-secondary">Carregando...</p>
                </div>
            </div>
        );
    }

    if (error || !paymentLink) {
        return (
            <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center p-8 rounded-neo bg-neo-bg shadow-neo-out">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif text-neo-text mb-2">Ops!</h2>
                    <p className="text-neo-text-secondary">{error || 'Link inválido'}</p>
                </div>
            </div>
        );
    }

    const isBride = paymentLink.clientType === 'bride';
    const timeRemaining = paymentLink.paymentDeadline.getTime() - new Date().getTime();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

    return (
        <div className="min-h-screen bg-neo-bg p-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={cn(
                        "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg",
                        isBride
                            ? "bg-gradient-to-br from-brand-primary to-brand-gold"
                            : "bg-gradient-to-br from-purple-400 to-pink-400"
                    )}>
                        {isBride ? (
                            <Crown className="text-white" size={40} />
                        ) : (
                            <Sparkles className="text-white" size={40} />
                        )}
                    </div>
                    <h1 className="text-3xl font-serif text-neo-text mb-2">
                        {isBride ? 'Pacote Noiva' : 'Agendamento'}
                    </h1>
                    <p className="text-neo-text-secondary">
                        Salão de Beleza - Reserva Confirmada
                    </p>
                </div>

                {/* Status Banner */}
                {paymentLink.status === 'paid' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-neo bg-green-50 shadow-neo-out border border-green-200 flex items-center gap-3"
                    >
                        <CheckCircle className="text-green-600" size={24} />
                        <div>
                            <p className="font-semibold text-green-900">Pagamento Confirmado!</p>
                            <p className="text-sm text-green-700">Seu agendamento está garantido</p>
                        </div>
                    </motion.div>
                )}

                {paymentLink.status === 'expired' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-neo bg-red-50 shadow-neo-out border border-red-200 flex items-center gap-3"
                    >
                        <XCircle className="text-red-600" size={24} />
                        <div>
                            <p className="font-semibold text-red-900">Link Expirado</p>
                            <p className="text-sm text-red-700">Entre em contato com o salão para reagendar</p>
                        </div>
                    </motion.div>
                )}

                {paymentLink.status === 'pending' && hoursRemaining > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-neo bg-yellow-50 shadow-neo-out border border-yellow-200 flex items-center gap-3"
                    >
                        <Timer className="text-yellow-600" size={24} />
                        <div>
                            <p className="font-semibold text-yellow-900">Tempo Restante</p>
                            <p className="text-sm text-yellow-700">
                                {hoursRemaining}h restantes para confirmar o pagamento
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Client Info */}
                <div className="mb-6 p-6 rounded-neo bg-neo-bg shadow-neo-out">
                    <h3 className="text-lg font-serif text-neo-text mb-4">Informações do Cliente</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className="text-neo-text-secondary" size={18} />
                            <span className="text-neo-text">{paymentLink.clientName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="text-neo-text-secondary" size={18} />
                            <span className="text-neo-text">{paymentLink.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="text-neo-text-secondary" size={18} />
                            <span className="text-neo-text">{paymentLink.clientPhone}</span>
                        </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="mb-6 p-6 rounded-neo bg-neo-bg shadow-neo-out">
                    <h3 className="text-lg font-serif text-neo-text mb-4">Detalhes do Agendamento</h3>
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-neo-text-secondary" size={18} />
                            <span className="text-neo-text">
                                {format(new Date(paymentLink.appointmentDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-neo-text-secondary" size={18} />
                            <span className="text-neo-text">{paymentLink.appointmentTime}</span>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="mt-4 pt-4 border-t border-neo-text-secondary/10">
                        <h4 className="text-sm font-semibold text-neo-text mb-3">Serviços</h4>
                        <div className="space-y-2">
                            {paymentLink.services.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-neo-text">{service.name}</span>
                                    <span className="text-sm font-semibold text-neo-text">
                                        R$ {service.price.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-6 p-6 rounded-neo bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-[var(--color-brand-gold)]/10 shadow-neo-out border border-neo-accent/20">
                    <h3 className="text-lg font-serif text-neo-text mb-4">Resumo do Pagamento</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-neo-text-secondary">Valor Total</span>
                            <span className="text-lg font-semibold text-neo-text">
                                R$ {paymentLink.totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-neo-text-secondary/20">
                            <span className="text-neo-text font-medium">Sinal a Pagar (30%)</span>
                            <span className="text-2xl font-bold text-neo-accent">
                                R$ {paymentLink.depositAmount.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-neo-text-secondary mt-2">
                            * Restante será pago no dia do atendimento
                        </p>
                    </div>
                </div>

                {/* Payment Button */}
                {paymentLink.status === 'pending' && !isPaymentLinkExpired(paymentLink) && (
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={cn(
                            "w-full py-4 rounded-neo font-semibold text-white transition-all",
                            "bg-gradient-to-br from-brand-primary to-brand-gold",
                            "shadow-neo-out hover:shadow-neo-in",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processando...
                            </>
                        ) : (
                            <>
                                <CreditCard size={20} />
                                Pagar Sinal - R$ {paymentLink.depositAmount.toFixed(2)}
                            </>
                        )}
                    </button>
                )}

                {paymentLink.status === 'paid' && (
                    <div className="text-center p-4">
                        <p className="text-sm text-neo-text-secondary mb-4">
                            Nos vemos no dia {format(new Date(paymentLink.appointmentDate), "d 'de' MMMM", { locale: ptBR })}! 💜
                        </p>

                        <button
                            onClick={() => {
                                const phone = "5511999999999"; // TODO: Use env var
                                const message = `Olá! Acabei de confirmar o agendamento de ${paymentLink.services.map(s => s.name).join(', ')} para ${format(new Date(paymentLink.appointmentDate), "dd/MM", { locale: ptBR })} às ${paymentLink.appointmentTime}.`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className={cn(
                                "w-full py-3 rounded-neo font-semibold text-white transition-all",
                                "bg-[#25D366] hover:bg-[#128C7E]",
                                "shadow-neo-out hover:shadow-neo-in",
                                "flex items-center justify-center gap-2"
                            )}
                        >
                            <MessageCircle size={20} />
                            Confirmar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
