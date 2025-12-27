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
    Crown
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { BrideOnboardingModal } from '../../bride/components/BrideOnboardingModal';
import { saveBrideJourney } from '../../bride/services/brideIntelligence';

// Brand Colors
const ROSE = '#E8A0B8';
const GOLD = '#D4AF37';

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
                                <p className="text-[10px] text-white/50 uppercase mb-1">Nome no Cartão</p>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => onCardNameChange(e.target.value.toUpperCase())}
                                    placeholder="SEU NOME"
                                    className="w-full bg-transparent text-white text-sm uppercase tracking-wider placeholder:text-white/30 focus:outline-none"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/50 uppercase mb-1">Validade</p>
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
                            <p className="text-[10px] text-white/50 mt-2 text-right">Código de Segurança</p>
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

            <h2 className="text-2xl font-display font-bold text-white mb-2">Pagamento Confirmado!</h2>
            <p className="text-white/70 mb-6">Seu agendamento foi confirmado com sucesso.</p>

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
                            <h3 className="font-semibold text-white">Personalize sua Jornada</h3>
                            <p className="text-xs text-white/60">Configure a data do seu grande dia</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onStartBridalJourney}
                        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                        style={{
                            background: `linear-gradient(135deg, ${ROSE}90 0%, ${GOLD}90 100%)`,
                            boxShadow: `0 5px 20px -5px ${ROSE}60`
                        }}
                    >
                        <Sparkles size={18} />
                        Começar Jornada de Noiva
                    </motion.button>
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAppointments}
                className={cn(
                    "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2",
                    isBrideService
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-white"
                )}
                style={!isBrideService ? {
                    background: `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)`,
                    boxShadow: `0 10px 40px -10px ${ROSE}80`
                } : undefined}
            >
                Ver Meus Agendamentos
            </motion.button>
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

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // TODO: Save to Firestore
        // await updateDoc(doc(db, 'appointments', appointmentId), {
        //     status: 'confirmed',
        //     paymentStatus: paymentChoice === 'deposit' ? 'Sinal Pago' : 'Pago Integral',
        //     paidAmount: selectedAmount,
        //     paymentMethod: paymentMethod,
        //     paidAt: serverTimestamp()
        // });

        setIsProcessing(false);
        setShowSuccess(true);
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
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center active:shadow-neo-pressed"
                    >
                        <ArrowLeft size={20} className="text-neo-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-xl font-display font-bold text-neo-text">Pagamento</h1>
                        <p className="text-sm text-neo-text-secondary">Finalize seu agendamento</p>
                    </div>
                </header>

                <main className="px-4">
                    {/* Order Summary Mini */}
                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neo-text">{checkoutData.serviceName}</p>
                                <p className="text-xs text-neo-text-secondary">{checkoutData.date} às {checkoutData.time}</p>
                            </div>
                            <p className="text-lg font-bold" style={{ color: ROSE }}>
                                {formatCurrency(checkoutData.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Payment Amount Choice */}
                    <h2 className="text-sm font-semibold text-neo-text mb-3">Escolha o valor</h2>
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
                            <p className="text-xs text-neo-text-secondary mb-1">Pagar Sinal</p>
                            <p className="text-xl font-bold text-neo-text">{formatCurrency(depositAmount)}</p>
                            <p className="text-[10px] text-neo-text-secondary mt-1">
                                {checkoutData.depositPercentage}% do total
                            </p>
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
                            <p className="text-xs text-neo-text-secondary mb-1">Valor Total</p>
                            <p className="text-xl font-bold text-neo-text">{formatCurrency(checkoutData.totalAmount)}</p>
                            <p className="text-[10px] text-green-600 mt-1">Sem saldo restante</p>
                        </motion.button>
                    </div>

                    {/* Payment Method Tabs */}
                    <h2 className="text-sm font-semibold text-neo-text mb-3">Forma de pagamento</h2>
                    <div className="flex bg-neo-bg rounded-neo shadow-neo-in p-1 mb-6">
                        <button
                            onClick={() => setPaymentMethod('pix')}
                            className={cn(
                                "flex-1 py-3 rounded-neo text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                paymentMethod === 'pix'
                                    ? "bg-neo-bg shadow-neo-out"
                                    : "text-neo-text-secondary"
                            )}
                            style={{ color: paymentMethod === 'pix' ? ROSE : undefined }}
                        >
                            <QrCode size={18} />
                            PIX
                        </button>
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={cn(
                                "flex-1 py-3 rounded-neo text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                paymentMethod === 'card'
                                    ? "bg-neo-bg shadow-neo-out"
                                    : "text-neo-text-secondary"
                            )}
                            style={{ color: paymentMethod === 'card' ? ROSE : undefined }}
                        >
                            <CreditCard size={18} />
                            Cartão
                        </button>
                    </div>

                    {/* Payment Content */}
                    <AnimatePresence mode="wait">
                        {paymentMethod === 'pix' ? (
                            <motion.div
                                key="pix"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="mb-6"
                            >
                                {/* QR Code Area */}
                                <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
                                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                                        <QrCode size={120} className="text-gray-800" />
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">
                                        Escaneie o QR Code ou copie a chave PIX
                                    </p>
                                </div>

                                {/* Copy PIX Key Button */}
                                <button
                                    onClick={handleCopyPix}
                                    className={cn(
                                        "w-full py-4 rounded-neo font-semibold flex items-center justify-center gap-2 transition-all",
                                        "bg-neo-bg shadow-neo-out active:shadow-neo-pressed"
                                    )}
                                    style={{ color: pixCopied ? '#22c55e' : ROSE }}
                                >
                                    {pixCopied ? (
                                        <>
                                            <Check size={18} />
                                            Chave copiada!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            Copiar Chave PIX
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* 3D Credit Card */}
                                <GlassCreditCard
                                    cardNumber={cardNumber}
                                    cardName={cardName}
                                    expiry={expiry}
                                    cvv={cvv}
                                    isFlipped={isCardFlipped}
                                    onCardNumberChange={setCardNumber}
                                    onCardNameChange={setCardName}
                                    onExpiryChange={setExpiry}
                                    onCvvChange={setCvv}
                                    onCvvFocus={() => setIsCardFlipped(true)}
                                    onCvvBlur={() => setIsCardFlipped(false)}
                                />

                                {/* Installments */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Número de parcelas
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={installments}
                                            onChange={(e) => setInstallments(Number(e.target.value))}
                                            className="w-full neo-input appearance-none cursor-pointer pr-10"
                                            style={{ borderColor: GOLD }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                                <option key={n} value={n}>
                                                    {n}x de {formatCurrency(selectedAmount / n)}
                                                    {n === 1 ? ' (à vista)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Save Card Toggle */}
                                <div className="flex items-center justify-between p-4 bg-neo-bg rounded-neo shadow-neo-in mb-6">
                                    <div className="flex items-center gap-2">
                                        <Shield size={18} className="text-neo-text-secondary" />
                                        <span className="text-sm text-neo-text">Salvar cartão para próximas compras</span>
                                    </div>
                                    <button
                                        onClick={() => setSaveCard(!saveCard)}
                                        className={cn(
                                            "relative w-12 h-6 rounded-full transition-all duration-300",
                                            saveCard
                                                ? "shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                                                : "bg-neo-bg shadow-neo-in"
                                        )}
                                        style={{
                                            background: saveCard ? `linear-gradient(90deg, ${GOLD}, ${ROSE})` : undefined
                                        }}
                                    >
                                        <motion.div
                                            animate={{ x: saveCard ? 26 : 2 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full",
                                                saveCard
                                                    ? "bg-white shadow-[0_0_6px_rgba(212,175,55,0.8)]"
                                                    : "bg-neo-bg shadow-neo-out"
                                            )}
                                        />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 text-[11px] text-neo-text-secondary mb-6">
                        <Lock size={14} />
                        <span>Pagamento 100% seguro com criptografia de ponta a ponta</span>
                    </div>

                    {/* Pay Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={cn(
                            "w-full py-4 rounded-neo font-semibold text-white flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                            isProcessing && "opacity-70 cursor-not-allowed"
                        )}
                        style={{
                            background: `linear-gradient(135deg, ${ROSE} 0%, ${GOLD} 100%)`,
                            boxShadow: `0 10px 30px -10px ${ROSE}80`
                        }}
                    >
                        {/* Liquid Ripple Effect */}
                        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />

                        {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Finalizar Pagamento • {formatCurrency(selectedAmount)}
                            </>
                        )}
                    </motion.button>
                </main>
            </div>
        </div>
    );
};

export default CheckoutPage;
