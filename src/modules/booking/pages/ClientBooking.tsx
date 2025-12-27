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
import { Card, Button, Badge, Avatar, Input, Divider } from '../../../shared/components/ui/NeoComponents';
import { Calendar as CalendarComponent } from '../../booking/components/Calendar';
import { ServiceCard, ServiceSummary } from '../../booking/components/ServiceCard';
import { BookingBottomSheet, ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';

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
      <p className="text-neo-text-secondary text-sm">
        Selecione os serviços desejados. Aplicamos 10% de desconto de segunda a quinta!
      </p>

      {/* Makeup Section */}
      <div>
        <h3 className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-neo-accent" />
          Maquiagem
        </h3>
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
        <h3 className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Heart size={16} className="text-neo-info" />
          Cabelos
        </h3>
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
      <p className="text-neo-text-secondary text-sm">
        Escolha a melhor data e horário para seu atendimento.
      </p>

      {/* Calendar */}
      <CalendarComponent
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        appointments={[]}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      {/* Time Slots */}
      <div className="bg-neo-bg rounded-neo shadow-neo-in p-4">
        <h4 className="text-sm font-semibold text-neo-text-secondary mb-4">
          Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(time => (
            <motion.button
              key={time}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTimeSelect(time)}
              className={cn(
                'p-3 rounded-neo-sm text-center transition-all duration-200',
                selectedTime === time
                  ? 'bg-neo-bg shadow-neo-pressed border-2 border-neo-accent text-neo-accent'
                  : 'bg-neo-bg shadow-neo-out hover:shadow-neo-out-lg text-neo-text'
              )}
            >
              <span className="text-sm font-medium">{formatTime(time)}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      {isWeekdayDiscount(getWeekday(selectedDate)) && (
        <div className="bg-neo-success/10 rounded-neo-sm p-3 flex items-center gap-3">
          <Sparkles size={20} className="text-neo-success" />
          <p className="text-sm text-neo-success">
            Você ganhou 10% de desconto! Aplique no checkout.
          </p>
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
      <p className="text-neo-text-secondary text-sm">
        Precisamos de algumas informações para confirmar seu agendamento.
      </p>

      <Input
        label="Nome Completo"
        placeholder="Seu nome"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        icon={<User size={18} />}
      />

      <Input
        label="Telefone (WhatsApp)"
        placeholder="(11) 99999-9999"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        icon={<Phone size={18} />}
      />

      <Input
        label="E-mail (opcional)"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        icon={<MessageSquare size={18} />}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-neo-text-secondary mb-2">
          Observações (opcional)
        </label>
        <textarea
          className="w-full bg-neo-bg rounded-neo shadow-neo-in px-4 py-3 text-neo-text placeholder:text-neo-text-secondary outline-none focus:ring-2 focus:ring-neo-accent/20 transition-all resize-none h-24"
          placeholder="Algo que devemos saber sobre seu atendimento..."
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
        />
      </div>

      {/* Summary Card */}
      <Card className="p-4">
        <h4 className="font-semibold text-neo-text mb-3">Resumo</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neo-text-secondary">Data</span>
            <span className="text-neo-text">{formData.date || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neo-text-secondary">Horário</span>
            <span className="text-neo-text">{formData.time || '-'}</span>
          </div>
          <Divider />
          <div className="flex justify-between font-bold">
            <span className="text-neo-text">Total</span>
            <span className="text-neo-accent">{formatCurrency(formData.total || 0)}</span>
          </div>
        </div>
      </Card>
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
        <h3 className="text-lg font-semibold text-neo-text">Quase lá!</h3>
        <p className="text-neo-text-secondary text-sm mt-1">
          Revise as informações do seu agendamento
        </p>
      </div>

      {/* Client Info */}
      <Card className="p-4">
        <h4 className="font-semibold text-neo-text mb-3">Seus Dados</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-neo-text-secondary" />
            <span className="text-neo-text">{formData.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-neo-text-secondary" />
            <span className="text-neo-text">{formData.phone}</span>
          </div>
          {formData.email && (
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-neo-text-secondary" />
              <span className="text-neo-text">{formData.email}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Appointment Info */}
      <Card className="p-4">
        <h4 className="font-semibold text-neo-text mb-3">Agendamento</h4>
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
      </Card>

      {/* Services */}
      <Card className="p-4">
        <h4 className="font-semibold text-neo-text mb-3">Serviços</h4>
        <div className="space-y-2">
          {selectedServicesData.map(service => (
            <div key={service.id} className="flex justify-between text-sm">
              <span className="text-neo-text">{service.name}</span>
              <span className="text-neo-text-secondary">{formatCurrency(service.price)}</span>
            </div>
          ))}
          {discount > 0 && (
            <div className="flex justify-between text-sm text-neo-success">
              <span>Desconto (10%)</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <Divider />
          <div className="flex justify-between font-bold">
            <span className="text-neo-text">Total</span>
            <span className="text-neo-accent">{formatCurrency(total)}</span>
          </div>
        </div>
      </Card>

      {/* Confirm Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onConfirm}
        loading={loading}
        className="w-full"
      >
        Confirmar Agendamento
      </Button>

      <p className="text-xs text-neo-text-secondary text-center">
        Você receberá a confirmação por WhatsApp
      </p>
    </div>
  );
};

// Main Client Booking Page
export const ClientBooking: React.FC = () => {
  const services = SERVICES_DATA;

  // Booking state
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    date: format(selectedDate, "dd 'de' MMMM", { locale: ptBR }),
    time: '',
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 4;
  const isDiscounted = isWeekdayDiscount(getWeekday(selectedDate));

  // Calculate totals
  const subtotal = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);
  const discount = isDiscounted ? subtotal * 0.10 : 0;
  const total = subtotal - discount;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowSuccess(true);
  };

  const stepTitles = ['Serviços', 'Data & Hora', 'Seus Dados', 'Confirmação'];

  return (
    <div className="min-h-screen bg-neo-bg pb-24">
      {/* Header */}
      <header className="p-6">
        <h1 className="text-display mb-2">Agendamento</h1>
        <p className="text-caption">Reserve seu horário conosco</p>
      </header>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between">
          {stepTitles.map((title, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                idx < step
                  ? 'bg-neo-accent text-white'
                  : idx === step
                    ? 'bg-neo-bg shadow-neo-pressed text-neo-accent'
                    : 'bg-neo-bg shadow-neo-out text-neo-text-secondary'
              )}>
                {idx < step ? <Check size={16} /> : idx + 1}
              </div>
              <span className={cn(
                'text-[10px] mt-1 hidden sm:block',
                idx === step ? 'text-neo-accent' : 'text-neo-text-secondary'
              )}>
                {title}
              </span>
            </div>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
          <motion.div
            className="h-full bg-neo-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <StepServices
                services={services}
                selectedIds={selectedServices}
                onToggle={(id) => {
                  setSelectedServices(prev =>
                    prev.includes(id)
                      ? prev.filter(s => s !== id)
                      : [...prev, id]
                  );
                }}
                onNext={handleNext}
                date={selectedDate}
              />
            )}

            {step === 1 && (
              <StepDateTime
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setFormData(prev => ({
                    ...prev,
                    date: format(date, "dd 'de' MMMM", { locale: ptBR }),
                  }));
                }}
                selectedTime={selectedTime}
                onTimeSelect={(time) => {
                  setSelectedTime(time);
                  setFormData(prev => ({
                    ...prev,
                    time: formatTime(time),
                  }));
                }}
              />
            )}

            {step === 2 && (
              <StepClientInfo
                formData={{ ...formData, total }}
                onChange={(field, value) => {
                  setFormData(prev => ({ ...prev, [field]: value }));
                }}
              />
            )}

            {step === 3 && (
              <StepConfirmation
                formData={{ ...formData, total }}
                selectedServices={selectedServices}
                services={services}
                onConfirm={handleConfirm}
                loading={loading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      {step < 3 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-neo-bg rounded-t-neo-lg shadow-neo-out-lg p-4 pb-safe z-50">
          <div className="flex gap-4">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack} className="flex-1">
                <ChevronLeft size={20} />
                Voltar
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleNext}
              className={cn(step === 0 ? 'hidden' : 'flex-1')}
              disabled={step === 0 && selectedServices.length === 0}
            >
              {step === 2 ? 'Revisar' : 'Continuar'}
              {step < 2 && <ChevronRight size={20} />}
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <ActionBottomSheet
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title=""
        actions={[]}
      >
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-neo-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={48} className="text-neo-success" />
          </div>
          <h3 className="text-xl font-semibold text-neo-text mb-2">
            Agendamento Confirmado!
          </h3>
          <p className="text-neo-text-secondary text-sm mb-6">
            Você receberá a confirmação por WhatsApp em instantes.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccess(false);
              // Reset form
              setStep(0);
              setSelectedServices([]);
              setSelectedTime('');
              setFormData({
                name: '',
                phone: '',
                email: '',
                notes: '',
                date: '',
                time: '',
                total: 0,
              });
            }}
            className="w-full"
          >
            Fazer Novo Agendamento
          </Button>
        </div>
      </ActionBottomSheet>
    </div>
  );
};

export default ClientBooking;
