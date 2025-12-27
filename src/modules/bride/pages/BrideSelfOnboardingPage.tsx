/**
 * BRIDE SELF-ONBOARDING PAGE
 * Multi-step glassmorphic registration for brides
 * Style: Silent Luxury / 3D Glassmorphism
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown,
    ArrowLeft,
    ArrowRight,
    Calendar,
    User,
    Mail,
    Phone,
    Lock,
    MapPin,
    Users,
    Sparkles,
    Check,
    Heart
} from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { createClientAccount } from '../../auth/services/authService';
import { db } from '../../../shared/lib/firebase';
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

// Brand Colors
const ROSE = '#E8A0B8';
const ROSE_LIGHT = '#F5CED8';

// Step Types
type Step = 1 | 2 | 3 | 4;

interface FormData {
    // Step 1: Account
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    // Step 2: Wedding
    weddingDate: string;
    weddingVenue: string;
    expectedAttendants: number;
    // Step 3: Services
    selectedServices: string[];
    // Step 4: Confirmation
    acceptTerms: boolean;
}

// Progress Indicator
const ProgressIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
                <div
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                        step === currentStep
                            ? "bg-white/20 backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_0_20px_rgba(232,160,184,0.5)]"
                            : step < currentStep
                                ? "bg-white/30 backdrop-blur-xl border border-white/30 text-white"
                                : "bg-white/5 backdrop-blur-sm border border-white/10 text-white/40"
                    )}
                    style={{ color: step <= currentStep ? 'white' : undefined }}
                >
                    {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 4 && (
                    <div
                        className={cn(
                            "w-8 h-0.5 mx-1 transition-all duration-300",
                            step < currentStep ? "bg-white/40" : "bg-white/10"
                        )}
                    />
                )}
            </div>
        ))}
    </div>
);

// Glassmorphic Input Component
const GlassInput: React.FC<{
    icon: React.ReactNode;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}> = ({ icon, label, type = 'text', value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-sm text-white/70 mb-2 font-medium">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                {icon}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder:text-white/30",
                    "bg-white/10 backdrop-blur-xl border border-white/20",
                    "shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
                    "focus:outline-none focus:border-white/40 transition-all"
                )}
            />
        </div>
    </div>
);

// Service Selection Cards
const SAMPLE_SERVICES = [
    { id: 'bride-complete', name: 'Noiva Completa', desc: 'Make + Hair', price: 850 },
    { id: 'bride-trial', name: 'Prova de Noiva', desc: 'Teste antes do dia D', price: 350 },
    { id: 'attendant-combo', name: 'Acompanhante', desc: 'Make + Hair', price: 280 },
    { id: 'mother-special', name: 'Mãe da Noiva', desc: 'Produção VIP', price: 350 },
];

// Main Component
export const BrideSelfOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        weddingDate: '',
        weddingVenue: '',
        expectedAttendants: 0,
        selectedServices: [],
        acceptTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleService = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(serviceId)
                ? prev.selectedServices.filter(id => id !== serviceId)
                : [...prev.selectedServices, serviceId]
        }));
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
    };

    const handleSubmit = async () => {
        if (!formData.acceptTerms) return;

        // Validate
        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Create Firebase Auth account using authService
            const userCredential = await createClientAccount(
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // 2. Calculate package value
            const servicePrices: Record<string, number> = {
                'bride-complete': 850,
                'bride-trial': 350,
                'attendant-combo': 280,
                'mother-special': 350
            };
            const packageValue = formData.selectedServices.reduce(
                (total, svc) => total + (servicePrices[svc] || 0),
                0
            );

            // 3. Save bride data to Firestore
            await addDoc(collection(db, 'brides'), {
                userId: user.uid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                weddingDate: formData.weddingDate ? Timestamp.fromDate(new Date(formData.weddingDate)) : null,
                weddingVenue: formData.weddingVenue,
                expectedAttendants: formData.expectedAttendants,
                selectedServices: formData.selectedServices,
                packageValue,
                status: 'lead',
                depositPaid: 0,
                balanceDue: packageValue,
                attendants: [],
                moodboardPhotos: [],
                timeline: [],
                orgId: 'default',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // 4. Navigate to portal
            navigate('/noiva');
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está cadastrado. Faça login.');
            } else if (err.code === 'auth/invalid-email') {
                setError('E-mail inválido.');
            } else {
                setError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen pb-8 overflow-x-hidden"
            style={{
                background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)`
            }}
        >
            <div className="w-full max-w-[480px] mx-auto px-4">
                {/* Header */}
                <header className="py-6 flex items-center justify-between">
                    <button
                        onClick={() => currentStep > 1 ? prevStep() : navigate(-1)}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Crown size={20} style={{ color: ROSE }} />
                        <span className="text-white font-serif text-lg">Área da Noiva</span>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Progress */}
                <ProgressIndicator currentStep={currentStep} />

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "p-6 rounded-3xl mb-6",
                            "bg-white/10 backdrop-blur-2xl border border-white/20",
                            "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.3)]"
                        )}
                    >
                        {/* Step 1: Account */}
                        {currentStep === 1 && (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-serif text-white mb-2">Crie sua Conta</h2>
                                    <p className="text-white/60 text-sm">Suas credenciais de acesso</p>
                                </div>

                                <GlassInput
                                    icon={<User size={18} />}
                                    label="Seu Nome"
                                    value={formData.name}
                                    onChange={(v) => updateField('name', v)}
                                    placeholder="Ex: Mariana Santos"
                                />
                                <GlassInput
                                    icon={<Mail size={18} />}
                                    label="E-mail"
                                    type="email"
                                    value={formData.email}
                                    onChange={(v) => updateField('email', v)}
                                    placeholder="seu@email.com"
                                />
                                <GlassInput
                                    icon={<Phone size={18} />}
                                    label="WhatsApp"
                                    value={formData.phone}
                                    onChange={(v) => updateField('phone', v)}
                                    placeholder="(11) 99999-9999"
                                />
                                <GlassInput
                                    icon={<Lock size={18} />}
                                    label="Senha"
                                    type="password"
                                    value={formData.password}
                                    onChange={(v) => updateField('password', v)}
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </>
                        )}

                        {/* Step 2: Wedding Details */}
                        {currentStep === 2 && (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-serif text-white mb-2">Seu Grande Dia</h2>
                                    <p className="text-white/60 text-sm">Detalhes do casamento</p>
                                </div>

                                <GlassInput
                                    icon={<Calendar size={18} />}
                                    label="Data do Casamento"
                                    type="date"
                                    value={formData.weddingDate}
                                    onChange={(v) => updateField('weddingDate', v)}
                                />
                                <GlassInput
                                    icon={<MapPin size={18} />}
                                    label="Local do Casamento"
                                    value={formData.weddingVenue}
                                    onChange={(v) => updateField('weddingVenue', v)}
                                    placeholder="Ex: Espaço Villa Real"
                                />

                                <div className="mb-4">
                                    <label className="block text-sm text-white/70 mb-2 font-medium">
                                        Quantas acompanhantes para produção?
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => updateField('expectedAttendants', Math.max(0, formData.expectedAttendants - 1))}
                                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="text-3xl font-bold text-white min-w-[3rem] text-center">
                                            {formData.expectedAttendants}
                                        </span>
                                        <button
                                            onClick={() => updateField('expectedAttendants', formData.expectedAttendants + 1)}
                                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3: Services */}
                        {currentStep === 3 && (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-serif text-white mb-2">Serviços de Interesse</h2>
                                    <p className="text-white/60 text-sm">Selecione os que deseja (opcional)</p>
                                </div>

                                <div className="space-y-3">
                                    {SAMPLE_SERVICES.map((service) => {
                                        const isSelected = formData.selectedServices.includes(service.id);
                                        return (
                                            <button
                                                key={service.id}
                                                onClick={() => toggleService(service.id)}
                                                className={cn(
                                                    "w-full p-4 rounded-2xl text-left transition-all",
                                                    "bg-white/5 backdrop-blur-xl border",
                                                    isSelected
                                                        ? "border-white/40 shadow-[0_0_20px_rgba(232,160,184,0.3)]"
                                                        : "border-white/10 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-white font-medium">{service.name}</p>
                                                        <p className="text-white/50 text-sm">{service.desc}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-white/70 font-semibold">
                                                            R$ {service.price}
                                                        </span>
                                                        <div
                                                            className={cn(
                                                                "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                                                isSelected
                                                                    ? "bg-white/30 border-white/50"
                                                                    : "border-white/20"
                                                            )}
                                                        >
                                                            {isSelected && <Check size={14} className="text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Step 4: Confirmation */}
                        {currentStep === 4 && (
                            <>
                                <div className="text-center mb-6">
                                    <div
                                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${ROSE_LIGHT} 0%, ${ROSE} 100%)` }}
                                    >
                                        <Heart size={36} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-serif text-white mb-2">Quase Lá!</h2>
                                    <p className="text-white/60 text-sm">Confirme seus dados</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/50 text-xs">Nome</p>
                                        <p className="text-white font-medium">{formData.name || '-'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/50 text-xs">E-mail</p>
                                        <p className="text-white font-medium">{formData.email || '-'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/50 text-xs">Data do Casamento</p>
                                        <p className="text-white font-medium">
                                            {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('pt-BR') : '-'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/50 text-xs">Acompanhantes</p>
                                        <p className="text-white font-medium">{formData.expectedAttendants} pessoas</p>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => updateField('acceptTerms', e.target.checked)}
                                        className="mt-0.5"
                                    />
                                    <span className="text-white/70 text-sm">
                                        Li e aceito os <span style={{ color: ROSE }}>Termos de Uso</span> e a{' '}
                                        <span style={{ color: ROSE }}>Política de Privacidade</span>
                                    </span>
                                </label>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className={cn(
                                "flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2",
                                "bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                            )}
                        >
                            <ArrowLeft size={18} />
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={currentStep === 4 ? handleSubmit : nextStep}
                        disabled={currentStep === 4 && !formData.acceptTerms}
                        className={cn(
                            "flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                            "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_8px_24px_-4px_rgba(232,160,184,0.4)]",
                            currentStep === 4 && !formData.acceptTerms
                                ? "bg-white/10 text-white/40 cursor-not-allowed"
                                : "text-white"
                        )}
                        style={{
                            background: currentStep === 4 && !formData.acceptTerms
                                ? undefined
                                : `linear-gradient(135deg, ${ROSE} 0%, ${ROSE_LIGHT} 100%)`
                        }}
                    >
                        {currentStep === 4 ? (
                            <>
                                <Sparkles size={18} />
                                Criar Minha Conta
                            </>
                        ) : (
                            <>
                                Continuar
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrideSelfOnboardingPage;
