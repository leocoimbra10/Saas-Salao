/**
 * CHECKOUT PAGE - Integrated Payment Module
 * Style: Silent Luxury / Glass-Neomorphism / 3D Payments
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CreditCard,
    QrCode,
    Copy,
    Check,
    Shield,
    Lock,
    Sparkles,
    CheckCircle,
    Crown,
    ExternalLink
} from 'lucide-react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { paymentService } from '../services/paymentService';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { BrideOnboardingModal } from '../../bride/components/BrideOnboardingModal';
import { saveBrideJourney } from '../../bride/services/brideIntelligence';
import { NeoButton, NeoCard, Typography, Badge } from '../../../shared/components/ui/NeoComponents';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = 'var(--color-brand-gold)';

// Types
interface CheckoutData {
    totalAmount: number;
    depositPercentage: number;
    depositFixed?: number;
    depositType: 'percentage' | 'fixed';
    pixKey: string;
    serviceName: string;
    date: string;
    time: string;
    bookingId?: string;
    professional?: string;
}

// 3D Glass Credit Card Component
const GlassCreditCard: React.FC<{
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    isFlipped: boolean;
    onCardNumberChange: (v: string) => void;
    onCardNameChange: (v: string) => void;
    onExpiryChange: (v: string) => void;
    onCvvChange: (v: string) => void;
    onCvvFocus: () => void;
    onCvvBlur: () => void;
}> = ({
    cardNumber, cardName, expiry, cvv, isFlipped,
    onCardNumberChange, onCardNameChange, onExpiryChange, onCvvChange,
    onCvvFocus, onCvvBlur
}) => {
        const formatCardNumber = (value: string) => {
            const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            const matches = v.match(/\d{4,16}/g);
            const match = (matches && matches[0]) || '';
            const parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            return parts.length ? parts.join(' ') : v;
        };

        return (
            <div className="perspective-1000 mb-6">
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-48 preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front of Card */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-2xl p-5 backface-hidden",
                            "bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-black",
                            "backdrop-blur-xl border border-white/10",
                            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        )}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Card Chip */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
                            <div className="flex gap-1">
                                <div className="w-8 h-8 rounded-full bg-red-500/80" />
                                <div className="w-8 h-8 rounded-full bg-amber-500/80 -ml-4" />
                            </div>
                        </div>

                        {/* Card Number */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={formatCardNumber(cardNumber)}
                                onChange={(e) => onCardNumberChange(e.target.value.replace(/\s/g, ''))}
                                maxLength={19}
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-transparent text-white text-xl tracking-[0.2em] font-mono placeholder:text-white/30 focus:outline-none"
                            />
                        </div>

                        {/* Name and Expiry */}
                        <div className="flex justify-between items-end">
                            <div className="flex-1 mr-4">
                                <Typography variant="caption" className="text-[10px] text-white/50 uppercase mb-1">Nome no Cartão</Typography>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => onCardNameChange(e.target.value.toUpperCase())}
                                    placeholder="SEU NOME"
                                    className="w-full bg-transparent text-white text-sm uppercase tracking-wider placeholder:text-white/30 focus:outline-none"
                                />
                            </div>
                            <div>
                                <Typography variant="caption" className="text-[10px] text-white/50 uppercase mb-1">Validade</Typography>
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                        onExpiryChange(v);
                                    }}
                                    maxLength={5}
                                    placeholder="MM/AA"
                                    className="w-20 bg-transparent text-white text-sm text-center placeholder:text-white/30 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Back of Card */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-2xl backface-hidden",
                            "bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-black",
                            "backdrop-blur-xl border border-white/10",
                            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                        )}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {/* Magnetic Strip */}
                        <div className="w-full h-12 bg-gray-950 mt-6" />

                        {/* CVV Area */}
                        <div className="px-5 mt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-10 bg-white/90 rounded flex items-center justify-end px-3">
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => onCvvChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        onFocus={onCvvFocus}
                                        onBlur={onCvvBlur}
                                        maxLength={4}
                                        placeholder="CVV"
                                        className="w-16 bg-transparent text-gray-800 text-right font-mono text-lg tracking-widest placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <Typography variant="caption" className="text-[10px] text-white/50 mt-2 text-right">Código de Segurança</Typography>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

// Success Screen Component with Bridal Onboarding
const SuccessScreen: React.FC<{
    onViewAppointments: () => void;
    onStartBridalJourney: () => void;
    isBrideService?: boolean;
}> = ({ onViewAppointments, onStartBridalJourney, isBrideService }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)' }}
    >
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="relative z-10 text-center max-w-sm"
        >
            {/* Floating Checkmark */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${ROSE} 100%)`,
                    boxShadow: `0 0 60px ${GOLD}80, 0 0 120px ${ROSE}40`
                }}
            >
                <CheckCircle size={56} className="text-white" />
            </motion.div>

            <Typography variant="h3" className="font-bold text-white mb-2">Pagamento Confirmado!</Typography>
            <Typography variant="body" className="text-white/70 mb-6">Seu agendamento foi confirmado com sucesso.</Typography>

            {/* Bridal Journey CTA - Shows for bride services */}
            {isBrideService && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)` }}
                        >
                            <Crown size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <Typography variant="h4" className="font-semibold text-white">Personalize sua Jornada</Typography>
                            <Typography variant="caption" className="text-white/60">Configure a data do seu grande dia</Typography>
                        </div>
                    </div>
                    <NeoButton
                        variant="gradient"
                        fullWidth
                        onClick={onStartBridalJourney}
                        className="rounded-xl shadow-lg"
                        icon={<Sparkles size={18} />}
                    >
                        Começar Jornada de Noiva
                    </NeoButton>
                </motion.div>
            )}

            <NeoButton
                variant={isBrideService ? 'glass' : 'gradient'}
                fullWidth
                size="lg"
                onClick={onViewAppointments}
            >
                Ver Meus Agendamentos
            </NeoButton>
        </motion.div>
    </motion.div>
);

// Main Checkout Page
export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get data from navigation state or use defaults
    const checkoutData: CheckoutData = location.state?.checkoutData || {
        totalAmount: 63.00,
        depositPercentage: 30,
        depositType: 'percentage',
        pixKey: 'pagamentos@salaobeauty.com.br',
        serviceName: 'Ondas',
        date: '31 de dezembro',
        time: '18h30'
    };

    // Initialize Mercado Pago
    React.useEffect(() => {
        const mpKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        if (mpKey) {
            initMercadoPago(mpKey, { locale: 'pt-BR' });
        }
    }, []);

    const depositAmount = checkoutData.depositType === 'percentage'
        ? checkoutData.totalAmount * (checkoutData.depositPercentage / 100)
        : (checkoutData.depositFixed || 0);

    // Detect if bride service (by service name containing 'noiva' or 'bride')
    const isBrideService = checkoutData.serviceName?.toLowerCase().includes('noiva') ||
        checkoutData.serviceName?.toLowerCase().includes('bride') ||
        checkoutData.serviceName?.toLowerCase().includes('casamento') ||
        location.state?.isBrideService === true;

    // State
    const [paymentChoice, setPaymentChoice] = useState<'deposit' | 'full'>('deposit');
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
    const [pixData, setPixData] = useState<{ qr_code: string, qr_code_base64: string } | null>(null);
    const [pixCopied, setPixCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showBridalModal, setShowBridalModal] = useState(false);
    const [saveCard, setSaveCard] = useState(false);
    const [installments, setInstallments] = useState(1);

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const selectedAmount = paymentChoice === 'deposit' ? depositAmount : checkoutData.totalAmount;

    const handleCopyPix = () => {
        navigator.clipboard.writeText(checkoutData.pixKey);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 2000);
    };

    const handlePayment = async (param?: any) => {
        setIsProcessing(true);

        try {
            // If param is present, it's a Brick submission
            if (param) {
                const result = await paymentService.processPayment({
                    ...param,
                    external_reference: checkoutData.bookingId,
                    metadata: {
                        paymentChoice,
                        appointmentId: checkoutData.bookingId
                    }
                });

                if (result.status === 'approved') {
                    setShowSuccess(true);
                } else if (result.pixData) {
                    setPixData(result.pixData);
                    setPaymentMethod('pix');
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBrideJourneySave = async (data: { weddingDate: Date; ceremonyTime: string; venue: string }) => {
        // For now, use a mock bride ID - in real app, get from auth context
        const brideId = `bride_${Date.now()}`;
        const brideName = cardName || 'Noiva';

        try {
            await saveBrideJourney(brideId, brideName, data.weddingDate, data.ceremonyTime, data.venue);
            setShowBridalModal(false);
            navigate('/noiva');
        } catch (error) {
            console.error('Error saving bride journey:', error);
        }
    };

    if (showSuccess) {
        return (
            <>
                <SuccessScreen
                    onViewAppointments={() => navigate('/booking/success', {
                        state: {
                            booking: {
                                id: checkoutData.bookingId || `BK${Date.now()}`,
                                serviceName: checkoutData.serviceName,
                                date: checkoutData.date,
                                time: checkoutData.time,
                                professional: checkoutData.professional || 'Equipe',
                                totalAmount: checkoutData.totalAmount,
                                depositAmount: selectedAmount,
                            }
                        }
                    })}
                    onStartBridalJourney={() => setShowBridalModal(true)}
                    isBrideService={isBrideService}
                />
                <BrideOnboardingModal
                    isOpen={showBridalModal}
                    onClose={() => setShowBridalModal(false)}
                    onComplete={handleBrideJourneySave}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-neo-bg pb-8">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4 flex items-center gap-4">
                    <NeoButton
                        variant="neu"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} className="text-neo-text-secondary" />
                    </NeoButton>
                    <div>
                        <Typography variant="h4" className="font-bold text-neo-text">Pagamento</Typography>
                        <Typography variant="caption" className="text-neo-text-secondary">Finalize seu agendamento</Typography>
                    </div>
                </header>

                <main className="px-4">
                    {/* Order Summary Mini */}
                    <NeoCard className="p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="h5" className="font-medium text-neo-text">{checkoutData.serviceName}</Typography>
                                <Typography variant="caption" className="text-neo-text-secondary">{checkoutData.date} às {checkoutData.time}</Typography>
                            </div>
                            <Typography variant="h4" className="font-bold" style={{ color: ROSE }}>
                                {formatCurrency(checkoutData.totalAmount)}
                            </Typography>
                        </div>
                    </NeoCard>

                    {/* Payment Amount Choice */}
                    <Typography variant="body" className="font-semibold text-neo-text mb-3">Escolha o valor</Typography>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Deposit Option */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentChoice('deposit')}
                            className={cn(
                                "p-4 rounded-neo text-left transition-all",
                                paymentChoice === 'deposit'
                                    ? "shadow-neo-pressed"
                                    : "shadow-neo-out"
                            )}
                            style={{
                                border: paymentChoice === 'deposit' ? `2px solid ${GOLD}` : '2px solid transparent'
                            }}
                        >
                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Pagar Sinal</Typography>
                            <Typography variant="h6" className="font-bold text-neo-text">{formatCurrency(depositAmount)}</Typography>
                            <Typography variant="caption" className="text-[10px] text-neo-text-secondary mt-1">
                                {checkoutData.depositPercentage}% do total
                            </Typography>
                        </motion.button>

                        {/* Full Amount Option */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentChoice('full')}
                            className={cn(
                                "p-4 rounded-neo text-left transition-all",
                                paymentChoice === 'full'
                                    ? "shadow-neo-pressed"
                                    : "shadow-neo-out"
                            )}
                            style={{
                                border: paymentChoice === 'full' ? `2px solid ${GOLD}` : '2px solid transparent'
                            }}
                        >
                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Valor Total</Typography>
                            <Typography variant="h6" className="font-bold text-neo-text">{formatCurrency(checkoutData.totalAmount)}</Typography>
                            <Typography variant="caption" className="text-[10px] text-green-600 mt-1">Sem saldo restante</Typography>
                        </motion.button>
                    </div>

                    {/* Payment Method Tabs */}
                    <Typography variant="body" className="font-semibold text-neo-text mb-3">Forma de pagamento</Typography>
                    <div className="flex bg-neo-bg rounded-neo shadow-neo-in p-1 mb-6">
                        <NeoButton
                            variant={paymentMethod === 'pix' ? 'neu' : 'ghost'}
                            fullWidth
                            onClick={() => setPaymentMethod('pix')}
                            className={cn(
                                "rounded-neo text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                paymentMethod === 'pix' ? "text-brand-primary" : "text-neo-text-secondary"
                            )}
                        >
                            <QrCode size={18} />
                            PIX
                        </NeoButton>
                        <NeoButton
                            variant={paymentMethod === 'card' ? 'neu' : 'ghost'}
                            fullWidth
                            onClick={() => setPaymentMethod('card')}
                            className={cn(
                                "rounded-neo text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                paymentMethod === 'card' ? "text-brand-primary" : "text-neo-text-secondary"
                            )}
                        >
                            <CreditCard size={18} />
                            Cartão
                        </NeoButton>
                    </div>

                    {/* Payment Content */}
                    <AnimatePresence mode="wait">
                        {paymentMethod === 'pix' && pixData ? (
                            <motion.div
                                key="pix-result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 bg-white rounded-neo p-6 flex flex-col items-center shadow-neo-out"
                            >
                                <img
                                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                    alt="QR Code PIX"
                                    className="w-48 h-48 mb-4"
                                />
                                <Typography variant="caption" className="text-gray-600 mb-4 text-center">
                                    Escaneie o código acima para pagar {formatCurrency(selectedAmount)}
                                </Typography>

                                <NeoButton
                                    variant="neu"
                                    onClick={() => {
                                        navigator.clipboard.writeText(pixData.qr_code);
                                        setPixCopied(true);
                                        setTimeout(() => setPixCopied(false), 2000);
                                    }}
                                    fullWidth
                                    className="bg-gray-100 text-gray-800"
                                    icon={pixCopied ? <Check size={18} /> : <Copy size={18} />}
                                >
                                    {pixCopied ? 'Copiado!' : 'Copiar Código Copia e Cola'}
                                </NeoButton>
                            </motion.div>
                        ) : (
                            <div className="mb-8">
                                <Payment
                                    initialization={{
                                        amount: selectedAmount,
                                        preferenceId: undefined, // Let it be calculated on backend or use simple flow
                                    }}
                                    customization={{
                                        paymentMethods: {
                                            ticket: "all",
                                            bankTransfer: "all",
                                            creditCard: "all",
                                            debitCard: "all",
                                            mercadoPago: "all",
                                        },
                                        visual: {
                                            style: {
                                                theme: 'flat', // or 'default'
                                            }
                                        }
                                    }}
                                    onSubmit={handlePayment}
                                    onReady={() => console.log('MP Brick Ready')}
                                    onError={(error) => console.error('MP Brick Error:', error)}
                                />
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 mb-6">
                        <Lock size={14} className="text-neo-text-secondary" />
                        <Typography variant="caption" className="text-[11px] text-neo-text-secondary">Pagamento 100% seguro com criptografia de ponta a ponta</Typography>
                    </div>

                    {/* Pay Button */}
                    <NeoButton
                        variant="gradient"
                        fullWidth
                        size="lg"
                        onClick={handlePayment}
                        loading={isProcessing}
                        disabled={isProcessing}
                        className="relative overflow-hidden"
                        icon={!isProcessing ? <Sparkles size={18} /> : undefined}
                    >
                        {isProcessing ? 'Processando...' : `Finalizar Pagamento • ${formatCurrency(selectedAmount)}`}
                    </NeoButton>
                </main>
            </div>
        </div>
    );
};

export default CheckoutPage;
