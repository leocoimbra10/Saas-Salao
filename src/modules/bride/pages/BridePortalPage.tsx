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
import { NeoCard, NeoButton, Badge, Progress, Skeleton, Typography, NeoSelect, NeoTextarea, Checkbox } from '../../../shared/components/ui/NeoComponents';
import { BridalIntakeForm } from '../components/BridalIntakeForm';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = '#FDF2F5'; // Lighter version for backgrounds

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getFullBrideData, updateBridalPackage } from '../services/brideService';
import { toast } from 'sonner';

// ============================================
// SKELETON LOADER
// ============================================
const BridePortalSkeleton = () => (
    <div className="w-full max-w-[480px] mx-auto p-4 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between py-4">
            <Skeleton className="w-10 h-10 rounded-neo shadow-neo-out" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <div className="w-10 text-neo-accent" />
        </div>

        {/* Countdown Skeleton */}
        <Skeleton className="h-24 w-full rounded-neo shadow-neo-out" />

        {/* Timeline Skeleton */}
        <div className="bg-neo-bg rounded-neo shadow-neo-out p-4 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="flex justify-between items-center px-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                ))}
            </div>
        </div>

        {/* Moodboard Skeleton */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24 rounded-neo" />
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="aspect-square rounded-neo shadow-neo-out" />
                ))}
            </div>
        </div>

        {/* Attendants Skeleton */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
    </div>
);

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
    imageUrl: string;
    category: 'dress' | 'hair' | 'makeup' | 'inspiration';
    notes?: string;
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
    { id: 'dress', label: 'Vestido', icon: <Heart size={16} /> },
    { id: 'hair', label: 'Penteado', icon: <Scissors size={16} /> },
    { id: 'makeup', label: 'Maquiagem', icon: <Palette size={16} /> },
    { id: 'inspiration', label: 'Inspiração', icon: <Sparkles size={16} /> },
];

// ============================================
// COMPONENTS
// ============================================

// Journey Timeline Stepper
const JourneyTimeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => {
    const completedCount = steps.filter(s => s.status === 'completed').length;
    const progressPercent = (completedCount / steps.length) * 100;

    return (
        <NeoCard className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Crown size={20} style={{ color: GOLD }} />
                <Typography variant="h6">Sua Jornada de Noiva</Typography>
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
                        <Typography
                            variant="label"
                            className={cn(
                                'text-[10px] block',
                                step.status === 'completed' ? 'text-neo-text' : 'text-neo-text-secondary'
                            )}
                        >
                            {step.title}
                        </Typography>
                        {step.date && (
                            <Typography variant="caption" className="text-[8px] block mt-0.5">
                                {step.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </Typography>
                        )}
                        {step.status === 'scheduled' && (
                            <Badge variant="warning" className="text-[8px] mt-1 h-4">Agendado</Badge>
                        )}
                    </div>
                ))}
            </div>
        </NeoCard>
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
            <NeoButton
                variant="glass"
                onClick={onEditDate}
                className="w-full py-8 mb-6 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 shadow-neo-out-lg"
            >
                <Sparkles size={32} style={{ color: GOLD }} />
                <Typography variant="h6">Defina a data do seu grande dia</Typography>
                <Typography variant="caption" className="italic text-neo-text-secondary">Toque para adicionar</Typography>
            </NeoButton>
        );
    }

    return (
        <NeoCard className="p-4 mb-6 relative overflow-hidden">
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
                        <Typography
                            variant="h1"
                            className="font-serif !text-4xl"
                            style={{
                                color: GOLD,
                                textShadow: `0 0 20px ${GOLD}66, 0 0 40px ${GOLD}33`
                            }}
                        >
                            {days}
                        </Typography>
                        <Typography variant="caption" className="text-neo-text-secondary block">dias para o grande dia!</Typography>
                        {weeks > 0 && (
                            <Typography variant="caption" className="text-[10px] text-neo-text-secondary block">
                                ({weeks} semanas e {remainingDays} dias)
                            </Typography>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <Typography variant="body" className="font-semibold block">
                        {weddingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </Typography>
                    <NeoButton
                        variant="ghost"
                        size="sm"
                        onClick={onEditDate}
                        className="text-neo-accent mt-1 h-auto p-0 hover:bg-transparent"
                        icon={<Edit3 size={12} />}
                    >
                        Alterar
                    </NeoButton>
                </div>
            </div>
        </NeoCard>
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
                <Typography variant="h6" className="flex items-center gap-2">
                    <Camera size={18} style={{ color: GOLD }} />
                    Moodboard
                </Typography>
                <NeoButton
                    variant="neu"
                    size="sm"
                    onClick={() => onAddPhoto('inspiracao')}
                    className="text-neo-accent"
                    icon={<Plus size={14} />}
                >
                    Adicionar
                </NeoButton>
            </div>

            <div className="mb-4">
                <NeoSelect
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={[
                        { value: 'all', label: 'Todas as Fotos' },
                        ...MOODBOARD_CATEGORIES.map(cat => ({ value: cat.id, label: cat.label }))
                    ]}
                />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {filteredPhotos.map(photo => (
                    <div
                        key={photo.id}
                        className="aspect-square rounded-neo shadow-neo-out overflow-hidden relative group"
                    >
                        <img
                            src={photo.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null; // Prevent infinite loop
                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=No+Image&background=F3F4F6&color=9CA3AF';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Trash2 size={16} className="text-white cursor-pointer" />
                        </div>
                    </div>
                ))}

                {/* Add Photo Button */}
                <NeoButton
                    variant="neu"
                    onClick={() => onAddPhoto(selectedCategory === 'all' ? 'inspiracao' : selectedCategory)}
                    className="aspect-square flex-col gap-1 border-2 border-dashed border-neo-text-secondary/20 shadow-neo-in"
                    icon={<Upload size={20} className="text-neo-text-secondary" />}
                >
                    <Typography variant="caption" className="text-[10px] text-neo-text-secondary">Upload</Typography>
                </NeoButton>
            </div>

            {/* Pro Notes (Admin Only) */}
            {isAdmin && (
                <NeoCard className="p-4">
                    <button
                        onClick={() => setShowProNotes(!showProNotes)}
                        className="w-full flex items-center justify-between"
                    >
                        <Typography variant="label" className="font-medium flex items-center gap-2">
                            <FileText size={16} style={{ color: GOLD }} />
                            Ficha Técnica do Teste
                        </Typography>
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
                                <NeoTextarea
                                    placeholder="Produtos utilizados, tom de base, técnicas aplicadas..."
                                    className="mt-4"
                                    rows={4}
                                    defaultValue={proNotes}
                                />
                                <NeoButton variant="gradient" size="sm" className="mt-2">
                                    Salvar Anotações
                                </NeoButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </NeoCard>
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
                    <Typography variant="h6" className="flex items-center gap-2 font-serif">
                        <Users size={18} style={{ color: GOLD }} />
                        Madrinhas & Convidadas
                    </Typography>
                    {attendants.length > 0 && (
                        <Typography variant="caption" className="tracking-wider text-neo-text-secondary block">
                            {attendants.length} pessoas • Total: {formatCurrency(totalPackage)}
                        </Typography>
                    )}
                </div>
                <NeoButton
                    variant="glass"
                    onClick={onAdd}
                    className="px-4 py-2 h-auto gap-2"
                    icon={<Plus size={16} style={{ color: GOLD }} />}
                >
                    <Typography variant="label" className="font-medium">Adicionar</Typography>
                </NeoButton>
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
                    <Typography variant="h6" className="font-serif mb-1">Convide suas madrinhas</Typography>
                    <Typography variant="caption" className="text-neo-text-secondary mb-4 block">
                        Adicione as pessoas especiais para o dia da noiva
                    </Typography>
                    <NeoButton
                        variant="ghost"
                        onClick={onAdd}
                        className="text-sm font-medium hover:bg-transparent p-0"
                        style={{ color: GOLD }}
                    >
                        + Adicionar primeira convidada
                    </NeoButton>
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
                                        <Typography variant="body" className="font-serif font-medium">{attendant.name}</Typography>
                                        <Typography variant="label" className="text-[11px] text-neo-text-secondary tracking-wider uppercase block">
                                            {attendant.relation}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <NeoButton
                                        variant="neu"
                                        size="sm"
                                        onClick={() => onEdit(attendant.id)}
                                        className="p-0 w-8 h-8 flex items-center justify-center"
                                        icon={<Edit3 size={14} style={{ color: GOLD }} />}
                                    />
                                    <NeoButton
                                        variant="neu"
                                        size="sm"
                                        onClick={() => onRemove(attendant.id)}
                                        className="p-0 w-8 h-8 flex items-center justify-center group/del"
                                        icon={<Trash2 size={14} className="text-red-400 group-hover/del:text-red-500" />}
                                    />
                                </div>
                            </div>

                            {/* Services */}
                            <div className="relative mb-3 pl-1">
                                {attendant.services.map(service => (
                                    <div key={service.id} className="flex justify-between items-center py-1">
                                        <Typography variant="caption" className="text-neo-text-secondary">{service.name}</Typography>
                                        <Typography variant="body" className="font-medium tracking-wider">
                                            {formatCurrency(service.price)}
                                        </Typography>
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
                                    <Typography variant="caption" className="text-neo-text-secondary">Pagamento</Typography>
                                    <Typography variant="label" className="font-semibold tracking-wider">
                                        {paidPercent.toFixed(0)}%
                                    </Typography>
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
                                <div className="flex justify-between items-center">
                                    <Typography variant="caption" className="text-green-400 tracking-wider">
                                        Pago: {formatCurrency(attendant.depositPaid)}
                                    </Typography>
                                    <Typography variant="caption" style={{ color: GOLD }} className="tracking-wider">
                                        Pendente: {formatCurrency(remaining)}
                                    </Typography>
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
                    <Typography variant="h6" className="font-serif mb-3 flex items-center gap-2">
                        <DollarSign size={16} style={{ color: GOLD }} />
                        Resumo Financeiro
                    </Typography>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <Typography variant="h4" className="tracking-wider block">
                                {formatCurrency(totalPackage)}
                            </Typography>
                            <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase tracking-widest block">Total</Typography>
                        </div>
                        <div>
                            <Typography variant="h4" className="text-green-400 tracking-wider block">
                                {formatCurrency(totalPaid)}
                            </Typography>
                            <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase tracking-widest block">Pago</Typography>
                        </div>
                        <div>
                            <Typography variant="h4" className="tracking-wider block" style={{ color: GOLD }}>
                                {formatCurrency(totalPending)}
                            </Typography>
                            <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase tracking-widest block">Pendente</Typography>
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
        <Typography variant="h6" className="flex items-center gap-2 mb-4 font-serif">
            <FileText size={18} style={{ color: GOLD }} />
            Documentos
        </Typography>

        <div className="grid grid-cols-2 gap-3">
            <NeoButton
                variant="neu"
                onClick={onViewContract}
                disabled={!hasContract}
                className={cn(
                    'p-4 h-auto flex-col gap-2',
                    !hasContract && 'opacity-50 cursor-not-allowed'
                )}
                icon={<FileText size={24} style={{ color: GOLD }} />}
            >
                <Typography variant="label" className="font-medium text-neo-text block">Contrato</Typography>
                <Typography variant="caption" className="text-[10px] text-neo-text-secondary block">
                    {hasContract ? 'Visualizar PDF' : 'Pendente'}
                </Typography>
            </NeoButton>

            <NeoButton
                variant="neu"
                onClick={onGenerateReceipt}
                className="p-4 h-auto flex-col gap-2"
                icon={<Receipt size={24} style={{ color: GOLD }} />}
            >
                <Typography variant="label" className="font-medium text-neo-text block">Recibo</Typography>
                <Typography variant="caption" className="text-[10px] text-neo-text-secondary block">Gerar PDF</Typography>
            </NeoButton>
        </div>
    </section>
);

// Contact Specialist Section
const ContactSpecialist: React.FC = () => (
    <NeoCard className="p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center">
                <Heart size={20} className="text-neo-accent" />
            </div>
            <div>
                <Typography variant="label" className="font-semibold text-neo-text block">Fale com nossa Especialista</Typography>
                <Typography variant="caption" className="text-neo-text-secondary block">Tire dúvidas sobre seu dia especial</Typography>
            </div>
        </div>
        <div className="flex gap-3">
            <NeoButton
                variant="outline"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Sou noiva e gostaria de mais informações.', '_blank')}
                className="flex-1 py-3 border-green-500 text-green-600 hover:bg-green-50 gap-2"
                icon={<MessageCircle size={18} />}
            >
                WhatsApp
            </NeoButton>
            <NeoButton
                variant="neu"
                onClick={() => window.open('tel:+5511999999999')}
                className="flex-1 py-3 gap-2"
                icon={<Phone size={18} />}
            >
                Ligar
            </NeoButton>
        </div>
    </NeoCard>
);

// ============================================
// MAIN COMPONENT
// ============================================
export const BridePortalPage: React.FC = () => {
    const navigate = useNavigate();
    //     const { id } = useParams<{ id: string }>();    
    const params = useParams<{ id: string }>();
    // For demo purposes, if no ID is present, we treat it as valid to show the Mock Data
    const id = params.id || 'demo-mode';
    const isDemo = id === 'demo-mode';

    const [showIntakeForm, setShowIntakeForm] = useState(false);

    // MOCK DATA FOR DEMO/TESTING
    const dummyBrideData = {
        id: 'mock-bride-1',
        clientId: 'test-client-uid',
        clientName: 'Marcela (Noiva Teste)',
        weddingDate: new Date('2025-12-15'),
        status: 'active',
        packageId: 'combo-glam-plus',
        totalValue: 2450.00,
        paidValue: 800.00,
        contractSigned: false,
        contractUrl: null,
        notes: 'Gostaria de testar penteado meio preso.',
        createdAt: new Date(),
        updatedAt: new Date(),
        timeline: [
            { id: '1', title: 'Reserva & Contrato', status: 'completed', date: new Date('2024-01-10') },
            { id: '2', title: 'Teste de Penteado', status: 'scheduled', date: new Date('2024-11-20'), subtitle: '14:00' },
            { id: '3', title: 'Teste de Make', status: 'pending' },
            { id: '4', title: 'O Grande Dia', status: 'pending', date: new Date('2025-12-15') }
        ] as any[],
        moodboardPhotos: [
            { id: '1', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80', category: 'dress' },
            { id: '2', imageUrl: 'https://images.unsplash.com/photo-1522337360477-36358785d18b?auto=format&fit=crop&q=80', category: 'hair' },
            { id: '3', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80', category: 'makeup' }
        ] as any[],
        attendants: [
            { id: '1', name: 'Ana Silva', relation: 'Mãe da Noiva', services: [{ id: 'mk1', name: 'Make Social', price: 160 }], depositPaid: 50, totalPrice: 160 },
            { id: '2', name: 'Julia Santos', relation: 'Madrinha', services: [{ id: 'hair1', name: 'Penteado', price: 140 }], depositPaid: 140, totalPrice: 140 }
        ] as any[]
    };

    // No longer redirecting if !id. We show Demo Data instead.
    /*
    React.useEffect(() => {
        if (!id) {
            navigate('/noiva/cadastro');
        }
    }, [id, navigate]);
    */

    const { data: fetchedBride, isLoading } = useQuery({
        queryKey: ['bride_full_data', id],
        queryFn: () => getFullBrideData(id),
        enabled: !!id && !isDemo, // Only fetch if we have a real ID
    });

    // Use Mock Data if in Demo Mode, otherwise real data
    const bride = isDemo ? dummyBrideData : fetchedBride;

    // Loading state only matters if we are NOT in demo mode and trying to fetch
    if (!isDemo && isLoading) return <BridePortalSkeleton />;

    // If real fetch failed or returned null (and not demo)
    if (!isDemo && !bride) return <div className="p-8 text-center">Noiva não encontrada</div>;

    // Safety check for empty data even in demo (shouldn't happen with const)
    if (!bride) return null;

    // Cast properties to safe defaults
    const timeline = (bride as any).timeline || [];
    const moodboardPhotos = (bride as any).moodboardPhotos || [];
    const attendants = (bride as any).attendants || [];

    const handleAddPhoto = (category: string) => {
        toast.info(`Upload de foto para ${category} em breve!`);
    };

    const handleViewContract = () => {
        toast.info('Contrato de demonstração visualizado');
    };

    const handleGenerateReceipt = () => {
        toast.success('Recibo gerado com sucesso!');
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-32 overflow-x-hidden">
            <header className="p-4 bg-neo-bg/80 backdrop-blur-md sticky top-0 z-30">
                <div className="w-full max-w-[480px] mx-auto flex items-center justify-between">
                    <NeoButton
                        variant="neu"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 p-0 flex items-center justify-center"
                        icon={<ArrowLeft size={20} className="text-neo-text-secondary" />}
                    />
                    <div className="flex items-center gap-2">
                        <Crown size={20} style={{ color: GOLD }} />
                        <Typography variant="h6" className="font-serif">Área da Noiva</Typography>
                    </div>
                    <div className="w-10" />
                </div>
            </header>

            <main className="w-full max-w-[480px] mx-auto p-4 pb-12">
                {/* Header Welcome */}
                <div className="mb-8 p-4">
                    <Typography variant="h1" className="font-serif !text-3xl mb-1">Olá, {bride.clientName}</Typography>
                    <Typography variant="body" className="text-neo-text-secondary italic block">
                        Seu grande sonho está sendo preparado com carinho.
                    </Typography>
                </div>

                {/* Countdown */}
                <CountdownWidget
                    weddingDate={bride.weddingDate}
                    onEditDate={() => { }}
                />

                {/* Digital Intake CTA */}
                <NeoCard className="p-4 mb-6 bg-gradient-to-br from-neo-bg to-neo-accent/5 border border-neo-accent/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white shadow-neo-out flex items-center justify-center text-neo-accent">
                                <FileText size={20} />
                            </div>
                            <div>
                                <Typography variant="label" className="font-bold block">Ficha de Noiva</Typography>
                                <Typography variant="caption" className="text-[10px] text-neo-text-secondary italic block">
                                    Conte-nos seus desejos e preferências
                                </Typography>
                            </div>
                        </div>
                        <NeoButton variant="neu" size="sm" onClick={() => setShowIntakeForm(true)}>
                            Preencher
                        </NeoButton>
                    </div>
                </NeoCard>

                {/* Timeline */}
                <JourneyTimeline steps={timeline.map(m => ({
                    id: m.id,
                    title: m.type === 'trial' ? 'Prova' : m.type === 'pre_wedding' ? 'Pré-Wedding' : 'Grande Dia',
                    status: m.status,
                    date: m.date
                }))} />

                {/* Moodboard */}
                <MoodboardSection
                    photos={moodboardPhotos.map(p => ({
                        id: p.id,
                        imageUrl: p.imageUrl,
                        category: p.category as any
                    }))}
                    onAddPhoto={handleAddPhoto}
                    isAdmin={false}
                />

                {/* Attendant Manager */}
                <AttendantManager
                    attendants={attendants.map(a => ({
                        id: a.id,
                        name: a.name,
                        relation: a.relation === 'bridesmaid' ? 'Madrinha' : a.relation === 'mother' ? 'Mãe' : 'Convidada',
                        services: Array.isArray(a.services) ? a.services.map(s => {
                            if (typeof s === 'string') return { id: s, name: s, price: 0 };
                            // Handle if s is already an object
                            return { id: s.id, name: s.name, price: s.price || 0 };
                        }) : [],
                        depositPaid: a.isPaid ? 100 : 0,
                        totalPrice: 100
                    }))}
                    onAdd={() => { }}
                    onEdit={() => { }}
                    onRemove={() => { }}
                />

                {/* Service Selection Card */}
                <NeoButton
                    variant="glass"
                    onClick={() => navigate(`/noiva/${id}/colecao`)}
                    className="w-full p-6 mb-6 rounded-[1.5rem] h-auto shadow-neo-out-lg group"
                >
                    <div className="w-full flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-neo-out"
                            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                        >
                            <Package size={24} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <Typography variant="h6" className="text-lg block">Meus Serviços</Typography>
                            <Typography variant="caption" className="text-sm text-neo-text-secondary block">
                                Personalize seu pacote especial
                            </Typography>
                        </div>
                        <ChevronRight size={24} className="text-neo-accent transition-transform group-hover:translate-x-1" />
                    </div>
                </NeoButton>

                {/* Documents Hub */}
                <DocumentsHub
                    hasContract={true}
                    onViewContract={handleViewContract}
                    onGenerateReceipt={handleGenerateReceipt}
                />

                {/* Contact */}
                <ContactSpecialist />
            </main>

            {/* Intake Form Modal */}
            <AnimatePresence>
                {showIntakeForm && (
                    <BridalIntakeForm
                        brideId={id || ''}
                        onClose={() => setShowIntakeForm(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BridePortalPage;
