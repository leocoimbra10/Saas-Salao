/**
 * BEAUTY SALON NEOMORPHIC APP - New Booking Modal
 * "The Glass Box" - Premium Assistant Experience
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Search,
    User,
    Calendar as CalendarIcon,
    Clock,
    Check,
    Sparkles,
    Scissors,
    CreditCard,
    QrCode,
    DollarSign
} from 'lucide-react';
import { format, addMinutes, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Service, Staff, Appointment } from '../../../shared/types/types';
import { Avatar, Badge, Button, Toggle } from '../../../shared/components/ui/NeoComponents';
import { db } from '../../../shared/lib/firebase';
import { useBranding } from '../../organization/context/BrandingContext';
import { useAppointmentMutations } from '../../booking/hooks/useAppointments';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CheckoutView } from '../../booking/components/CheckoutView';
import { BrideOnboarding } from '../../bride/components/BrideOnboarding';
import { updateBridalPackage, createBridalPackage } from '../../bride/services/brideService';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    initialTime?: string;
    initialStaffId?: string;
    initialAppointment?: Appointment | null;
    services: Service[];
    staff: Staff[];
    onSuccess: () => void;
}

// Client Search Result Type
interface ClientResult {
    id: string;
    name: string;
    phone: string;
    lastVisit?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
    isOpen,
    onClose,
    selectedDate,
    initialTime,
    initialStaffId,
    initialAppointment,
    services,
    staff,
    onSuccess
}) => {
    // --- Context & State ---
    const { organization } = useBranding();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Client/Service, 2: Time/Staff, 3: Payment
    const [clientSearch, setClientSearch] = useState(initialAppointment?.clientName || '');
    const [selectedClient, setSelectedClient] = useState<ClientResult | null>(
        initialAppointment ? {
            id: initialAppointment.clientId,
            name: initialAppointment.clientName,
            phone: initialAppointment.clientPhone
        } : null
    );
    const [searchResults, setSearchResults] = useState<ClientResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedServices, setSelectedServices] = useState<string[]>(initialAppointment?.services || []);
    const [selectedStaffId, setSelectedStaffId] = useState<string>(initialAppointment?.staffId || initialStaffId || '');
    const [selectedTime, setSelectedTime] = useState<string>(initialAppointment?.time || initialTime || '');

    const [depositPaid, setDepositPaid] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showBrideOnboarding, setShowBrideOnboarding] = useState(false);
    const { createAppointment: createAppt, isPending: isSubmitting } = useAppointmentMutations(organization?.id);
    const [showSuccess, setShowSuccess] = useState(false);

    // --- Real Client Search ---
    useEffect(() => {
        if (!organization) return;

        const searchClients = async () => {
            if (clientSearch.length < 3) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const q = query(
                    collection(db, 'clients'),
                    where('orgId', '==', organization.id)
                );

                const snapshot = await getDocs(q);
                const results = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as ClientResult))
                    .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));

                setSearchResults(results.slice(0, 5));
            } catch (error) {
                console.error("Error searching clients:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(searchClients, 500);
        return () => clearTimeout(timer);
    }, [clientSearch, organization]);

    // --- Calculations ---
    const selectedServiceObjects = useMemo(() =>
        services.filter(s => selectedServices.includes(s.id)),
        [selectedServices, services]);

    const totalDuration = useMemo(() =>
        selectedServiceObjects.reduce((acc, s) => acc + s.duration, 0),
        [selectedServiceObjects]);

    const totalAmount = useMemo(() =>
        selectedServiceObjects.reduce((acc, s) => acc + s.price, 0),
        [selectedServiceObjects]);

    const depositAmount = totalAmount * 0.3;

    // --- Handlers ---
    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleConfirm = () => {
        if (!selectedClient || selectedServices.length === 0) return;
        setShowCheckout(true);
    };

    const handleSubmit = async () => {
        if (!organization || !selectedClient) return;

        createAppt({
            orgId: organization.id,
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            clientPhone: selectedClient.phone,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            staffId: selectedStaffId,
            services: selectedServices,
            totalAmount,
            depositPaid: depositPaid ? depositAmount : 0,
            status: 'confirmed',
        } as any);

        const isBrideService = selectedServiceObjects.some(s => s.category === 'makeup' && s.name.toLowerCase().includes('noiva'));

        if (isBrideService) {
            setShowBrideOnboarding(true);
        } else {
            setShowSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
                setShowSuccess(false);
                setStep(1);
                setSelectedClient(null);
                setSelectedServices([]);
                setClientSearch('');
            }, 2000);
        }
    };

    const handleBrideComplete = async (brideData: any) => {
        if (!organization || !selectedClient) return;

        try {
            // 1. Check if bride package already exists
            const existingPkg = await updateBridalPackage(selectedClient.id, {
                weddingDate: new Date(brideData.weddingDate),
                organizationId: organization.id
            } as any);

            // 2. Or create new if service detected
            await createBridalPackage({
                clientId: selectedClient.id,
                clientName: selectedClient.name,
                clientPhone: selectedClient.phone,
                orgId: organization.id,
                weddingDate: new Date(brideData.weddingDate)
            });

            console.log("Bride Journey created/updated successfully");
        } catch (error) {
            console.error("Error updating bride journey:", error);
        }

        setShowBrideOnboarding(false);
        setShowSuccess(true);
        setTimeout(() => {
            onSuccess();
            onClose();
            setShowSuccess(false);
            setStep(1);
            setSelectedClient(null);
            setSelectedServices([]);
            setClientSearch('');
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Silent Luxury Glass Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className={cn(
                            "relative w-full max-w-lg overflow-hidden",
                            "rounded-neo",
                            // Standard Neomorphism
                            "bg-neo-bg shadow-neo-out border border-white/50"
                        )}
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-4 text-center border-b border-neo-text-secondary/10">
                            <h2 className="text-2xl font-serif text-neo-text tracking-tight">Novo Agendamento</h2>
                            <p className="text-sm text-neo-text-secondary mt-1 uppercase tracking-widest font-medium">
                                {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                                {selectedTime && ` • ${selectedTime}`}
                            </p>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">

                            {/* Step 1: Who & What */}
                            <div className={cn("space-y-6 transition-opacity duration-300", step !== 1 && "opacity-50 pointer-events-none hidden")}>

                                {/* Client Search */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-neo-accent font-bold ml-1">
                                        Cliente
                                    </label>
                                    <div className="relative z-20">
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary group-focus-within:text-neo-accent transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={selectedClient ? selectedClient.name : clientSearch}
                                                onChange={(e) => {
                                                    setClientSearch(e.target.value);
                                                    setSelectedClient(null);
                                                }}
                                                placeholder="Buscar cliente..."
                                                className="w-full pl-12 pr-4 py-4 bg-neo-bg rounded-neo shadow-neo-in border-none text-neo-text placeholder:text-neo-text-secondary focus:outline-none focus:ring-2 focus:ring-neo-accent/20 transition-all"
                                            />
                                            {selectedClient && (
                                                <button
                                                    onClick={() => { setSelectedClient(null); setClientSearch(''); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Search Results Dropdown */}
                                        <AnimatePresence>
                                            {isSearching || searchResults.length > 0 && !selectedClient ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-30"
                                                >
                                                    {searchResults.map(client => (
                                                        <button
                                                            key={client.id}
                                                            onClick={() => {
                                                                setSelectedClient(client);
                                                                setSearchResults([]);
                                                            }}
                                                            className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors flex items-center justify-between border-b border-white/5 last:border-0"
                                                        >
                                                            <span className="font-medium text-white">{client.name}</span>
                                                            <span className="text-xs text-white/40">{client.phone}</span>
                                                        </button>
                                                    ))}
                                                    {searchResults.length === 0 && !isSearching && clientSearch.length > 2 && (
                                                        <div className="p-4 text-center">
                                                            <p className="text-sm text-white/40">Cliente não encontrado</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold ml-1">
                                        Serviços
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {services.map(service => {
                                            const isSelected = selectedServices.includes(service.id);
                                            return (
                                                <button
                                                    key={service.id}
                                                    onClick={() => handleServiceToggle(service.id)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left group",
                                                        isSelected
                                                            ? "bg-[#D4AF37]/20 border-[#D4AF37]/50"
                                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                        isSelected ? "bg-[#D4AF37] text-white" : "bg-white/10 text-white/60"
                                                    )}>
                                                        {service.category === 'makeup' ? <Sparkles size={16} /> : <Scissors size={16} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={cn("text-base font-medium", isSelected ? "text-white" : "text-white/80")}>{service.name}</p>
                                                        <p className="text-xs text-white/40 mt-0.5">
                                                            {service.duration} min • {formatCurrency(service.price)}
                                                        </p>
                                                    </div>
                                                    {isSelected && <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                                        <Check size={14} className="text-white" />
                                                    </div>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>

                            {/* Step 2: Confirmation */}
                            <div className={cn("space-y-8 transition-opacity duration-300", step !== 2 && "opacity-50 pointer-events-none hidden")}>
                                {/* Staff Selection (Horizontal Scroll) */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold ml-1">
                                        Profissional
                                    </label>
                                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                        {staff.map(member => {
                                            const isSelected = selectedStaffId === member.id;
                                            return (
                                                <button
                                                    key={member.id}
                                                    onClick={() => setSelectedStaffId(member.id)}
                                                    className="relative flex flex-col items-center gap-2 group min-w-[70px]"
                                                >
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-full border-2 transition-all p-0.5",
                                                        isSelected ? "border-[#D4AF37] scale-110" : "border-transparent group-hover:border-white/20"
                                                    )}>
                                                        <div className="w-full h-full rounded-full bg-white/10 overflow-hidden">
                                                            <Avatar size="md" src={member.photo} />
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "text-xs font-medium transition-colors",
                                                        isSelected ? "text-[#D4AF37]" : "text-white/60"
                                                    )}>
                                                        {member.name}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-white/80">
                                        <span className="text-sm">Total Estimado</span>
                                        <span className="text-xl font-serif">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="w-full h-px bg-white/10" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#D4AF37]">Sinal (30%)</span>
                                        <button
                                            onClick={() => setDepositPaid(!depositPaid)}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
                                                depositPaid
                                                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                                                    : "bg-transparent border-white/20 text-white/40 hover:border-white/40"
                                            )}
                                        >
                                            {depositPaid ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                            <span className="text-xs font-bold">{formatCurrency(depositAmount)}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Action */}
                        <div className="p-6 bg-white/5 border-t border-white/10">
                            <Button
                                className="w-full h-14 text-base font-medium tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                                variant="primary"
                                disabled={(!selectedClient || selectedServices.length === 0) && step === 1}
                                onClick={() => {
                                    if (step === 1) setStep(2);
                                    else handleConfirm();
                                }}
                            >
                                {step === 1 ? 'Continuar' : isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                            </Button>
                        </div>

                        {/* Checkout View Overlay */}
                        <CheckoutView
                            isOpen={showCheckout}
                            onClose={() => setShowCheckout(false)}
                            amount={totalAmount}
                            appointmentId="" // Will generate ID in service if needed
                            onSuccess={() => {
                                setShowCheckout(false);
                                handleSubmit();
                            }}
                        />

                        {/* Bride Onboarding Overlay */}
                        <BrideOnboarding
                            isOpen={showBrideOnboarding}
                            onClose={() => setShowBrideOnboarding(false)}
                            clientId={selectedClient?.id || ''}
                            onComplete={handleBrideComplete}
                        />

                        {/* Loading Overlay */}
                        {isSubmitting && (
                            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
