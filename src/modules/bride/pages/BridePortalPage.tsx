/**
 * ADVANCED BRIDE PORTAL PAGE
 * Complete bridal experience with timeline, moodboard, attendants, and documents
 * Style: Light Neomorphism with Gold & Glassmorphism accents
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown,
    Heart,
    Calendar,
    Users,
    DollarSign,
    ChevronRight,
    ChevronDown,
    CheckCircle,
    Clock,
    Plus,
    Trash2,
    Edit3,
    MessageCircle,
    Phone,
    Package,
    Sparkles,
    ArrowLeft,
    X,
    Check,
    Upload,
    Image as ImageIcon,
    FileText,
    Download,
    Receipt,
    Camera,
    Palette,
    Scissors
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Card, Button, Badge, Progress } from '../../../shared/components/ui/NeoComponents';

// Brand Colors
const ROSE = '#E8A0B8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = '#F5E6B3';

// ============================================
// TYPES
// ============================================
interface TimelineStep {
    id: string;
    title: string;
    subtitle?: string;
    date?: Date;
    status: 'pending' | 'scheduled' | 'completed';
}

interface MoodboardPhoto {
    id: string;
    url: string;
    category: 'vestido' | 'penteado' | 'maquiagem' | 'inspiracao';
    note?: string;
}

interface Attendant {
    id: string;
    name: string;
    relation: string;
    services: Array<{ id: string; name: string; price: number }>;
    depositPaid: number;
    totalPrice: number;
}

// ============================================
// MOCK DATA
// ============================================
const AVAILABLE_SERVICES = [
    { id: 'makeup-social', name: 'Maquiagem Social', price: 160 },
    { id: 'makeup-glam', name: 'Maquiagem Glamour', price: 220 },
    { id: 'coque', name: 'Penteado Coque', price: 140 },
    { id: 'semi-preso', name: 'Penteado Semi-preso', price: 110 },
    { id: 'tranca', name: 'Tranças Elaboradas', price: 180 },
    { id: 'combo-social', name: 'Combo Make + Penteado', price: 280 },
    { id: 'combo-glam', name: 'Combo Glamour Completo', price: 380 },
];

const MOODBOARD_CATEGORIES = [
    { id: 'vestido', label: 'Vestido', icon: <Heart size={16} /> },
    { id: 'penteado', label: 'Penteado', icon: <Scissors size={16} /> },
    { id: 'maquiagem', label: 'Maquiagem', icon: <Palette size={16} /> },
    { id: 'inspiracao', label: 'Inspiração', icon: <Sparkles size={16} /> },
];

// ============================================
// COMPONENTS
// ============================================

// Journey Timeline Stepper
const JourneyTimeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
    const completedCount = steps.filter(s => s.status === 'completed').length;
    const progressPercent = (completedCount / steps.length) * 100;

    return (
        <Card className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Crown size={20} style={{ color: GOLD }} />
                <h3 className="font-semibold text-neo-text">Sua Jornada de Noiva</h3>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
                <div className="h-1 bg-neo-bg rounded-full shadow-neo-in">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: GOLD }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between absolute -top-2 left-0 right-0">
                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center',
                                step.status === 'completed'
                                    ? 'text-white'
                                    : 'bg-neo-bg shadow-neo-out text-neo-text-secondary'
                            )}
                            style={{
                                backgroundColor: step.status === 'completed' ? GOLD : undefined
                            }}
                        >
                            {step.status === 'completed' ? (
                                <Check size={12} />
                            ) : (
                                <span className="text-[10px] font-bold">{idx + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Labels */}
            <div className="grid grid-cols-4 gap-1 text-center">
                {steps.map((step) => (
                    <div key={step.id}>
                        <p className={cn(
                            'text-[10px] font-medium',
                            step.status === 'completed' ? 'text-neo-text' : 'text-neo-text-secondary'
                        )}>
                            {step.title}
                        </p>
                        {step.date && (
                            <p className="text-[8px] text-neo-text-secondary">
                                {step.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </p>
                        )}
                        {step.status === 'scheduled' && (
                            <Badge variant="warning" className="text-[8px] mt-1">Agendado</Badge>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};


// Countdown Widget - Enhanced with Gold Glow
const CountdownWidget: React.FC<{ weddingDate: Date | null; onEditDate: () => void }> = ({ weddingDate, onEditDate }) => {
    const now = new Date();
    const diff = weddingDate ? weddingDate.getTime() - now.getTime() : 0;
    const days = weddingDate ? Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))) : 0;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    if (!weddingDate) {
        // Empty State - Date not set
        return (
            <motion.button
                onClick={onEditDate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "w-full p-6 mb-6 rounded-[1.5rem] text-center",
                    "bg-white/10 backdrop-blur-xl border border-white/20",
                    "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]"
                )}
            >
                <Sparkles size={32} style={{ color: GOLD }} className="mx-auto mb-2" />
                <p className="text-neo-text font-semibold">Defina a data do seu grande dia</p>
                <p className="text-xs text-neo-text-secondary mt-1">Toque para adicionar</p>
            </motion.button>
        );
    }

    return (
        <Card className="p-4 mb-6 relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `linear-gradient(135deg, ${GOLD} 0%, transparent 60%)`
                }}
            />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-neo flex items-center justify-center"
                        style={{ backgroundColor: GOLD_LIGHT }}
                    >
                        <Sparkles size={28} style={{ color: GOLD }} />
                    </div>
                    <div>
                        {/* Gold Glow Number */}
                        <p
                            className="text-4xl font-bold font-serif"
                            style={{
                                color: GOLD,
                                textShadow: `0 0 20px ${GOLD}66, 0 0 40px ${GOLD}33`
                            }}
                        >
                            {days}
                        </p>
                        <p className="text-xs text-neo-text-secondary">dias para o grande dia!</p>
                        {weeks > 0 && (
                            <p className="text-[10px] text-neo-text-secondary">
                                ({weeks} semanas e {remainingDays} dias)
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-neo-text">
                        {weddingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <button onClick={onEditDate} className="text-xs text-neo-accent mt-1 flex items-center gap-1 ml-auto">
                        <Edit3 size={12} />
                        Alterar
                    </button>
                </div>
            </div>
        </Card>
    );
};


// Moodboard Section
const MoodboardSection: React.FC<{
    photos: MoodboardPhoto[];
    onAddPhoto: (category: string) => void;
    proNotes?: string;
    isAdmin?: boolean;
}> = ({ photos, onAddPhoto, proNotes, isAdmin }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showProNotes, setShowProNotes] = useState(false);

    const filteredPhotos = selectedCategory === 'all'
        ? photos
        : photos.filter(p => p.category === selectedCategory);

    return (
        <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-subtitle flex items-center gap-2">
                    <Camera size={18} style={{ color: GOLD }} />
                    Moodboard
                </h2>
                <button
                    onClick={() => onAddPhoto('inspiracao')}
                    className="px-3 py-1.5 bg-neo-bg rounded-neo shadow-neo-out text-xs font-medium text-neo-accent flex items-center gap-1"
                >
                    <Plus size={14} />
                    Adicionar
                </button>
            </div>

            {/* Category Filter - Dropdown */}
            <div className="relative mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text appearance-none cursor-pointer focus:outline-none pr-10"
                >
                    <option value="all">Todas as Fotos</option>
                    {MOODBOARD_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.label}
                        </option>
                    ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-text-secondary pointer-events-none" />
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {filteredPhotos.map(photo => (
                    <div
                        key={photo.id}
                        className="aspect-square rounded-neo shadow-neo-out overflow-hidden relative group"
                    >
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Trash2 size={16} className="text-white cursor-pointer" />
                        </div>
                    </div>
                ))}

                {/* Add Photo Button */}
                <button
                    onClick={() => onAddPhoto(selectedCategory === 'all' ? 'inspiracao' : selectedCategory)}
                    className="aspect-square rounded-neo shadow-neo-in flex flex-col items-center justify-center border-2 border-dashed border-neo-text-secondary/20"
                >
                    <Upload size={20} className="text-neo-text-secondary mb-1" />
                    <span className="text-[10px] text-neo-text-secondary">Upload</span>
                </button>
            </div>

            {/* Pro Notes (Admin Only) */}
            {isAdmin && (
                <Card className="p-4">
                    <button
                        onClick={() => setShowProNotes(!showProNotes)}
                        className="w-full flex items-center justify-between"
                    >
                        <span className="font-medium text-neo-text flex items-center gap-2">
                            <FileText size={16} style={{ color: GOLD }} />
                            Ficha Técnica do Teste
                        </span>
                        <ChevronDown
                            size={16}
                            className={cn(
                                'text-neo-text-secondary transition-transform',
                                showProNotes && 'rotate-180'
                            )}
                        />
                    </button>

                    <AnimatePresence>
                        {showProNotes && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <textarea
                                    placeholder="Produtos utilizados, tom de base, técnicas aplicadas..."
                                    className="w-full mt-4 p-3 bg-neo-bg rounded-neo shadow-neo-in text-sm text-neo-text resize-none"
                                    rows={4}
                                    defaultValue={proNotes}
                                />
                                <Button variant="primary" size="sm" className="mt-2">
                                    Salvar Anotações
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            )}
        </section>
    );
};

// Attendant Manager Section - Enhanced with 3D Glassmorphism
const AttendantManager: React.FC<{
    attendants: Attendant[];
    onAdd: () => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
}> = ({ attendants, onAdd, onEdit, onRemove }) => {
    const totalPackage = attendants.reduce((sum, a) => sum + a.totalPrice, 0);
    const totalPaid = attendants.reduce((sum, a) => sum + a.depositPaid, 0);
    const totalPending = totalPackage - totalPaid;

    return (
        <section className="mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-subtitle flex items-center gap-2 font-serif">
                        <Users size={18} style={{ color: GOLD }} />
                        Madrinhas & Convidadas
                    </h2>
                    {attendants.length > 0 && (
                        <p className="text-xs text-neo-text-secondary tracking-wider">
                            {attendants.length} pessoas • Total: {formatCurrency(totalPackage)}
                        </p>
                    )}
                </div>
                {/* Add Button - Glassmorphic with Scale Animation */}
                <motion.button
                    onClick={onAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium",
                        "bg-white/10 backdrop-blur-xl border border-white/20",
                        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_4px_12px_-2px_rgba(0,0,0,0.15)]",
                        "text-neo-text hover:bg-white/15 transition-colors"
                    )}
                >
                    <Plus size={16} style={{ color: GOLD }} />
                    Adicionar
                </motion.button>
            </div>

            {/* Empty State */}
            {attendants.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-8 rounded-2xl text-center mb-4",
                        "bg-white/5 backdrop-blur-xl border border-white/10",
                        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
                    )}
                >
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}40 0%, ${GOLD}20 100%)` }}
                    >
                        <Users size={28} style={{ color: GOLD }} />
                    </div>
                    <p className="text-neo-text font-serif text-lg mb-1">Convide suas madrinhas</p>
                    <p className="text-xs text-neo-text-secondary mb-4">
                        Adicione as pessoas especiais para o dia da noiva
                    </p>
                    <button
                        onClick={onAdd}
                        className="text-sm font-medium"
                        style={{ color: GOLD }}
                    >
                        + Adicionar primeira convidada
                    </button>
                </motion.div>
            )}

            {/* Attendants List - 3D Glass Cards */}
            <div className="space-y-3 mb-4">
                {attendants.map((attendant, index) => {
                    const remaining = attendant.totalPrice - attendant.depositPaid;
                    const paidPercent = attendant.totalPrice > 0
                        ? (attendant.depositPaid / attendant.totalPrice) * 100
                        : 0;

                    return (
                        <motion.div
                            key={attendant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-4 rounded-2xl relative overflow-hidden",
                                // 3D Glass Recipe
                                "bg-white/10 backdrop-blur-xl border border-white/20",
                                "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_8px_24px_-4px_rgba(0,0,0,0.2)]"
                            )}
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                            {/* Header */}
                            <div className="relative flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(232, 160, 184, 0.3)'
                                        }}
                                    >
                                        {attendant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-serif font-medium text-neo-text">{attendant.name}</p>
                                        <p className="text-[11px] text-neo-text-secondary tracking-wider uppercase">
                                            {attendant.relation}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onEdit(attendant.id)}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <Edit3 size={14} style={{ color: GOLD }} />
                                    </button>
                                    <button
                                        onClick={() => onRemove(attendant.id)}
                                        className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="relative mb-3 pl-1">
                                {attendant.services.map(service => (
                                    <div key={service.id} className="flex justify-between text-sm py-1">
                                        <span className="text-neo-text-secondary">{service.name}</span>
                                        <span className="text-neo-text font-medium tracking-wider">
                                            {formatCurrency(service.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Progress - Glass Inset */}
                            <div className={cn(
                                "relative p-3 rounded-xl",
                                "bg-black/20 backdrop-blur-sm",
                                "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                            )}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-neo-text-secondary">Pagamento</span>
                                    <span className="text-neo-text font-semibold tracking-wider">
                                        {paidPercent.toFixed(0)}%
                                    </span>
                                </div>
                                {/* Custom Progress Bar with Gradient */}
                                <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${paidPercent}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-green-400 tracking-wider">
                                        Pago: {formatCurrency(attendant.depositPaid)}
                                    </span>
                                    <span style={{ color: GOLD }} className="tracking-wider">
                                        Pendente: {formatCurrency(remaining)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Total Summary Card - Glassmorphic */}
            {attendants.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-4 rounded-2xl",
                        "bg-white/10 backdrop-blur-xl border border-white/20",
                        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4)]"
                    )}
                >
                    <h4 className="font-serif font-semibold text-neo-text mb-3 flex items-center gap-2">
                        <DollarSign size={16} style={{ color: GOLD }} />
                        Resumo Financeiro
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xl font-bold text-neo-text tracking-wider">
                                {formatCurrency(totalPackage)}
                            </p>
                            <p className="text-[10px] text-neo-text-secondary uppercase tracking-widest">Total</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-green-400 tracking-wider">
                                {formatCurrency(totalPaid)}
                            </p>
                            <p className="text-[10px] text-neo-text-secondary uppercase tracking-widest">Pago</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold tracking-wider" style={{ color: GOLD }}>
                                {formatCurrency(totalPending)}
                            </p>
                            <p className="text-[10px] text-neo-text-secondary uppercase tracking-widest">Pendente</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
};


// Documents Hub Section
const DocumentsHub: React.FC<{ hasContract: boolean; onViewContract: () => void; onGenerateReceipt: () => void }> = ({
    hasContract,
    onViewContract,
    onGenerateReceipt
}) => (
    <section className="mb-6">
        <h2 className="text-subtitle flex items-center gap-2 mb-4">
            <FileText size={18} style={{ color: GOLD }} />
            Documentos
        </h2>

        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={onViewContract}
                disabled={!hasContract}
                className={cn(
                    'p-4 bg-neo-bg rounded-neo shadow-neo-out flex flex-col items-center gap-2 active:shadow-neo-pressed transition-all',
                    !hasContract && 'opacity-50 cursor-not-allowed'
                )}
            >
                <FileText size={24} style={{ color: GOLD }} />
                <span className="text-sm font-medium text-neo-text">Contrato</span>
                <span className="text-[10px] text-neo-text-secondary">
                    {hasContract ? 'Visualizar PDF' : 'Pendente'}
                </span>
            </button>

            <button
                onClick={onGenerateReceipt}
                className="p-4 bg-neo-bg rounded-neo shadow-neo-out flex flex-col items-center gap-2 active:shadow-neo-pressed transition-all"
            >
                <Receipt size={24} style={{ color: GOLD }} />
                <span className="text-sm font-medium text-neo-text">Recibo</span>
                <span className="text-[10px] text-neo-text-secondary">Gerar PDF</span>
            </button>
        </div>
    </section>
);

// Contact Specialist Section
const ContactSpecialist: React.FC = () => (
    <Card className="p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center">
                <Heart size={20} className="text-neo-accent" />
            </div>
            <div>
                <h3 className="font-semibold text-neo-text">Fale com nossa Especialista</h3>
                <p className="text-xs text-neo-text-secondary">Tire dúvidas sobre seu dia especial</p>
            </div>
        </div>
        <div className="flex gap-3">
            <button
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Sou noiva e gostaria de mais informações.', '_blank')}
                className="flex-1 py-3 bg-neo-bg border-2 border-green-500 text-green-600 rounded-neo shadow-neo-out font-semibold flex items-center justify-center gap-2 active:shadow-neo-pressed"
            >
                <MessageCircle size={18} />
                WhatsApp
            </button>
            <button
                onClick={() => window.open('tel:+5511999999999')}
                className="flex-1 py-3 bg-neo-bg rounded-neo shadow-neo-out text-neo-text font-semibold flex items-center justify-center gap-2 active:shadow-neo-pressed"
            >
                <Phone size={18} />
                Ligar
            </button>
        </div>
    </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
export const BridePortalPage: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [weddingDate, setWeddingDate] = useState<Date | null>(new Date('2025-06-15'));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isAdmin] = useState(false);

    const [timeline] = useState<TimelineStep[]>([
        { id: 'contract', title: 'Contrato', status: 'completed', date: new Date('2024-12-01') },
        { id: 'trial', title: 'Teste Beleza', status: 'scheduled', date: new Date('2025-05-01') },
        { id: 'prewedding', title: 'Pré-Wedding', status: 'pending' },
        { id: 'wedding', title: 'Grande Dia', status: 'pending', date: new Date('2025-06-15') },
    ]);

    const [moodboardPhotos] = useState<MoodboardPhoto[]>([
        { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200', category: 'vestido' },
        { id: '2', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200', category: 'maquiagem' },
        { id: '3', url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200', category: 'penteado' },
    ]);

    const [attendants, setAttendants] = useState<Attendant[]>([
        {
            id: '1',
            name: 'Ana Carolina',
            relation: 'Madrinha',
            services: [
                { id: 'combo-glam', name: 'Combo Glamour', price: 380 }
            ],
            depositPaid: 200,
            totalPrice: 380,
        },
        {
            id: '2',
            name: 'Maria Helena',
            relation: 'Mãe da Noiva',
            services: [
                { id: 'makeup-glam', name: 'Maquiagem Glamour', price: 220 },
                { id: 'coque', name: 'Penteado Coque', price: 140 }
            ],
            depositPaid: 360,
            totalPrice: 360,
        },
    ]);

    const [showAddAttendant, setShowAddAttendant] = useState(false);
    const [newAttendantName, setNewAttendantName] = useState('');
    const [newAttendantRelation, setNewAttendantRelation] = useState('');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const handleAddPhoto = (category: string) => {
        // TODO: Implement photo upload
        alert(`Upload de foto para categoria: ${category}`);
    };

    const handleRemoveAttendant = (id: string) => {
        setAttendants(prev => prev.filter(a => a.id !== id));
    };

    const handleAddAttendant = () => {
        if (!newAttendantName.trim()) return;

        const services = AVAILABLE_SERVICES.filter(s => selectedServices.includes(s.id));
        const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

        setAttendants(prev => [...prev, {
            id: Date.now().toString(),
            name: newAttendantName,
            relation: newAttendantRelation || 'Convidada',
            services,
            depositPaid: 0,
            totalPrice,
        }]);

        setNewAttendantName('');
        setNewAttendantRelation('');
        setSelectedServices([]);
        setShowAddAttendant(false);
    };

    const handleViewContract = () => {
        alert('Abrindo contrato PDF...');
    };

    const handleGenerateReceipt = () => {
        alert('Gerando recibo PDF...');
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center active:shadow-neo-pressed"
                        >
                            <ArrowLeft size={20} className="text-neo-text-secondary" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Crown size={20} style={{ color: GOLD }} />
                            <h1 className="font-display font-semibold text-neo-text">Área da Noiva</h1>
                        </div>
                        <div className="w-10" />
                    </div>
                </header>

                {/* Content */}
                <main className="px-4">
                    {/* Countdown */}
                    <CountdownWidget weddingDate={weddingDate} onEditDate={() => setShowDatePicker(true)} />

                    {/* Journey Timeline */}
                    <JourneyTimeline steps={timeline} />

                    {/* Moodboard */}
                    <MoodboardSection
                        photos={moodboardPhotos}
                        onAddPhoto={handleAddPhoto}
                        isAdmin={isAdmin}
                        proNotes=""
                    />

                    {/* Attendant Manager */}
                    <AttendantManager
                        attendants={attendants}
                        onAdd={() => setShowAddAttendant(true)}
                        onEdit={(id) => alert(`Editando: ${id}`)}
                        onRemove={handleRemoveAttendant}
                    />


                    {/* === NEW: Service Selection Entry Card (Glassmorphic) === */}
                    <motion.button
                        onClick={() => navigate('/noiva/colecao')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "w-full p-6 mb-6 rounded-[1.5rem] text-left group overflow-hidden relative",
                            // Glassmorphism Recipe
                            "bg-white/10 backdrop-blur-2xl border border-white/20",
                            "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]"
                        )}
                    >
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                        <div className="relative flex items-center gap-4">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center shadow-neo-out"
                                style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                            >
                                <Package size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-neo-text">Selecionar Meus Serviços</h3>
                                <p className="text-sm text-neo-text-secondary">Escolha seus pacotes e adicionais</p>
                            </div>
                            <ChevronRight size={24} className="text-neo-accent group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>

                    {/* Documents Hub */}
                    <DocumentsHub
                        hasContract={true}
                        onViewContract={handleViewContract}
                        onGenerateReceipt={handleGenerateReceipt}
                    />

                    {/* Contact Specialist */}
                    <ContactSpecialist />
                </main>

                {/* Add Attendant Modal - Glassmorphic */}
                <AnimatePresence>
                    {showAddAttendant && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
                            onClick={() => setShowAddAttendant(false)}
                        >
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className={cn(
                                    "w-full max-w-lg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto",
                                    "bg-white/10 backdrop-blur-2xl border-t border-white/20",
                                    "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4)]"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                                        >
                                            <Users size={18} className="text-white" />
                                        </div>
                                        <h2 className="font-serif text-xl text-neo-text">Adicionar Convidada</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowAddAttendant(false)}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <X size={20} className="text-neo-text-secondary" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Nome</label>
                                        <input
                                            type="text"
                                            value={newAttendantName}
                                            onChange={(e) => setNewAttendantName(e.target.value)}
                                            placeholder="Ex: Ana"
                                            className="w-full px-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Relação</label>
                                        <input
                                            type="text"
                                            value={newAttendantRelation}
                                            onChange={(e) => setNewAttendantRelation(e.target.value)}
                                            placeholder="Ex: Madrinha, Mãe da Noiva..."
                                            className="w-full px-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Serviços</label>
                                        <div className="space-y-2">
                                            {AVAILABLE_SERVICES.map((service) => (
                                                <button
                                                    key={service.id}
                                                    onClick={() => {
                                                        setSelectedServices(prev =>
                                                            prev.includes(service.id)
                                                                ? prev.filter(id => id !== service.id)
                                                                : [...prev, service.id]
                                                        );
                                                    }}
                                                    className={cn(
                                                        'w-full p-3 rounded-neo flex items-center justify-between transition-all',
                                                        selectedServices.includes(service.id)
                                                            ? 'shadow-neo-pressed text-neo-accent'
                                                            : 'shadow-neo-out text-neo-text'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            'w-5 h-5 rounded border-2 flex items-center justify-center',
                                                            selectedServices.includes(service.id)
                                                                ? 'bg-neo-accent border-neo-accent'
                                                                : 'border-neo-text-secondary/30'
                                                        )}>
                                                            {selectedServices.includes(service.id) && (
                                                                <Check size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        <span>{service.name}</span>
                                                    </div>
                                                    <span className="font-semibold">{formatCurrency(service.price)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleAddAttendant}
                                        disabled={!newAttendantName.trim() || selectedServices.length === 0}
                                    >
                                        <Plus size={18} />
                                        Adicionar ao Pacote
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* === DATE PICKER MODAL (Glassmorphic) === */}
                <AnimatePresence>
                    {showDatePicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                            onClick={() => setShowDatePicker(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={cn(
                                    "w-full max-w-sm p-6 rounded-2xl",
                                    // Glassmorphism Recipe
                                    "bg-white/10 backdrop-blur-xl border border-white/20",
                                    "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.3)]"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                                    >
                                        <Calendar size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-neo-text">Data do Grande Dia</h2>
                                        <p className="text-xs text-neo-text-secondary">Qual a data do seu casamento?</p>
                                    </div>
                                </div>

                                <input
                                    type="date"
                                    defaultValue={weddingDate ? weddingDate.toISOString().split('T')[0] : ''}
                                    className={cn(
                                        "w-full px-4 py-4 mb-6 rounded-xl text-neo-text text-lg font-medium text-center",
                                        "bg-white/10 backdrop-blur-xl border border-white/20",
                                        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
                                        "focus:outline-none focus:ring-2 focus:ring-neo-accent/50"
                                    )}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setWeddingDate(new Date(e.target.value + 'T12:00:00'));
                                        }
                                    }}
                                />

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => setShowDatePicker(false)}
                                >
                                    Confirmar Data
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BridePortalPage;
