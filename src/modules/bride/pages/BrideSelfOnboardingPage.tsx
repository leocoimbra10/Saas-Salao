/**
 * BRIDE SELF-ONBOARDING PAGE  
 * Multi-step neomorphic registration for brides (WITHOUT account creation step)
 * Style: Neomorphic (matching app design)
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Users, Crown, MapPin, ArrowRight, ArrowLeft, PartyPopper, Heart, Sparkles } from 'lucide-react';
import { Typography, NeoButton, NeoCard, NeoInput } from '../../../shared/components/ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../shared/lib/utils';
import { useAuth } from '../../auth/context/AuthContext';
import { createBridalPackage } from '../services/brideService';
import { db } from '../../../shared/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Service } from '../../../shared/types/types';

// Types
type Step = 1 | 2 | 3; // Apenas 3 steps agora: Wedding Details, Services, Confirmation

interface FormData {
    // Step 1: Wedding Details  
    weddingDate: string;
    weddingVenue: string;
    expectedAttendants: number;
    // Step 2: Services
    selectedServices: string[];
    // Step 3: Confirmation
    acceptTerms: boolean;
}

// Progress Indicator - agora só 3 steps
const ProgressIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
                <div
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                        step === currentStep
                            ? "bg-neo-accent shadow-neo-out-lg text-white"
                            : step < currentStep
                                ? "bg-neo-accent/70 text-white"
                                : "bg-neo-bg shadow-neo-in text-neo-text-secondary"
                    )}
                >
                    {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                    <div
                        className={cn(
                            "w-8 h-1 mx-1 transition-all duration-300 rounded-full",
                            step < currentStep ? "bg-neo-accent" : "bg-neo-bg shadow-neo-in"
                        )}
                    />
                )}
            </div>
        ))}
    </div>
);

// Main Component
export const BrideSelfOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState<Step>(1); // Começa no step 1 (Wedding Details)
    const [formData, setFormData] = useState<FormData>({
        weddingDate: '',
        weddingVenue: '',
        expectedAttendants: 0,
        selectedServices: [],
        acceptTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [error, setError] = useState('');

    // Services from Firestore
    const [brideServices, setBrideServices] = useState<Service[]>([]);
    const [attendantServices, setAttendantServices] = useState<Service[]>([]);

    // Fetch services from Firestore
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoadingServices(true);

                // Query all active services
                const servicesRef = collection(db, 'services');
                const q = query(servicesRef, where('orgId', '==', 'default'));
                const snapshot = await getDocs(q);

                const allServices: Service[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                } as Service));

                // Categorize services
                const bride: Service[] = [];
                const attendant: Service[] = [];

                allServices.forEach(service => {
                    // Check if service is for bride (tags or name contains 'noiva')
                    const isBrideService =
                        service.tags?.some(tag => tag.toLowerCase().includes('noiva')) ||
                        service.name.toLowerCase().includes('noiva') ||
                        service.name.toLowerCase().includes('casamento');

                    if (isBrideService) {
                        bride.push(service);
                    } else {
                        // Services for attendants
                        attendant.push(service);
                    }
                });

                setBrideServices(bride);
                setAttendantServices(attendant);
            } catch (err) {
                console.error('Error fetching services:', err);
            } finally {
                setIsLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

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
        if (currentStep < 3) {
            setCurrentStep((currentStep + 1) as Step);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            setError('Você precisa estar logado para continuar');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await createBridalPackage({
                clientId: user.uid,
                clientName: user.displayName || '',
                clientPhone: '', // Can be added to formData later if needed
                orgId: 'default',
                weddingDate: new Date(formData.weddingDate)
            });

            navigate('/noiva');
        } catch (err) {
            console.error('Error creating bridal package:', err);
            setError('Erro ao cadastrar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
                <NeoButton
                    variant="neu"
                    size="icon"
                    onClick={() => navigate('/noiva')}
                >
                    <ArrowLeft size={20} className="text-neo-text" />
                </NeoButton>

                <div className="flex items-center gap-2">
                    <Crown className="text-neo-accent" size={20} />
                    <h1 className="text-lg font-serif text-neo-text">Área da Noiva</h1>
                </div>

                <div className="w-11" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-md mx-auto">
                    <ProgressIndicator currentStep={currentStep} />

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-neo bg-neo-bg shadow-neo-out mb-6"
                        >
                            {/* Step 1: Wedding Details */}
                            {currentStep === 1 && (
                                <>
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-serif text-neo-text mb-2">Seu Grande Dia</h2>
                                        <p className="text-neo-text-secondary text-sm">Conte-nos mais sobre o seu casamento</p>
                                    </div>

                                    <NeoInput
                                        icon={<Calendar size={18} />}
                                        label="Data do Casamento"
                                        type="date"
                                        value={formData.weddingDate}
                                        onChange={(e) => updateField('weddingDate', e.target.value)}
                                        helperText="Quando será o grande dia?"
                                    />
                                    <NeoInput
                                        icon={<MapPin size={18} />}
                                        label="Local do Casamento"
                                        value={formData.weddingVenue}
                                        onChange={(e) => updateField('weddingVenue', e.target.value)}
                                        placeholder="Ex: Espaço Villa Real"
                                        helperText="Onde será a festa?"
                                    />

                                    <div className="mb-6">
                                        <Typography variant="label" className="mb-2">Quantas acompanhantes?</Typography>
                                        <Typography variant="caption" className="mb-3 italic">Madrinhas, mães, irmãs que também farão maquiagem e penteado</Typography>
                                        <div className="flex items-center gap-4">
                                            <NeoButton
                                                variant="neu"
                                                size="icon"
                                                onClick={() => updateField('expectedAttendants', Math.max(0, formData.expectedAttendants - 1))}
                                                className="w-12 h-12 text-xl font-bold"
                                            >
                                                -
                                            </NeoButton>
                                            <span className="text-3xl font-bold text-neo-text min-w-[3rem] text-center">
                                                {formData.expectedAttendants}
                                            </span>
                                            <NeoButton
                                                variant="neu"
                                                size="icon"
                                                onClick={() => updateField('expectedAttendants', formData.expectedAttendants + 1)}
                                                className="w-12 h-12 text-xl font-bold"
                                            >
                                                +
                                            </NeoButton>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 2: Services */}
                            {currentStep === 2 && (
                                <>
                                    <div className="text-center mb-6">
                                        <Typography variant="h2" className="mb-2">Serviços de Interesse</Typography>
                                        <Typography variant="body" className="text-neo-text-secondary text-sm">Selecione os que deseja (opcional)</Typography>
                                    </div>

                                    {isLoadingServices ? (
                                        <div className="text-center py-12">
                                            <div className="w-12 h-12 border-4 border-neo-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <Typography variant="body" className="text-neo-text-secondary text-sm">Carregando serviços...</Typography>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Bride Services */}
                                            {brideServices.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-neo-text mb-3 flex items-center gap-2">
                                                        <Crown size={16} className="text-neo-accent" />
                                                        Serviços da Noiva
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {brideServices.map(service => {
                                                            const isSelected = formData.selectedServices.includes(service.id);
                                                            return (
                                                                <NeoButton
                                                                    key={service.id}
                                                                    variant={isSelected ? 'outline' : 'neu'}
                                                                    onClick={() => toggleService(service.id)}
                                                                    className={cn(
                                                                        "w-full h-auto p-4 flex flex-row items-center justify-between",
                                                                        isSelected ? "border-neo-accent" : ""
                                                                    )}
                                                                >
                                                                    <div className="text-left">
                                                                        <Typography variant="body" className="font-medium">{service.name}</Typography>
                                                                        <Typography variant="caption" className="text-neo-text-secondary">R$ {service.price.toFixed(2)}</Typography>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                                                isSelected
                                                                                    ? "bg-neo-accent border-neo-accent text-white"
                                                                                    : "border-neo-text-secondary"
                                                                            )}
                                                                        >
                                                                            {isSelected && <Check size={14} className="text-white" />}
                                                                        </div>
                                                                    </div>
                                                                </NeoButton>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Attendant Services */}
                                            {attendantServices.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-neo-text mb-3 flex items-center gap-2">
                                                        <Users size={16} className="text-neo-accent" />
                                                        Serviços para Acompanhantes
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {attendantServices.map(service => {
                                                            const isSelected = formData.selectedServices.includes(service.id);
                                                            return (
                                                                <NeoButton
                                                                    key={service.id}
                                                                    variant={isSelected ? 'outline' : 'neu'}
                                                                    onClick={() => toggleService(service.id)}
                                                                    className={cn(
                                                                        "w-full h-auto p-4 flex flex-row items-center justify-between",
                                                                        isSelected ? "border-neo-accent" : ""
                                                                    )}
                                                                >
                                                                    <div className="text-left">
                                                                        <Typography variant="body" className="font-medium">{service.name}</Typography>
                                                                        <Typography variant="caption" className="text-neo-text-secondary">R$ {service.price.toFixed(2)}</Typography>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                                                isSelected
                                                                                    ? "bg-neo-accent border-neo-accent text-white"
                                                                                    : "border-neo-text-secondary"
                                                                            )}
                                                                        >
                                                                            {isSelected && <Check size={14} className="text-white" />}
                                                                        </div>
                                                                    </div>
                                                                </NeoButton>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {brideServices.length === 0 && attendantServices.length === 0 && (
                                                <div className="text-center py-12">
                                                    <Typography variant="body" className="text-neo-text-secondary">Nenhum serviço cadastrado</Typography>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Step 3: Confirmation */}
                            {currentStep === 3 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg">
                                            <Heart className="text-white" size={32} />
                                        </div>
                                        <Typography variant="h2" className="mb-2">Quase lá!</Typography>
                                        <Typography variant="body" className="text-neo-text-secondary text-sm">Confirme seus dados</Typography>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <NeoCard className="p-4" variant="inset">
                                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Data do Casamento</Typography>
                                            <Typography variant="body" className="font-medium">
                                                {formData.weddingDate ? format(new Date(formData.weddingDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                                            </Typography>
                                        </NeoCard>
                                        <NeoCard className="p-4" variant="inset">
                                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Local</Typography>
                                            <Typography variant="body" className="font-medium">{formData.weddingVenue || '-'}</Typography>
                                        </NeoCard>
                                        <NeoCard className="p-4" variant="inset">
                                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Acompanhantes</Typography>
                                            <Typography variant="body" className="font-medium">{formData.expectedAttendants}</Typography>
                                        </NeoCard>
                                        <NeoCard className="p-4" variant="inset">
                                            <Typography variant="caption" className="text-neo-text-secondary mb-1">Serviços Selecionados</Typography>
                                            <Typography variant="body" className="font-medium">
                                                {formData.selectedServices.length > 0 ? formData.selectedServices.length : 'Nenhum'}
                                            </Typography>
                                        </NeoCard>
                                    </div>

                                    <label className="flex items-start gap-3 p-4 rounded-neo bg-neo-bg shadow-neo-in cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptTerms}
                                            onChange={(e) => updateField('acceptTerms', e.target.checked)}
                                            className="mt-1 w-5 h-5 rounded border-2 border-neo-text-secondary checked:bg-neo-accent checked:border-neo-accent transition-all"
                                        />
                                        <Typography variant="body" className="text-sm">
                                            Aceito compartilhar minhas informações para receber um atendimento personalizado
                                        </Typography>
                                    </label>

                                    {error && (
                                        <Typography variant="caption" className="mt-4 text-red-600 font-medium">{error}</Typography>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {currentStep > 1 && (
                            <NeoButton
                                variant="neu"
                                onClick={prevStep}
                                className="flex-1 gap-2"
                            >
                                <ArrowLeft size={18} />
                                Voltar
                            </NeoButton>
                        )}

                        {currentStep < 3 ? (
                            <NeoButton
                                variant="gradient"
                                onClick={nextStep}
                                disabled={
                                    (currentStep === 1 && (!formData.weddingDate || !formData.weddingVenue))
                                }
                                className="flex-1 gap-2"
                            >
                                Continuar
                                <ArrowRight size={18} />
                            </NeoButton>
                        ) : (
                            <NeoButton
                                variant="gradient"
                                onClick={handleSubmit}
                                disabled={!formData.acceptTerms || isLoading}
                                className="flex-1 gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Finalizando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Finalizar Cadastro
                                    </>
                                )}
                            </NeoButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
