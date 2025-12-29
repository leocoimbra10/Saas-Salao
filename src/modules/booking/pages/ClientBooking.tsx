/**
 * BEAUTY SALON NEOMORPHIC APP - Client Booking Page
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { cn, formatCurrency, formatTime, getWeekday, isWeekdayDiscount, generateId } from '../../../shared/lib/utils';
import { Service, Appointment } from '../../../shared/types/types';
import { SERVICES_DATA } from '../../../shared/types/types';
import { NeoCard, NeoButton, Badge, Avatar, NeoInput, NeoTextarea, Divider, Typography } from '../../../shared/components/ui/NeoComponents';
import { Calendar as CalendarComponent } from '../../booking/components/Calendar';
import { ServiceCard, ServiceSummary } from '../../booking/components/ServiceCard';
import { BookingBottomSheet, ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { APP_TEXTS } from '../../../shared/lib/constants';

// Service Selection Step
const StepServices: React.FC<{
  services: Service[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  date: Date;
}> = ({ services, selectedIds, onToggle, onNext, date }) => {
  const makeupServices = services.filter(s => s.category === 'makeup' && s.active);
  const hairstyleServices = services.filter(s => s.category === 'hairstyle' && s.active);

  return (
    <div className="space-y-6">
      <Typography variant="body" className="text-neo-text-secondary text-sm">
        Selecione os serviços desejados. Aplicamos 10% de desconto de segunda a quinta!
      </Typography>

      {/* Makeup Section */}
      <div>
        <Typography variant="h6" className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-neo-accent" />
          Maquiagem
        </Typography>
        <div className="space-y-3">
          {makeupServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              onSelect={() => onToggle(service.id)}
              showDiscount={true}
              date={date}
            />
          ))}
        </div>
      </div>

      {/* Hairstyle Section */}
      <div>
        <Typography variant="h6" className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Heart size={16} className="text-neo-info" />
          Cabelos
        </Typography>
        <div className="space-y-3">
          {hairstyleServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              onSelect={() => onToggle(service.id)}
              showDiscount={true}
              date={date}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      {selectedIds.length > 0 && (
        <ServiceSummary
          services={services}
          selectedIds={selectedIds}
          onRemove={onToggle}
          onAction={onNext}
          actionLabel="Continuar para Data & Hora"
        />
      )}
    </div>
  );
};

// Date & Time Selection Step
const StepDateTime: React.FC<{
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}> = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect }) => {
  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  return (
    <div className="space-y-6">
      <Typography variant="body" className="text-neo-text-secondary text-sm">
        Escolha a melhor data e horário para seu atendimento.
      </Typography>

      {/* Calendar */}
      <CalendarComponent
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        appointments={[]}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      {/* Time Slots */}
      <NeoCard className="p-4 bg-neo-bg shadow-neo-in">
        <Typography variant="h6" className="text-sm font-semibold text-neo-text-secondary mb-4">
          Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </Typography>

        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(time => (
            <NeoButton
              key={time}
              variant={selectedTime === time ? 'neu' : 'glass'}
              size="sm"
              onClick={() => onTimeSelect(time)}
              className={cn(
                'rounded-neo-sm text-center transition-all duration-200',
                selectedTime === time
                  ? 'bg-neo-bg shadow-neo-pressed border-2 border-neo-accent text-neo-accent'
                  : 'bg-neo-bg shadow-neo-out hover:shadow-neo-out-lg text-neo-text'
              )}
            >
              <Typography variant="body" className="text-sm font-medium">{formatTime(time)}</Typography>
            </NeoButton>
          ))}
        </div>
      </NeoCard>

      {/* Info Banner */}
      {isWeekdayDiscount(getWeekday(selectedDate)) && (
        <div className="bg-neo-success/10 rounded-neo-sm p-3 flex items-center gap-3">
          <Sparkles size={20} className="text-neo-success" />
          <Typography variant="body" className="text-sm text-neo-success">
            Você ganhou 10% de desconto! Aplique no checkout.
          </Typography>
        </div>
      )}
    </div>
  );
};

// Client Info Step
interface FormDataType {
  name: string;
  phone: string;
  email: string;
  notes: string;
  date?: string;
  time?: string;
  total?: number;
}

const StepClientInfo: React.FC<{
  formData: FormDataType;
  onChange: (field: string, value: string) => void;
}> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <Typography variant="body" className="text-neo-text-secondary text-sm">
        Precisamos de algumas informações para confirmar seu agendamento.
      </Typography>

      <NeoInput
        label="Nome Completo"
        placeholder="Seu nome"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        icon={<User size={18} />}
      />

      <NeoInput
        label="Telefone (WhatsApp)"
        placeholder="(11) 99999-9999"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        icon={<Phone size={18} />}
      />

      <NeoInput
        label="E-mail (opcional)"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        icon={<MessageSquare size={18} />}
      />

      <NeoTextarea
        label="Observações (opcional)"
        placeholder="Algo que devemos saber sobre seu atendimento..."
        value={formData.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        className="h-24 resize-none"
      />

      {/* Summary NeoCard */}
      <NeoCard className="p-4">
        <Typography variant="h4" className="font-semibold text-neo-text mb-3">Resumo</Typography>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <Typography variant="caption" className="text-neo-text-secondary">Data</Typography>
            <Typography variant="body" className="text-neo-text">{formData.date || '-'}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="caption" className="text-neo-text-secondary">Horário</Typography>
            <Typography variant="body" className="text-neo-text">{formData.time || '-'}</Typography>
          </div>
          <Divider />
          <div className="flex justify-between font-bold">
            <Typography variant="body" className="text-neo-text">Total</Typography>
            <Typography variant="h5" className="text-neo-accent">{formatCurrency(formData.total || 0)}</Typography>
          </div>
        </div>
      </NeoCard>
    </div>
  );
};

// Confirmation Step
const StepConfirmation: React.FC<{
  formData: FormDataType;
  selectedServices: string[];
  services: Service[];
  onConfirm: () => void;
  loading: boolean;
}> = ({ formData, selectedServices, services, onConfirm, loading }) => {
  const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
  const subtotal = selectedServicesData.reduce((sum, s) => sum + s.price, 0);
  const discount = subtotal * 0.10;
  const total = subtotal - discount;

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-neo-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} className="text-neo-success" />
        </div>
        <Typography variant="h3" className="text-lg font-semibold text-neo-text">Quase lá!</Typography>
        <Typography variant="body" className="text-neo-text-secondary text-sm mt-1">
          Revise as informações do seu agendamento
        </Typography>
      </div>

      {/* Client Info */}
      <NeoCard className="p-4">
        <Typography variant="h4" className="font-semibold text-neo-text mb-3">Seus Dados</Typography>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-neo-text-secondary" />
            <Typography variant="body" className="text-neo-text">{formData.name}</Typography>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-neo-text-secondary" />
            <Typography variant="body" className="text-neo-text">{formData.phone}</Typography>
          </div>
          {formData.email && (
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-neo-text-secondary" />
              <Typography variant="body" className="text-neo-text">{formData.email}</Typography>
            </div>
          )}
        </div>
      </NeoCard>

      {/* Appointment Info */}
      <NeoCard className="p-4">
        <Typography variant="h4" className="font-semibold text-neo-text mb-3">Agendamento</Typography>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neo-text-secondary">Data</span>
            <span className="text-neo-text">{formData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neo-text-secondary">Horário</span>
            <span className="text-neo-text">{formData.time}</span>
          </div>
        </div>
      </NeoCard>

      {/* Services & Total */}
      <NeoCard className="p-4">
        <Typography variant="h4" className="font-semibold text-neo-text mb-3">Serviços</Typography>
        <div className="space-y-4">
          <div className="space-y-2">
            {selectedServicesData.map(s => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="text-neo-text-secondary">{s.name}</span>
                <span className="text-neo-text">{formatCurrency(s.price)}</span>
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex justify-between text-sm">
            <span className="text-neo-text-secondary">Subtotal</span>
            <span className="text-neo-text">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-neo-success">
            <span>Desconto (10%)</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
          <Divider />
          <div className="flex justify-between font-bold text-lg">
            <span className="text-neo-text">Total</span>
            <span className="text-neo-accent">{formatCurrency(total)}</span>
          </div>
        </div>
      </NeoCard>
    </div>
  );
};

// Main Component
export const ClientBooking: React.FC = () => {
  const navigate = useNavigate();
  // State
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handlers
  const handleServiceToggle = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (step === 1 && selectedServices.length === 0) return;
    if (step === 2 && !selectedTime) return;
    if (step === 3 && (!formData.name || !formData.phone)) return;

    if (step === 3) {
      // Calculate total
      const selectedServicesData = SERVICES_DATA.filter(s => selectedServices.includes(s.id));
      const subtotal = selectedServicesData.reduce((sum, s) => sum + s.price, 0);
      const discount = subtotal * 0.10;
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, "dd/MM/yyyy"),
        time: selectedTime,
        total: subtotal - discount
      }));
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page instead of showing modal
      navigate('/agendar/sucesso', {
        state: {
          booking: {
            id: generateId(),
            serviceName: SERVICES_DATA.find(s => s.id === selectedServices[0])?.name || 'Serviços Diversos',
            date: format(selectedDate, 'dd/MM/yyyy'),
            time: selectedTime,
            professional: 'Marcela',
            status: 'confirmed',
            clientName: formData.name,
            clientPhone: formData.phone,
            price: formData.total || 0,
            totalAmount: formData.total || 0,
            depositAmount: (formData.total || 0) * 0.3, // Assuming 30% deposit
            duration: 60
          }
        }
      });
    }, 2000);
  };

  // Render Logic
  const getStepTitle = () => {
    switch (step) {
      case 1: return APP_TEXTS.BOOKING_STEP_SERVICES_TITLE;
      case 2: return APP_TEXTS.BOOKING_STEP_DATETIME_TITLE;
      case 3: return APP_TEXTS.BOOKING_STEP_INFO_TITLE;
      case 4: return APP_TEXTS.BOOKING_STEP_CONFIRM_TITLE;
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-neo-bg/90 backdrop-blur-lg border-b border-white/20 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <NeoButton variant="neu" size="icon" onClick={() => setStep(prev => prev - 1)}>
              <ChevronLeft size={20} className="text-neo-text-secondary" />
            </NeoButton>
          )}
          <div>
            <Typography variant="h3" className="text-lg font-display font-bold text-neo-text">{getStepTitle()}</Typography>
            <Typography variant="caption" className="text-xs text-neo-text-secondary">Passo {step} de 4</Typography>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center">
          <User size={20} className="text-neo-accent" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-neo-bg shadow-neo-in w-full">
        <motion.div
          className="h-full bg-brand-gradient"
          initial={{ width: '25%' }}
          animate={{ width: `${step * 25}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <main className="p-4 container mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <StepServices
                services={SERVICES_DATA}
                selectedIds={selectedServices}
                onToggle={handleServiceToggle}
                onNext={handleNextStep}
                date={selectedDate}
              />
            )}

            {step === 2 && (
              <StepDateTime
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            )}

            {step === 3 && (
              <StepClientInfo
                formData={formData}
                onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              />
            )}

            {step === 4 && (
              <StepConfirmation
                formData={formData}
                selectedServices={selectedServices}
                services={SERVICES_DATA}
                onConfirm={handleBooking}
                loading={isProcessing}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Action Bar */}
      {step !== 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-neo-bg/90 backdrop-blur-lg border-t border-white/20 p-4 z-20">
          <div className="container mx-auto max-w-lg">
            <NeoButton
              variant="gradient"
              fullWidth
              size="lg"
              onClick={step === 4 ? handleBooking : handleNextStep}
              loading={isProcessing}
              disabled={
                (step === 2 && !selectedTime) ||
                (step === 3 && (!formData.name || !formData.phone))
              }
            >
              {step === 4 ? APP_TEXTS.BTN_CONFIRM : APP_TEXTS.BTN_CONTINUE}
            </NeoButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBooking;
