/**
 * REGISTER BUSINESS PAGE - Owner Onboarding
 * 5 Steps: Business Name → Logo → Personal Info → Payment Config → Login Credentials
 * Neomorphic Design with Gold Progress Bar
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Upload,
    Camera,
    Check,
    CreditCard,
    Building2,
    User,
    Lock,
    Sparkles
} from 'lucide-react';
import { registerBusiness } from '../../auth/services/authService';

type Step = 1 | 2 | 3 | 4 | 5;

const ROSE = 'var(--color-brand-primary)';
const GOLD = ROSE; // Legacy alias

export const RegisterBusinessPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form data
    const [businessName, setBusinessName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    // Payment Config
    const [pixKey, setPixKey] = useState('');
    const [depositType, setDepositType] = useState<'percentage' | 'fixed'>('percentage');
    const [depositValue, setDepositValue] = useState('30');
    const [paymentInstructions, setPaymentInstructions] = useState('Pix para confirmar agendamento. Restante no dia do atendimento.');
    const [cardGatewayEnabled, setCardGatewayEnabled] = useState(false);
    const [gatewayApiKey, setGatewayApiKey] = useState('');

    const TOTAL_STEPS = 5;
    const progress = (step / TOTAL_STEPS) * 100;

    const stepTitles = [
        { title: 'Seu Negócio', icon: <Building2 size={16} /> },
        { title: 'Logomarca', icon: <Camera size={16} /> },
        { title: 'Seus Dados', icon: <User size={16} /> },
        { title: 'Pagamentos', icon: <CreditCard size={16} /> },
        { title: 'Acesso', icon: <Lock size={16} /> },
    ];

    const validateStep = (): boolean => {
        setError('');

        switch (step) {
            case 1:
                if (!businessName.trim()) {
                    setError('Digite o nome do seu negócio.');
                    return false;
                }
                break;
            case 2:
                // Logo is optional
                break;
            case 3:
                if (!ownerName.trim()) {
                    setError('Digite seu nome.');
                    return false;
                }
                if (!phone.trim()) {
                    setError('Digite seu telefone.');
                    return false;
                }
                break;
            case 4:
                // Payment settings are optional but recommended
                break;
            case 5:
                if (!email.trim()) {
                    setError('Digite seu e-mail.');
                    return false;
                }
                if (!password || password.length < 6) {
                    setError('A senha deve ter pelo menos 6 caracteres.');
                    return false;
                }
                if (password !== confirmPassword) {
                    setError('As senhas não coincidem.');
                    return false;
                }
                break;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (step < TOTAL_STEPS) {
            setStep((s) => (s + 1) as Step);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((s) => (s - 1) as Step);
        } else {
            navigate('/login');
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);
        setError('');

        try {
            await registerBusiness(email, password, businessName, ownerName);
            // Navigate to success or admin
            navigate('/admin', {
                state: {
                    firstLogin: true,
                    config: {
                        businessName,
                        logoPreview,
                        pixKey,
                        depositValue,
                        paymentInstructions
                    }
                }
            });
        } catch (err: any) {
            console.error('Registration error:', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Este e-mail já está em uso.');
                    break;
                case 'auth/invalid-email':
                    setError('E-mail inválido.');
                    break;
                case 'auth/weak-password':
                    setError('Senha muito fraca.');
                    break;
                default:
                    setError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex flex-col overflow-y-auto pb-24" style={{ maxHeight: '100dvh' }}>
            {/* Header */}
            <header className="p-6 flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="btn-neu-glass-light p-3"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-display font-bold text-neo-text">Criar Conta</h1>
                    <p className="text-sm text-neo-text-secondary">Passo {step} de {TOTAL_STEPS}</p>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="px-6 mb-6">
                <div className="h-2 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        initial={{ width: '20%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-3">
                    {stepTitles.map((s, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center gap-1"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${idx + 1 <= step
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md'
                                    : 'bg-neo-bg shadow-neo-in text-neo-text-secondary'
                                    }`}
                            >
                                {idx + 1 < step ? (
                                    <Check size={16} />
                                ) : (
                                    s.icon
                                )}
                            </div>
                            <span className={`text-[10px] ${idx + 1 <= step ? 'text-neo-accent font-medium' : 'text-neo-text-secondary'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-6">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Step 1: Business Name */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neo-text mb-2">
                                Qual o nome do seu negócio?
                            </h2>
                            <p className="text-neo-text-secondary mb-6">
                                Este será o nome visível para seus clientes.
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                    Nome do Salão / Estúdio
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full neo-input text-lg"
                                    placeholder="Ex: Studio Beleza Maria"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Logo Upload */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neo-text mb-2">
                                Adicione sua logomarca
                            </h2>
                            <p className="text-neo-text-secondary mb-6">
                                Ela aparecerá na página de agendamento e nos recibos.
                            </p>

                            <div className="flex flex-col items-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-40 h-40 rounded-full bg-neo-bg shadow-neo-in flex items-center justify-center overflow-hidden transition-all hover:shadow-neo-out"
                                    style={{ border: logoPreview ? `3px solid ${GOLD}` : 'none' }}
                                >
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-neo-text-secondary">
                                            <Upload size={32} />
                                            <span className="text-xs">Toque para adicionar</span>
                                        </div>
                                    )}
                                </button>

                                {logoPreview && (
                                    <button
                                        onClick={() => {
                                            setLogoFile(null);
                                            setLogoPreview('');
                                        }}
                                        className="mt-4 text-sm text-neo-danger"
                                    >
                                        Remover imagem
                                    </button>
                                )}

                                <p className="text-xs text-neo-text-secondary mt-4 text-center">
                                    Formatos aceitos: JPG, PNG, WEBP<br />
                                    Tamanho recomendado: 500x500 pixels
                                </p>

                                <button
                                    onClick={handleNext}
                                    className="mt-6 text-sm text-neo-text-secondary underline"
                                >
                                    Pular esta etapa →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Personal Info */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neo-text mb-2">
                                Seus dados pessoais
                            </h2>
                            <p className="text-neo-text-secondary mb-6">
                                Informações do proprietário do negócio.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Seu Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={ownerName}
                                        onChange={(e) => setOwnerName(e.target.value)}
                                        className="w-full neo-input"
                                        placeholder="Nome completo"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Telefone / WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full neo-input"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Configuration - Premium */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neo-text mb-2">
                                Configure seus pagamentos
                            </h2>
                            <p className="text-neo-text-secondary mb-6">
                                Defina como você quer receber de seus clientes.
                            </p>

                            <div className="space-y-6">
                                {/* SMART DEPOSIT */}
                                <div className="p-4 rounded-neo bg-neo-bg shadow-neo-in">
                                    <label className="block text-sm font-semibold text-neo-text mb-3 flex items-center gap-2">
                                        <Sparkles size={14} style={{ color: ROSE }} />
                                        Tipo de Sinal (Depósito)
                                    </label>

                                    {/* Toggle % vs R$ */}
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => setDepositType('percentage')}
                                            className={`flex-1 py-3 rounded-neo text-sm font-semibold transition-all ${depositType === 'percentage'
                                                ? 'shadow-neo-pressed'
                                                : 'shadow-neo-out hover:shadow-neo-out-lg'
                                                }`}
                                            style={{ color: depositType === 'percentage' ? ROSE : undefined }}
                                        >
                                            Porcentagem %
                                        </button>
                                        <button
                                            onClick={() => setDepositType('fixed')}
                                            className={`flex-1 py-3 rounded-neo text-sm font-semibold transition-all ${depositType === 'fixed'
                                                ? 'shadow-neo-pressed'
                                                : 'shadow-neo-out hover:shadow-neo-out-lg'
                                                }`}
                                            style={{ color: depositType === 'fixed' ? ROSE : undefined }}
                                        >
                                            Valor Fixo R$
                                        </button>
                                    </div>

                                    {/* Value Input */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary font-medium">
                                            {depositType === 'percentage' ? '%' : 'R$'}
                                        </span>
                                        <input
                                            type="text"
                                            value={depositValue}
                                            onChange={(e) => setDepositValue(e.target.value)}
                                            className="w-full neo-input pl-12 text-lg font-semibold focus:ring-2 focus:ring-neo-accent/30"
                                            placeholder={depositType === 'percentage' ? 'Ex: 30' : 'Ex: 100,00'}
                                        />
                                    </div>
                                    <p className="text-xs text-neo-text-secondary mt-2">
                                        {depositType === 'percentage'
                                            ? 'Percentual do valor total cobrado como sinal.'
                                            : 'Valor fixo em reais cobrado como sinal.'}
                                    </p>
                                </div>

                                {/* PIX CONFIGURATION */}
                                <div>
                                    <label className="block text-sm font-semibold text-neo-text mb-2">
                                        Chave PIX
                                    </label>
                                    <input
                                        type="text"
                                        value={pixKey}
                                        onChange={(e) => setPixKey(e.target.value)}
                                        className="w-full neo-input focus:shadow-[inset_0_0_0_2px_rgba(232,160,184,0.3)]"
                                        placeholder="CPF, e-mail ou chave aleatória"
                                    />
                                    <p className="text-xs text-neo-text-secondary mt-1">
                                        Clientes verão esta chave para enviar o sinal.
                                    </p>
                                </div>

                                {/* PAYMENT INSTRUCTIONS */}
                                <div>
                                    <label className="block text-sm font-semibold text-neo-text mb-2">
                                        Instruções de Pagamento
                                    </label>
                                    <textarea
                                        value={paymentInstructions}
                                        onChange={(e) => setPaymentInstructions(e.target.value)}
                                        className="w-full neo-input min-h-[80px] resize-none focus:shadow-[inset_0_0_0_2px_rgba(232,160,184,0.3)]"
                                        placeholder="Ex: Pix para confirmar. Aceito cartão no dia."
                                    />
                                </div>

                                {/* CARD GATEWAY - LED TOGGLE */}
                                <div className="p-4 rounded-neo bg-neo-bg shadow-neo-out">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-neo-text">
                                                Aceitar Cartão de Crédito
                                            </label>
                                            <p className="text-xs text-neo-text-secondary">
                                                Integração com gateway de pagamento
                                            </p>
                                        </div>

                                        {/* LED Toggle */}
                                        <button
                                            onClick={() => setCardGatewayEnabled(!cardGatewayEnabled)}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${cardGatewayEnabled
                                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                                                : 'bg-neo-bg shadow-neo-in'
                                                }`}
                                        >
                                            <motion.div
                                                animate={{ x: cardGatewayEnabled ? 28 : 2 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                className={`absolute top-1 w-5 h-5 rounded-full transition-all ${cardGatewayEnabled
                                                    ? 'bg-white shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                                                    : 'bg-neo-bg shadow-neo-out'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Expandable API Key Field */}
                                    {cardGatewayEnabled && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-3 border-t border-neo-text/10">
                                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                                    API Key / Token
                                                </label>
                                                <input
                                                    type="password"
                                                    value={gatewayApiKey}
                                                    onChange={(e) => setGatewayApiKey(e.target.value)}
                                                    className="w-full neo-input text-sm"
                                                    placeholder="sk_live_... ou access_token"
                                                />
                                                <p className="text-xs text-neo-text-secondary mt-1">
                                                    Compatível com Stripe ou Mercado Pago.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="mt-4 text-sm text-neo-text-secondary underline"
                            >
                                Configurar depois →
                            </button>
                        </div>
                    )}

                    {/* Step 5: Login Credentials */}
                    {step === 5 && (
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neo-text mb-2">
                                Crie sua conta
                            </h2>
                            <p className="text-neo-text-secondary mb-6">
                                Dados de acesso ao painel administrativo.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full neo-input"
                                        placeholder="seu@email.com"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full neo-input"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Confirmar Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full neo-input"
                                        placeholder="Digite a senha novamente"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-neo bg-red-50 text-red-600 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pb-safe">
                <button
                    onClick={step === TOTAL_STEPS ? handleSubmit : handleNext}
                    disabled={loading}
                    className="w-full btn-neu-glass-light py-4 font-semibold flex items-center justify-center gap-2 active"
                    style={{ color: GOLD }}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Criando...
                        </>
                    ) : step === TOTAL_STEPS ? (
                        <>
                            <Check size={18} />
                            Criar Meu Negócio
                        </>
                    ) : (
                        <>
                            Continuar
                            <ChevronRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RegisterBusinessPage;
