/**
 * BEAUTY SALON NEOMORPHIC APP - New Booking Modal (Redesigned)
 * Neomorphic style with client type selection and payment link generation
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Crown,
    User,
    Mail,
    Phone,
    Calendar as CalendarIcon,
    Clock,
    Plus,
    Trash2,
    Copy,
    Check,
    ChevronDown
} from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../shared/lib/utils';
import { Service } from '../../../shared/types/types';
import { db } from '../../../shared/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
    NeoButton as NeoButton,
    NeoInput as NeoInput,
    NeoSelect as Select,
    Typography,
    NeoCard as NeoCard,
    Badge
} from '../../../shared/components/ui/NeoComponents';
import { Staff, Appointment } from '../../../shared/types/types';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    services: Service[];
    onSuccess: () => void;
    initialTime?: string;
    initialStaffId?: string;
    initialAppointment?: Appointment | null;
    staff?: Staff[];
}

type ClientType = 'bride' | 'regular' | null;
type Step = 1 | 2 | 3 | 4;

interface ClientData {
    name: string;
    email: string;
    phone: string;
}

interface SelectedService {
    id: string;
    name: string;
    price: number;
    duration: number;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
    isOpen,
    onClose,
    selectedDate,
    services,
    onSuccess,
    initialTime = '10:00',
    initialStaffId = '',
    initialAppointment = null,
    staff = []
}) => {
    const [step, setStep] = useState<Step>(initialAppointment ? 2 : 1);
    const [clientType, setClientType] = useState<ClientType>(initialAppointment ? (initialAppointment.services.some(s => s.toLowerCase().includes('noiva')) ? 'bride' : 'regular') : null);
    const [clientData, setClientData] = useState<ClientData>({
        name: initialAppointment?.clientName || '',
        email: initialAppointment?.clientEmail || '',
        phone: initialAppointment?.clientPhone || ''
    });
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId);
    const [isGenerating, setIsGenerating] = useState(false);
    const [paymentLink, setPaymentLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(initialAppointment ? 2 : 1);
                setClientType(initialAppointment ? (initialAppointment.services.some(s => s.toLowerCase().includes('noiva')) ? 'bride' : 'regular') : null);
                setClientData({
                    name: initialAppointment?.clientName || '',
                    email: initialAppointment?.clientEmail || '',
                    phone: initialAppointment?.clientPhone || ''
                });
                setSelectedServices([]);
                setSelectedTime(initialTime);
                setSelectedStaffId(initialStaffId);
                setPaymentLink('');
                setLinkCopied(false);
            }, 300);
        }
    }, [isOpen, initialAppointment, initialTime, initialStaffId]);

    // Filter services by client type
    const filteredServices = services.filter(service => {
        // Check if service is bridal-related by name or tags
        const isBridalService = service.name.toLowerCase().includes('noiva') ||
            service.name.toLowerCase().includes('casamento') ||
            (service.tags && service.tags.some(tag => tag.toLowerCase().includes('noiva')));

        if (clientType === 'bride') {
            return isBridalService;
        } else if (clientType === 'regular') {
            return !isBridalService;
        }
        return false;
    });

    // Add service to selection
    const addService = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            setSelectedServices(prev => [...prev, {
                id: service.id,
                name: service.name,
                price: service.price,
                duration: service.duration
            }]);
        }
    };

    // Remove service from selection
    const removeService = (index: number) => {
        setSelectedServices(prev => prev.filter((_, i) => i !== index));
    };

    // Calculate totals
    const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const depositAmount = totalAmount * 0.3;

    // Generate payment link
    const generatePaymentLink = async () => {
        setIsGenerating(true);
        try {
            // Create payment link in Firestore
            const paymentLinkDoc = await addDoc(collection(db, 'paymentLinks'), {
                clientType,
                clientName: clientData.name,
                clientEmail: clientData.email,
                clientPhone: clientData.phone,
                appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
                appointmentTime: selectedTime,
                services: selectedServices.map(s => ({
                    id: s.id,
                    name: s.name,
                    price: s.price
                })),
                totalAmount,
                depositAmount,
                paymentDeadline: addHours(new Date(), 48),
                status: 'pending',
                createdAt: serverTimestamp(),
                orgId: 'default'
            });

            const link = `${window.location.origin}/pagamento/${paymentLinkDoc.id}`;
            setPaymentLink(link);
            setStep(4);
        } catch (error) {
            console.error('Error generating payment link:', error);
            alert('Erro ao gerar link de pagamento. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Copy link to clipboard
    const copyLink = () => {
        navigator.clipboard.writeText(paymentLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    // Handle next step
    const handleNext = () => {
        if (step === 1 && clientType) {
            setStep(2);
        } else if (step === 2 && clientData.name && clientData.email && clientData.phone) {
            setStep(3);
        } else if (step === 3 && selectedServices.length > 0) {
            generatePaymentLink();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={cn(
                        "relative w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden",
                        "bg-neo-bg rounded-t-3xl sm:rounded-3xl",
                        "shadow-neo-out border border-white/40"
                    )}
                >
                    {/* Header */}
                    <div className="relative flex items-center gap-3 p-6 pb-4 border-b border-neo-text-secondary/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center shadow-lg shrink-0">
                            <CalendarIcon className="text-white" size={20} />
                        </div>

                        <div className="flex-1">
                            <Typography variant="h3" className="text-xl tracking-tight">Novo Agendamento</Typography>
                            <Typography variant="caption" className="mt-0.5">
                                {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                            </Typography>
                        </div>

                        <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-2 shrink-0 rounded-full"
                        >
                            <X size={18} />
                        </NeoButton>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Client Type Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <Typography variant="h4" className="mb-2">Tipo de Cliente</Typography>
                                        <Typography variant="caption">Selecione o tipo de atendimento</Typography>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Bride NeoCard */}
                                        <NeoButton
                                            variant={clientType === 'bride' ? 'gradient' : 'neu'}
                                            fullWidth
                                            className="h-auto p-6 flex flex-col items-center gap-3"
                                            onClick={() => setClientType('bride')}
                                        >
                                            <Crown size={32} className={clientType === 'bride' ? 'text-white' : 'text-neo-accent'} />
                                            <Typography variant="h6" className={clientType === 'bride' ? 'text-white' : ''}>Noiva</Typography>
                                        </NeoButton>

                                        {/* Regular Client NeoCard */}
                                        <NeoButton
                                            onClick={() => setClientType('regular')}
                                            className={cn(
                                                "p-6 rounded-neo transition-all duration-300 flex flex-col items-center gap-3",
                                                clientType === 'regular'
                                                    ? "shadow-neo-in bg-gradient-to-br from-brand-primary to-brand-gold text-white"
                                                    : "shadow-neo-out hover:shadow-neo-in"
                                            )}
                                        >
                                            <User size={32} className={clientType === 'regular' ? 'text-white' : 'text-neo-accent'} />
                                            <span className={cn(
                                                "text-sm font-medium",
                                                clientType === 'regular' ? 'text-white' : 'text-neo-text'
                                            )}>Cliente Comum</span>
                                        </NeoButton>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Client Data */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="text-center mb-6">
                                        <Typography variant="h4" className="mb-2">Dados do Cliente</Typography>
                                        <Typography variant="caption">Preencha as informações de contato</Typography>
                                    </div>

                                    <NeoInput
                                        icon={<User size={18} />}
                                        label="Nome Completo"
                                        value={clientData.name}
                                        onChange={(e) => {
                                            const val = (e as React.ChangeEvent<HTMLInputElement>).target.value;
                                            setClientData(prev => ({ ...prev, name: val }));
                                        }}
                                        placeholder="Ex: Maria Silva"
                                    />
                                    <NeoInput
                                        icon={<Mail size={18} />}
                                        label="E-mail"
                                        type="email"
                                        value={clientData.email}
                                        onChange={(e) => {
                                            const val = (e as React.ChangeEvent<HTMLInputElement>).target.value;
                                            setClientData(prev => ({ ...prev, email: val }));
                                        }}
                                        placeholder="maria@email.com"
                                    />
                                    <NeoInput
                                        icon={<Phone size={18} />}
                                        label="WhatsApp"
                                        value={clientData.phone}
                                        onChange={(e) => {
                                            const val = (e as React.ChangeEvent<HTMLInputElement>).target.value;
                                            setClientData(prev => ({ ...prev, phone: val }));
                                        }}
                                        placeholder="(11) 99999-9999"
                                    />
                                </motion.div>
                            )}

                            {/* Step 3: Service Selection */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="text-center mb-6">
                                        <Typography variant="h4" className="mb-2">Serviços</Typography>
                                        <Typography variant="caption">Selecione os serviços desejados</Typography>
                                    </div>

                                    {/* Service Dropdown */}
                                    <div className="mb-4">
                                        <Select
                                            label="Adicionar Serviço"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    addService(e.target.value);
                                                }
                                            }}
                                            options={[
                                                { value: "", label: "Selecione um serviço..." },
                                                ...filteredServices.map(service => ({
                                                    value: service.id,
                                                    label: `${service.name} - R$ ${service.price.toFixed(2)}`
                                                }))
                                            ]}
                                        />
                                    </div>

                                    {/* Selected Services */}
                                    {selectedServices.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            <label className="block text-sm text-neo-text font-medium mb-2">Serviços Selecionados</label>
                                            {selectedServices.map((service, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-neo bg-neo-bg shadow-neo-in"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-neo-text">{service.name}</p>
                                                        <p className="text-xs text-neo-text-secondary">{service.duration} min</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-neo-text">
                                                            R$ {service.price.toFixed(2)}
                                                        </span>
                                                        <NeoButton
                                                            onClick={() => removeService(index)}
                                                            className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </NeoButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Total */}
                                    {selectedServices.length > 0 && (
                                        <div className="p-4 rounded-neo bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-[var(--color-brand-gold)]/10 shadow-neo-out border border-neo-accent/20">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-neo-text-secondary">Total</span>
                                                <span className="text-2xl font-bold text-neo-text">R$ {totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-neo-text-secondary">Sinal (30%)</span>
                                                <span className="text-sm font-semibold text-neo-accent">R$ {depositAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Selection */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-neo-text font-medium mb-2">Horário</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary" size={18} />
                                            <NeoInput
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-neo bg-neo-bg shadow-neo-in text-neo-text focus:outline-none focus:ring-2 focus:ring-neo-accent/20"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Payment Link Generated */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center shadow-lg">
                                        <Check size={40} className="text-white" />
                                    </div>

                                    <div>
                                        <Typography variant="h3" className="mb-2">Link Gerado!</Typography>
                                        <Typography variant="caption">
                                            Envie este link para {clientData.name} via WhatsApp
                                        </Typography>
                                    </div>

                                    <NeoCard className="p-4 shadow-neo-in">
                                        <Typography variant="label" className="mb-2 block">Link de Pagamento</Typography>
                                        <Typography variant="caption" className="break-all mb-3 block">{paymentLink}</Typography>
                                        <NeoButton
                                            fullWidth
                                            variant={linkCopied ? 'neu' : 'gradient'}
                                            onClick={copyLink}
                                            className={cn(
                                                "py-3",
                                                linkCopied && "bg-green-500 text-white"
                                            )}
                                            icon={linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                        >
                                            {linkCopied ? 'Copiado!' : 'Copiar Link'}
                                        </NeoButton>
                                    </NeoCard>

                                    <div className="p-3 rounded-neo bg-yellow-50 shadow-neo-in border border-yellow-200">
                                        <Typography variant="caption" className="text-yellow-800">
                                            ⏱️ O cliente tem <strong>48 horas</strong> para efetuar o pagamento do sinal
                                        </Typography>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step < 4 && (
                        <div className="p-6 pt-4 border-t border-neo-text-secondary/10 flex gap-3">
                            {step > 1 && (
                                <NeoButton
                                    onClick={() => setStep((step - 1) as Step)}
                                    className="px-6 py-3 rounded-neo bg-neo-bg shadow-neo-out hover:shadow-neo-in text-neo-text font-medium transition-all"
                                >
                                    Voltar
                                </NeoButton>
                            )}
                            <NeoButton
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && !clientType) ||
                                    (step === 2 && (!clientData.name || !clientData.email || !clientData.phone)) ||
                                    (step === 3 && selectedServices.length === 0) ||
                                    isGenerating
                                }
                                className={cn(
                                    "flex-1 py-3 rounded-neo font-medium transition-all",
                                    "bg-gradient-to-br from-brand-primary to-brand-gold text-white",
                                    "shadow-neo-out hover:shadow-neo-in",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {isGenerating ? 'Gerando...' : step === 3 ? 'Gerar Link de Pagamento' : 'Continuar'}
                            </NeoButton>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="p-6 pt-4 border-t border-neo-text-secondary/10">
                            <NeoButton
                                onClick={() => {
                                    onSuccess();
                                    onClose();
                                }}
                                className="w-full py-3 rounded-neo bg-gradient-to-br from-brand-primary to-brand-gold text-white font-medium shadow-neo-out hover:shadow-neo-in transition-all"
                            >
                                Concluir
                            </NeoButton>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

