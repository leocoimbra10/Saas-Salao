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
import { NeoButton, NeoInput, NeoCard, Typography, Progress, NeoTextarea } from '../../../shared/components/ui';
import { PageWrapper } from '../../../shared/components/ui/AppLayout';

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
                <NeoButton
                    variant="neu"
                    size="icon"
                    onClick={handleBack}
                    className="w-10 h-10"
                >
                    <ChevronLeft size={20} />
                </NeoButton>
                <div className="flex-1">
                    <Typography variant="h3">Criar Conta</Typography>
                    <Typography variant="caption">Passo {step} de {TOTAL_STEPS}</Typography>
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
                            <Typography variant="h2" className="mb-2">
                                Qual o nome do seu negócio?
                            </Typography>
                            <Typography variant="body" className="text-neo-text-secondary mb-6">
                                Este será o nome visível para seus clientes.
                            </Typography>

                            <div className="mb-4">
                                <NeoInput
                                    label="Nome do Salão / Estúdio"
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
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
                            <Typography variant="h2" className="mb-2">
                                Seus dados pessoais
                            </Typography>
                            <Typography variant="body" className="text-neo-text-secondary mb-6">
                                Informações do proprietário do negócio.
                            </Typography>

                            <div className="space-y-4">
                                <NeoInput
                                    label="Seu Nome"
                                    type="text"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    placeholder="Nome completo"
                                    autoFocus
                                />

                                <NeoInput
                                    label="Telefone / WhatsApp"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Configuration - Premium */}
                    {step === 4 && (
                        <div>
                            <Typography variant="h2" className="mb-2">
                                Configure seus pagamentos
                            </Typography>
                            <Typography variant="body" className="text-neo-text-secondary mb-6">
                                Defina como você quer receber de seus clientes.
                            </Typography>

                            <div className="space-y-6">
                                {/* SMART DEPOSIT */}
                                <NeoCard className="p-4">
                                    <label className="block text-sm font-semibold text-neo-text mb-3 flex items-center gap-2">
                                        <Sparkles size={14} style={{ color: ROSE }} />
                                        Tipo de Sinal (Depósito)
                                    </label>

                                    {/* Toggle % vs R$ */}
                                    <div className="flex gap-2 mb-4">
                                        <NeoButton
                                            variant={depositType === 'percentage' ? 'gradient' : 'neu'}
                                            onClick={() => setDepositType('percentage')}
                                            className="flex-1"
                                        >
                                            Porcentagem %
                                        </NeoButton>
                                        <NeoButton
                                            variant={depositType === 'fixed' ? 'gradient' : 'neu'}
                                            onClick={() => setDepositType('fixed')}
                                            className="flex-1"
                                        >
                                            Valor Fixo R$
                                        </NeoButton>
                                    </div>

                                    {/* Value Input */}
                                    <NeoInput
                                        icon={<span className="text-neo-text-secondary font-medium">{depositType === 'percentage' ? '%' : 'R$'}</span>}
                                        value={depositValue}
                                        onChange={(e) => setDepositValue(e.target.value)}
                                        placeholder={depositType === 'percentage' ? 'Ex: 30' : 'Ex: 100,00'}
                                    />
                                    <Typography variant="caption" className="mt-2 block">
                                        {depositType === 'percentage'
                                            ? 'Percentual do valor total cobrado como sinal.'
                                            : 'Valor fixo em reais cobrado como sinal.'}
                                    </Typography>
                                </NeoCard>

                                {/* PIX CONFIGURATION */}
                                <NeoInput
                                    label="Chave PIX"
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    placeholder="CPF, e-mail ou chave aleatória"
                                    helperText="Clientes verão esta chave para enviar o sinal."
                                />

                                {/* PAYMENT INSTRUCTIONS */}
                                <NeoTextarea
                                    label="Instruções de Pagamento"
                                    value={paymentInstructions}
                                    onChange={(e) => setPaymentInstructions(e.target.value)}
                                    placeholder="Ex: Pix para confirmar. Aceito cartão no dia."
                                />

                                {/* CARD GATEWAY - LED TOGGLE */}
                                <NeoCard className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <Typography variant="label" className="block">
                                                Aceitar Cartão de Crédito
                                            </Typography>
                                            <Typography variant="caption" className="block">
                                                Integração com gateway de pagamento
                                            </Typography>
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
                                                <NeoInput
                                                    label="API Key / Token"
                                                    type="password"
                                                    value={gatewayApiKey}
                                                    onChange={(e) => setGatewayApiKey(e.target.value)}
                                                    placeholder="sk_live_... ou access_token"
                                                    helperText="Compatível com Stripe ou Mercado Pago."
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </NeoCard>
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
                            <Typography variant="h2" className="mb-2">
                                Crie sua conta
                            </Typography>
                            <Typography variant="body" className="text-neo-text-secondary mb-6">
                                Dados de acesso ao painel administrativo.
                            </Typography>

                            <div className="space-y-4">
                                <NeoInput
                                    label="E-mail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    autoFocus
                                />

                                <NeoInput
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                />

                                <NeoInput
                                    label="Confirmar Senha"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Digite a senha novamente"
                                />
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
                <NeoButton
                    variant="glass"
                    onClick={step === TOTAL_STEPS ? handleSubmit : handleNext}
                    disabled={loading}
                    className="w-full py-4 font-semibold gap-2"
                    style={{ color: GOLD }}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
                </NeoButton>
            </div>
        </div>
    );
};

export default RegisterBusinessPage;
