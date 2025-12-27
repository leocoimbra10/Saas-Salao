/**
 * PUBLIC ONLINE BOOKING PAGE (Link da Bio)
 * Client-facing booking wizard with 4 steps
 * Style: Golden Neomorphic Light Theme
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Sparkles,
    Scissors,
    Calendar,
    Clock,
    User,
    Phone,
    DollarSign,
    Crown,
    Star
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Card, Button, Badge, Progress } from '../../../shared/components/ui/NeoComponents';
import { paymentService } from '../services/paymentService';

// Brand Colors - Rose Pink
const ROSE = '#E8A0B8';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

// Types
interface ServiceOption {
    id: string;
    name: string;
    price: number;
    duration: number;
    category: 'makeup' | 'hairstyle' | 'combo';
    hasDiscount?: boolean;
    discountDays?: string[];
}

interface Professional {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    rating: number;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

// Mock Data
const SERVICES: ServiceOption[] = [
    { id: '1', name: 'Maquiagem Social', price: 160, duration: 60, category: 'makeup' },
    { id: '2', name: 'Maquiagem Glamour', price: 220, duration: 90, category: 'makeup' },
    { id: '3', name: 'Penteado Coque', price: 140, duration: 45, category: 'hairstyle' },
    { id: '4', name: 'Penteado Semi-preso', price: 110, duration: 40, category: 'hairstyle' },
    { id: '5', name: 'Ondas Hollywood', price: 130, duration: 45, category: 'hairstyle' },
    { id: '6', name: 'Combo Seg-Qui', price: 190, duration: 120, category: 'combo', hasDiscount: true, discountDays: ['mon', 'tue', 'wed', 'thu'] },
    { id: '7', name: 'Combo Completo', price: 280, duration: 150, category: 'combo' },
];

const PROFESSIONALS: Professional[] = [
    { id: '1', name: 'Marcela', role: 'Maquiadora Chefe', rating: 5.0 },
    { id: '2', name: 'Vitória', role: 'Maquiadora', rating: 4.9 },
    { id: '3', name: 'Dani', role: 'Cabelereira', rating: 4.8 },
];

const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 18; hour++) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 });
        if (hour < 18) {
            slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3 });
        }
    }
    return slots;
};

// Step Progress Indicator
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
                key={idx}
                className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    idx < currentStep
                        ? 'bg-neo-accent'
                        : idx === currentStep
                            ? 'w-6'
                            : 'bg-neo-text-secondary/30'
                )}
                style={{ backgroundColor: idx <= currentStep ? GOLD : undefined }}
            />
        ))}
    </div>
);

// Step 1: Service Selection
const ServiceSelection: React.FC<{
    services: ServiceOption[];
    selected: string[];
    onSelect: (id: string) => void;
}> = ({ services, selected, onSelect }) => {
    const [filter, setFilter] = useState<'all' | 'makeup' | 'hairstyle' | 'combo'>('all');

    const filteredServices = filter === 'all'
        ? services
        : services.filter(s => s.category === filter);

    // Check if today is a discount day
    const today = new Date().getDay();
    const isDiscountDay = today >= 1 && today <= 4; // Mon-Thu

    return (
        <div>
            <h2 className="text-xl font-semibold text-neo-text mb-2">Escolha o serviço</h2>
            <p className="text-sm text-neo-text-secondary mb-4">Selecione um ou mais serviços</p>

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'makeup', label: 'Maquiagem' },
                    { id: 'hairstyle', label: 'Cabelo' },
                    { id: 'combo', label: 'Combos' },
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id as typeof filter)}
                        className={cn(
                            'px-4 py-2 rounded-neo text-sm font-medium whitespace-nowrap transition-all',
                            filter === cat.id
                                ? 'shadow-neo-pressed'
                                : 'shadow-neo-out text-neo-text-secondary'
                        )}
                        style={{ color: filter === cat.id ? GOLD : undefined }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Service List */}
            <div className="space-y-3">
                {filteredServices.map(service => {
                    const isSelected = selected.includes(service.id);
                    const showDiscount = service.hasDiscount && isDiscountDay;
                    const finalPrice = showDiscount ? service.price * 0.9 : service.price;

                    return (
                        <motion.button
                            key={service.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(service.id)}
                            className={cn(
                                'w-full p-4 rounded-neo text-left transition-all relative',
                                isSelected ? 'shadow-neo-pressed ring-2' : 'shadow-neo-out'
                            )}
                            style={{
                                borderColor: isSelected ? GOLD : 'transparent'
                            }}
                        >
                            {showDiscount && (
                                <Badge
                                    variant="success"
                                    className="absolute -top-2 right-3 text-[10px]"
                                >
                                    10% OFF
                                </Badge>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'w-10 h-10 rounded-neo flex items-center justify-center',
                                            isSelected ? '' : 'shadow-neo-in'
                                        )}
                                        style={{ backgroundColor: isSelected ? GOLD_LIGHT : undefined }}
                                    >
                                        {service.category === 'makeup' ? (
                                            <Sparkles size={18} style={{ color: GOLD }} />
                                        ) : service.category === 'combo' ? (
                                            <Crown size={18} style={{ color: GOLD }} />
                                        ) : (
                                            <Scissors size={18} style={{ color: GOLD }} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neo-text">{service.name}</p>
                                        <p className="text-xs text-neo-text-secondary">{service.duration} min</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {showDiscount && (
                                        <p className="text-xs text-neo-text-secondary line-through">
                                            {formatCurrency(service.price)}
                                        </p>
                                    )}
                                    <p className="font-bold text-lg" style={{ color: GOLD }}>
                                        {formatCurrency(finalPrice)}
                                    </p>
                                </div>
                            </div>

                            {/* Selection Check */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: GOLD }}
                                >
                                    <Check size={12} className="text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

// Step 2: Professional Selection
const ProfessionalSelection: React.FC<{
    professionals: Professional[];
    selected: string | null;
    onSelect: (id: string) => void;
}> = ({ professionals, selected, onSelect }) => (
    <div>
        <h2 className="text-xl font-semibold text-neo-text mb-2">Escolha a profissional</h2>
        <p className="text-sm text-neo-text-secondary mb-4">Quem você prefere?</p>

        <div className="space-y-3">
            {professionals.map(pro => (
                <motion.button
                    key={pro.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(pro.id)}
                    className={cn(
                        'w-full p-4 rounded-neo text-left transition-all',
                        selected === pro.id ? 'shadow-neo-pressed ring-2' : 'shadow-neo-out'
                    )}
                    style={{
                        borderColor: selected === pro.id ? GOLD : 'transparent'
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: GOLD_LIGHT, color: GOLD }}
                        >
                            {pro.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-neo-text">{pro.name}</p>
                            <p className="text-sm text-neo-text-secondary">{pro.role}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Star size={14} fill={GOLD} style={{ color: GOLD }} />
                                <span className="text-sm font-medium">{pro.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        {selected === pro.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: GOLD }}
                            >
                                <Check size={14} className="text-white" />
                            </motion.div>
                        )}
                    </div>
                </motion.button>
            ))}
        </div>
    </div>
);

// Step 3: Date & Time Selection
const DateTimeSelection: React.FC<{
    selectedDate: Date | null;
    selectedTime: string | null;
    onDateSelect: (date: Date) => void;
    onTimeSelect: (time: string) => void;
}> = ({ selectedDate, selectedTime, onDateSelect, onTimeSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const timeSlots = useMemo(() => generateTimeSlots(), [selectedDate]);

    // Generate calendar days
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: (Date | null)[] = [];

        // Empty slots before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Days in month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const days = getDaysInMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div>
            <h2 className="text-xl font-semibold text-neo-text mb-2">Escolha data e horário</h2>
            <p className="text-sm text-neo-text-secondary mb-4">Quando você pode vir?</p>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-2 rounded-neo shadow-neo-out active:shadow-neo-pressed"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="font-semibold text-neo-text">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-2 rounded-neo shadow-neo-out active:shadow-neo-pressed"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="text-center text-xs text-neo-text-secondary py-2">
                        {day}
                    </div>
                ))}
                {days.map((day, idx) => {
                    if (!day) return <div key={idx} />;

                    const isPast = day < today;
                    const isSelected = selectedDate?.toDateString() === day.toDateString();
                    const isToday = day.toDateString() === today.toDateString();

                    return (
                        <button
                            key={idx}
                            disabled={isPast}
                            onClick={() => onDateSelect(day)}
                            className={cn(
                                'aspect-square rounded-neo flex items-center justify-center text-sm font-medium transition-all',
                                isPast && 'opacity-30 cursor-not-allowed',
                                isSelected ? 'shadow-neo-pressed text-white' : 'shadow-neo-out',
                                isToday && !isSelected && 'ring-1'
                            )}
                            style={{
                                backgroundColor: isSelected ? GOLD : undefined
                            }}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm font-medium text-neo-text mb-3">Horários disponíveis</p>
                    <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map(slot => (
                            <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => slot.available && onTimeSelect(slot.time)}
                                className={cn(
                                    'py-2 rounded-neo text-sm font-medium transition-all',
                                    !slot.available && 'opacity-30 cursor-not-allowed line-through',
                                    selectedTime === slot.time ? 'shadow-neo-pressed text-white' : 'shadow-neo-out'
                                )}
                                style={{ backgroundColor: selectedTime === slot.time ? GOLD : undefined }}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Step 4: Client Details
const ClientDetails: React.FC<{
    name: string;
    phone: string;
    onNameChange: (name: string) => void;
    onPhoneChange: (phone: string) => void;
    totalAmount: number;
    depositAmount: number;
}> = ({ name, phone, onNameChange, onPhoneChange, totalAmount, depositAmount }) => (
    <div>
        <h2 className="text-xl font-semibold text-neo-text mb-2">Seus dados</h2>
        <p className="text-sm text-neo-text-secondary mb-4">Para confirmar o agendamento</p>

        <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                    Seu nome
                </label>
                <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Como podemos te chamar?"
                        className="w-full pl-12 pr-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                    WhatsApp
                </label>
                <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-12 pr-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                    />
                </div>
            </div>
        </div>

        {/* Payment Summary */}
        <Card className="p-4" style={{ backgroundColor: GOLD_LIGHT }}>
            <h3 className="font-semibold text-neo-text mb-3 flex items-center gap-2">
                <DollarSign size={18} style={{ color: GOLD }} />
                Resumo do Pagamento
            </h3>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-neo-text-secondary">Total</span>
                    <span className="font-bold text-neo-text">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neo-text-secondary">Sinal (para confirmar)</span>
                    <span className="font-bold" style={{ color: GOLD }}>{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neo-text-secondary">Restante no dia</span>
                    <span className="text-neo-text">{formatCurrency(totalAmount - depositAmount)}</span>
                </div>
            </div>
        </Card>

        {/* PIX Payment Card */}
        <Card className="p-4 mt-4">
            <h3 className="font-semibold text-neo-text mb-3 flex items-center gap-2">
                💳 Pagamento via PIX
            </h3>
            <div className="bg-neo-bg rounded-neo shadow-neo-in p-3 mb-3">
                <p className="text-xs text-neo-text-secondary mb-1">Chave PIX</p>
                <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-neo-text">marcela@studio.com</code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('marcela@studio.com');
                            alert('PIX copiado!');
                        }}
                        className="px-3 py-1 rounded-neo shadow-neo-out text-xs font-medium active:shadow-neo-pressed transition-all"
                        style={{ color: GOLD }}
                    >
                        Copiar
                    </button>
                </div>
            </div>
            <p className="text-xs text-neo-text-secondary">
                Pix ou cartão no local. Sinal de 25% para confirmar agendamento.
            </p>
        </Card>
    </div>
);

// Main Online Booking Page
export const OnlineBookingPage: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    const TOTAL_STEPS = 4;

    // Calculate totals
    const selectedServiceDetails = SERVICES.filter(s => selectedServices.includes(s.id));
    const today = new Date().getDay();
    const isDiscountDay = today >= 1 && today <= 4;

    const totalAmount = selectedServiceDetails.reduce((sum, s) => {
        const price = s.hasDiscount && isDiscountDay ? s.price * 0.9 : s.price;
        return sum + price;
    }, 0);
    const depositAmount = Math.round(totalAmount * 0.25); // 25% deposit

    // Navigation
    const canProceed = () => {
        switch (currentStep) {
            case 0: return selectedServices.length > 0;
            case 1: return selectedProfessional !== null;
            case 2: return selectedDate !== null && selectedTime !== null;
            case 3: return clientName.trim() !== '' && clientPhone.length >= 10;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit booking
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const bookingId = `BK${Date.now().toString().slice(-8)}`;

            // 1. Create payment record in Firestore
            const paymentId = await paymentService.createPaymentRecord({
                appointmentId: bookingId,
                amount: depositAmount,
                currency: 'BRL',
                method: 'pix',
                metadata: {
                    clientName,
                    clientPhone,
                    services: selectedServiceDetails.map(s => s.name).join(', '),
                    professional: PROFESSIONALS.find(p => p.id === selectedProfessional)?.name,
                }
            });

            // 2. Navigate to checkout page with booking and payment data
            navigate('/checkout', {
                state: {
                    checkoutData: {
                        totalAmount,
                        depositPercentage: 25,
                        depositType: 'percentage',
                        pixKey: 'pagamentos@salaobeauty.com.br',
                        serviceName: selectedServiceDetails.map(s => s.name).join(', '),
                        date: selectedDate?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }),
                        time: selectedTime?.replace(':', 'h'),
                        professional: PROFESSIONALS.find(p => p.id === selectedProfessional)?.name,
                        bookingId,
                        paymentId,
                    }
                }
            });
        } catch (error) {
            console.error("Error creating payment record:", error);
            // We could show a toast here if we had one available
        }
    };

    const handleServiceToggle = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        {currentStep > 0 ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="w-10 h-10 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center active:shadow-neo-pressed"
                            >
                                <ChevronLeft size={20} className="text-neo-text-secondary" />
                            </button>
                        ) : (
                            <div className="w-10" />
                        )}
                        <div className="text-center">
                            <h1 className="font-display font-semibold text-neo-text">Agendar</h1>
                            <p className="text-xs text-neo-text-secondary">Marcela Coimbra Studio</p>
                        </div>
                        <div className="w-10" />
                    </div>

                    <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                </header>

                {/* Content */}
                <main className="px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentStep === 0 && (
                                <ServiceSelection
                                    services={SERVICES}
                                    selected={selectedServices}
                                    onSelect={handleServiceToggle}
                                />
                            )}
                            {currentStep === 1 && (
                                <ProfessionalSelection
                                    professionals={PROFESSIONALS}
                                    selected={selectedProfessional}
                                    onSelect={setSelectedProfessional}
                                />
                            )}
                            {currentStep === 2 && (
                                <DateTimeSelection
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    onDateSelect={setSelectedDate}
                                    onTimeSelect={setSelectedTime}
                                />
                            )}
                            {currentStep === 3 && (
                                <ClientDetails
                                    name={clientName}
                                    phone={clientPhone}
                                    onNameChange={setClientName}
                                    onPhoneChange={setClientPhone}
                                    totalAmount={totalAmount}
                                    depositAmount={depositAmount}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Bottom Action Bar - Always visible when services selected */}
                {selectedServices.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed left-4 right-4 max-w-[460px] mx-auto"
                        style={{ bottom: '100px', zIndex: 60 }}
                    >
                        <div
                            className="rounded-2xl p-4"
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs text-neo-text-secondary">
                                        {selectedServices.length} {selectedServices.length === 1 ? 'serviço' : 'serviços'} selecionado(s)
                                    </p>
                                    <p className="text-lg font-bold text-neo-accent">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all no-glass"
                                    style={{
                                        background: canProceed()
                                            ? 'linear-gradient(135deg, #E8A0B8 0%, #C67A94 100%)'
                                            : 'rgba(180, 180, 190, 0.5)',
                                        color: canProceed() ? 'white' : 'rgba(100, 100, 110, 0.6)',
                                        boxShadow: canProceed()
                                            ? '0 4px 12px rgba(232, 160, 184, 0.4)'
                                            : 'none',
                                        minWidth: '140px',
                                    }}
                                >
                                    {currentStep === TOTAL_STEPS - 1 ? 'Confirmar' : 'Continuar'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OnlineBookingPage;
