/**
 * BOOKING SUCCESS PAGE
 * Post-booking confirmation with client instructions
 * Style: Golden Neomorphic Light Theme with Glassmorphism
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Calendar,
    Clock,
    User,
    MapPin,
    Phone,
    MessageCircle,
    Navigation,
    ChevronLeft,
    Sparkles,
    Droplets,
    Scissors,
    Shirt,
    Plus
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Card, Button, Badge } from '../../../shared/components/ui/NeoComponents';

// Brand Colors - Rose Pink
const ROSE = '#E8A0B8';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

// Types
interface BookingData {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    professional: string;
    totalAmount: number;
    depositAmount: number;
}

// Preparation Tips Data
const PREPARATION_TIPS = [
    {
        icon: <Droplets size={20} />,
        title: 'Pele',
        description: 'Venha com o rosto limpo e hidratado. Evite usar protetor solar oleoso no dia.',
    },
    {
        icon: <Scissors size={20} />,
        title: 'Cabelo',
        description: 'Para penteados, lave o cabelo apenas com shampoo no dia anterior. Não use condicionador na raiz.',
    },
    {
        icon: <Shirt size={20} />,
        title: 'Vestuário',
        description: 'Use uma blusa de botões ou com decote aberto para não estragar a produção na hora de se trocar.',
    },
];

// Studio Info
const STUDIO_INFO = {
    name: 'Studio Marcela Coimbra',
    address: 'Rua das Flores, 123 - Vila Mariana',
    city: 'São Paulo - SP',
    phone: '11999999999',
    parking: 'Estacionamento gratuito no local',
    mapsUrl: 'https://maps.google.com/?q=-23.5878,-46.6341',
};

// Success Check Animation
const SuccessCheckmark: React.FC = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{
            backgroundColor: GOLD_LIGHT,
            boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.9)'
        }}
    >
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
        >
            <CheckCircle size={56} style={{ color: GOLD }} strokeWidth={2.5} />
        </motion.div>
    </motion.div>
);

// Booking Summary Card (Glassmorphism)
const BookingSummary: React.FC<{ booking: BookingData }> = ({ booking }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-5 mb-6"
        style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
    >
        <h3 className="font-semibold text-neo-text mb-4 flex items-center gap-2">
            <Sparkles size={18} style={{ color: GOLD }} />
            Detalhes do Agendamento
        </h3>

        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-neo-text-secondary text-sm">Serviço</span>
                <span className="font-medium text-neo-text">{booking.serviceName}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neo-text-secondary text-sm flex items-center gap-1">
                    <Calendar size={14} /> Data
                </span>
                <span className="font-medium text-neo-text">{booking.date}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neo-text-secondary text-sm flex items-center gap-1">
                    <Clock size={14} /> Horário
                </span>
                <span className="font-medium text-neo-text">{booking.time}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neo-text-secondary text-sm flex items-center gap-1">
                    <User size={14} /> Profissional
                </span>
                <Badge variant="success">{booking.professional}</Badge>
            </div>

            <div className="h-px bg-neo-text-secondary/20 my-3" />

            <div className="flex items-center justify-between">
                <span className="text-neo-text-secondary text-sm">Total</span>
                <span className="font-bold text-lg" style={{ color: GOLD }}>
                    {formatCurrency(booking.totalAmount)}
                </span>
            </div>
            {booking.depositAmount > 0 && (
                <div className="flex items-center justify-between">
                    <span className="text-neo-text-secondary text-sm">Sinal Pago</span>
                    <span className="font-medium text-green-600">
                        {formatCurrency(booking.depositAmount)} ✓
                    </span>
                </div>
            )}
        </div>

        <motion.p
            className="text-xs text-center text-neo-text-secondary mt-4 pt-3 border-t border-neo-text-secondary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            Código: #{booking.id}
        </motion.p>
    </motion.div>
);

// Preparation Tips Section
const PreparationSection: React.FC = () => (
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
    >
        <h3 className="font-semibold text-neo-text mb-4">
            💄 Preparações para o seu dia
        </h3>

        <div className="space-y-3">
            {PREPARATION_TIPS.map((tip, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="bg-neo-bg rounded-neo shadow-neo-out p-4"
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-neo flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: GOLD_LIGHT }}
                        >
                            <span style={{ color: GOLD }}>{tip.icon}</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-neo-text mb-1">{tip.title}</h4>
                            <p className="text-sm text-neo-text-secondary leading-relaxed">
                                {tip.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.section>
);

// Location Section
const LocationSection: React.FC = () => (
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-6"
    >
        <h3 className="font-semibold text-neo-text mb-4">
            📍 Como Chegar
        </h3>

        <Card className="p-4">
            <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} style={{ color: GOLD }} className="flex-shrink-0 mt-1" />
                <div>
                    <p className="font-medium text-neo-text">{STUDIO_INFO.name}</p>
                    <p className="text-sm text-neo-text-secondary">{STUDIO_INFO.address}</p>
                    <p className="text-sm text-neo-text-secondary">{STUDIO_INFO.city}</p>
                    <p className="text-xs text-neo-accent mt-1">🅿️ {STUDIO_INFO.parking}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => window.open(STUDIO_INFO.mapsUrl, '_blank')}
                    className="flex-1 py-3 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center gap-2 text-neo-text font-medium active:shadow-neo-pressed transition-all"
                >
                    <Navigation size={18} style={{ color: GOLD }} />
                    Abrir Mapa
                </button>
                <button
                    onClick={() => window.open(`tel:+55${STUDIO_INFO.phone}`)}
                    className="flex-1 py-3 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center gap-2 text-neo-text font-medium active:shadow-neo-pressed transition-all"
                >
                    <Phone size={18} className="text-neo-accent" />
                    Ligar
                </button>
            </div>
        </Card>
    </motion.section>
);

// CTA Section
const CTASection: React.FC<{ booking: BookingData }> = ({ booking }) => {
    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(
            `✨ *Agendamento Confirmado!*\n\n` +
            `📅 *Data:* ${booking.date}\n` +
            `🕐 *Horário:* ${booking.time}\n` +
            `💄 *Serviço:* ${booking.serviceName}\n` +
            `👩‍🎨 *Profissional:* ${booking.professional}\n\n` +
            `📍 ${STUDIO_INFO.address}\n\n` +
            `Código: #${booking.id}`
        );
        window.open(`https://wa.me/55${STUDIO_INFO.phone}?text=${message}`, '_blank');
    };

    const handleAddToCalendar = () => {
        // Create Google Calendar event URL
        const eventTitle = encodeURIComponent(`${booking.serviceName} - ${STUDIO_INFO.name}`);
        const eventDetails = encodeURIComponent(`Profissional: ${booking.professional}\n\nEndereço: ${STUDIO_INFO.address}`);
        const location = encodeURIComponent(STUDIO_INFO.address);

        // Parse date and time (assuming format: "23/12/2024" and "14:00")
        const [day, month, year] = booking.date.split('/');
        const [hour, minute] = booking.time.split(':');
        const startDate = `${year}${month}${day}T${hour}${minute}00`;
        const endHour = (parseInt(hour) + 2).toString().padStart(2, '0'); // 2 hour duration
        const endDate = `${year}${month}${day}T${endHour}${minute}00`;

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${location}&dates=${startDate}/${endDate}`;
        window.open(calendarUrl, '_blank');
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-3"
        >
            <button
                onClick={handleWhatsAppShare}
                className="w-full btn-glass-glow"
            >
                <MessageCircle size={20} />
                Enviar Comprovante via WhatsApp
            </button>

            <button
                onClick={handleAddToCalendar}
                className="w-full py-4 bg-neo-bg rounded-neo shadow-neo-out font-semibold flex items-center justify-center gap-2 text-neo-text active:shadow-neo-pressed transition-all"
            >
                <Plus size={20} />
                Adicionar ao Calendário
            </button>
        </motion.section>
    );
};

// Main Booking Success Page
export const BookingSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get booking data from navigation state or use mock data
    const bookingData: BookingData = location.state?.booking || {
        id: 'BK2024122301',
        serviceName: 'Maquiagem Social',
        date: '28/12/2024',
        time: '14:00',
        professional: 'Marcela',
        totalAmount: 160,
        depositAmount: 40,
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-8 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4 pt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center active:shadow-neo-pressed mb-6"
                    >
                        <ChevronLeft size={20} className="text-neo-text-secondary" />
                    </button>

                    {/* Success Animation */}
                    <SuccessCheckmark />

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-2xl font-bold text-neo-text mb-2">
                            Agendamento Confirmado!
                        </h1>
                        <p className="text-neo-text-secondary">
                            Seu momento de beleza está garantido ✨
                        </p>
                    </motion.div>
                </header>

                {/* Content */}
                <main className="px-4">
                    {/* Booking Summary */}
                    <BookingSummary booking={bookingData} />

                    {/* Preparation Tips */}
                    <PreparationSection />

                    {/* Location */}
                    <LocationSection />

                    {/* CTAs */}
                    <CTASection booking={bookingData} />

                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={() => navigate('/')}
                        className="w-full mt-6 py-3 text-neo-text-secondary text-sm font-medium"
                    >
                        ← Voltar para o Início
                    </motion.button>
                </main>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
