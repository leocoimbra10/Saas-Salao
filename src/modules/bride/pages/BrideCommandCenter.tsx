/**
 * BRIDE COMMAND CENTER
 * Admin page for managing all bridal clients
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Crown,
    Calendar,
    DollarSign,
    Phone,
    MessageCircle,
    ChevronRight,
    Heart,
    Users,
    Clock,
    CheckCircle,
    Plus,
    Search,
    Filter,
    Settings,
    Sparkles
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { BridalPackage, BridalStatus } from '../../bride/types/brideTypes';
import { Badge, Button, Input } from '../../../shared/components/ui/NeoComponents';
import BridalServicesManager from '../../admin/components/BridalServicesManager';

// Brand Colors - Rose Pink
const ROSE = '#E8A0B8';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBridalPackagesByOrg, createBridalPackage, updateBridalPackage } from '../../bride/services/brideService';
import { useBranding } from '../../organization/context/BrandingContext';
import { notificationService } from '../../../shared/services/notificationService';
import { toast } from 'sonner';
import { useBrideTimeline } from '../../bride/hooks/useBrideTimeline';


// Status Badge Component
const StatusBadge: React.FC<{ status: BridalStatus }> = ({ status }) => {
    const config: Record<BridalStatus, { label: string; color: string; bg: string }> = {
        lead: { label: 'Lead', color: 'text-blue-600', bg: 'bg-blue-100' },
        confirmed: { label: 'Confirmada', color: 'text-green-600', bg: 'bg-green-100' },
        trial_done: { label: 'Prova Feita', color: 'text-amber-600', bg: 'bg-amber-100' },
        completed: { label: 'Concluído', color: 'text-gray-600', bg: 'bg-gray-100' },
        cancelled: { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-100' },
    };

    const { label, color, bg } = config[status];

    return (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', color, bg)}>
            {label}
        </span>
    );
};

// Bride Card Component
const BrideCard: React.FC<{
    bride: BridalPackage;
    onClick: () => void;
    onWhatsApp: () => void;
}> = ({ bride, onClick, onWhatsApp }) => {
    const daysUntilWedding = Math.ceil(
        (bride.weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const trialDate = bride.timeline.find(t => t.type === 'trial')?.date;
    const depositPercent = bride.packageValue > 0
        ? (bride.depositPaid / bride.packageValue) * 100
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className="bg-neo-bg rounded-neo shadow-neo-out p-4 cursor-pointer active:shadow-neo-pressed transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                    >
                        <Crown size={20} className="text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-neo-text">{bride.clientName}</h4>
                        <p className="text-xs text-neo-text-secondary">
                            {bride.weddingDate.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <StatusBadge status={bride.status} />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Days Until Wedding */}
                <div className="bg-neo-bg rounded-neo-sm shadow-neo-in p-2">
                    <div className="flex items-center gap-1 text-neo-text-secondary text-xs mb-1">
                        <Calendar size={12} />
                        <span>Casamento</span>
                    </div>
                    <span className="font-semibold text-neo-text">
                        {daysUntilWedding > 0 ? `${daysUntilWedding} dias` : 'Hoje!'}
                    </span>
                </div>

                {/* Package Value */}
                <div className="bg-neo-bg rounded-neo-sm shadow-neo-in p-2">
                    <div className="flex items-center gap-1 text-neo-text-secondary text-xs mb-1">
                        <DollarSign size={12} />
                        <span>Pacote</span>
                    </div>
                    <span className="font-semibold text-neo-text">
                        {formatCurrency(bride.packageValue)}
                    </span>
                </div>
            </div>

            {/* Trial Date */}
            {trialDate && (
                <div className="flex items-center gap-2 text-xs text-neo-text-secondary mb-3">
                    <Clock size={12} />
                    <span>
                        Prova: {trialDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    {bride.timeline.find(t => t.type === 'trial')?.status === 'completed' && (
                        <CheckCircle size={12} className="text-green-500" />
                    )}
                </div>
            )}

            {/* Attendants */}
            {bride.attendants.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neo-text-secondary mb-3">
                    <Users size={12} />
                    <span>{bride.attendants.length} pessoas + {formatCurrency(
                        bride.attendants.reduce((sum, a) => sum + a.totalPrice, 0)
                    )}</span>
                </div>
            )}

            {/* Payment Progress */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-neo-text-secondary mb-1">
                    <span>Pagamento</span>
                    <span>{depositPercent.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${depositPercent}%`,
                            backgroundColor: GOLD
                        }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-neo-text-secondary/10">
                <button
                    onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
                    className="flex-1 py-2 rounded-neo shadow-neo-out text-green-500 text-xs font-medium flex items-center justify-center gap-1"
                >
                    <MessageCircle size={14} />
                    WhatsApp
                </button>
                <button
                    onClick={onClick}
                    className="flex-1 py-2 rounded-neo shadow-neo-out text-neo-text-secondary text-xs font-medium flex items-center justify-center gap-1"
                >
                    Ver Detalhes
                    <ChevronRight size={14} />
                </button>
            </div>
        </motion.div>
    );
};

// Stats Card Component
const StatsCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subvalue?: string }> = ({
    icon, label, value, subvalue
}) => (
    <div className="bg-neo-bg rounded-neo shadow-neo-out p-4">
        <div className="flex items-center gap-2 mb-2">
            <span style={{ color: GOLD }}>{icon}</span>
            <span className="text-xs text-neo-text-secondary">{label}</span>
        </div>
        <p className="text-xl font-bold text-neo-text">{value}</p>
        {subvalue && <p className="text-xs text-neo-text-secondary">{subvalue}</p>}
    </div>
);

// Timeline Section component
const TimelineSection: React.FC<{ packageId: string }> = ({ packageId }) => {
    const { timeline, isLoading } = useBrideTimeline(packageId);

    if (isLoading) return <div className="animate-pulse space-y-2"><div className="h-10 bg-neo-bg shadow-neo-in rounded-neo" /><div className="h-10 bg-neo-bg shadow-neo-in rounded-neo" /></div>;

    return (
        <div className="space-y-3">
            {timeline?.map(milestone => (
                <div key={milestone.id} className="flex items-center justify-between p-3 rounded-neo-sm shadow-neo-in">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                            milestone.status === 'completed' ? "bg-green-100 text-green-600" : "bg-neo-bg shadow-neo-out text-neo-text-secondary"
                        )}>
                            {milestone.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neo-text">
                                {milestone.type === 'trial' ? 'Prova' : milestone.type === 'pre_wedding' ? 'Pré-Wedding' : 'Casamento'}
                            </p>
                            <p className="text-[10px] text-neo-text-secondary">
                                {milestone.date ? milestone.date.toLocaleDateString('pt-BR') : 'Data a definir'}
                            </p>
                        </div>
                    </div>
                    <Badge variant={milestone.status === 'completed' ? 'success' : 'warning'}>
                        {milestone.status === 'scheduled' ? 'Agendado' : milestone.status === 'completed' ? 'OK' : 'Pendente'}
                    </Badge>
                </div>
            ))}
        </div>
    );
};

// Main Component
export const BrideCommandCenter: React.FC = () => {
    const navigate = useNavigate();
    const { organization: org } = useBranding();
    const queryClient = useQueryClient();

    const { data: brides = [], isLoading: loadingBrides } = useQuery({
        queryKey: ['bridal_packages', org?.id],
        queryFn: () => (org?.id ? getBridalPackagesByOrg(org.id) : Promise.resolve([])),
        enabled: !!org?.id,
    });

    const createBrideMutation = useMutation({
        mutationFn: createBridalPackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bridal_packages'] });
            setShowAddBride(false);
            toast.success('Noiva cadastrada com sucesso!');
        }
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BridalStatus | 'all'>('all');
    const [selectedBride, setSelectedBride] = useState<BridalPackage | null>(null);
    const [showAddBride, setShowAddBride] = useState(false);
    const [activeTab, setActiveTab] = useState<'brides' | 'services'>('brides');
    const [newBride, setNewBride] = useState({
        name: '',
        phone: '',
        email: '',
        weddingDate: '',
        selectedServices: [] as string[],
    });

    // Calculate stats
    const activeBrides = brides.filter(b => ['lead', 'confirmed', 'trial_done'].includes(b.status));
    const totalPackageValue = activeBrides.reduce((sum, b) => sum + b.packageValue, 0);
    const totalReceived = activeBrides.reduce((sum, b) => sum + b.depositPaid, 0);
    const upcomingTrials = brides.filter(b =>
        b.timeline.find(t => t.type === 'trial' && t.status === 'scheduled')
    );

    // Filter brides
    const filteredBrides = brides.filter(bride => {
        const matchesSearch = bride.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || bride.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleWhatsApp = async (bride: BridalPackage) => {
        await notificationService.sendManualAlert({
            to: bride.clientPhone,
            message: `Olá ${bride.clientName}! Passando para confirmar se está tudo pronto para o seu grande dia! 💍`,
            type: 'whatsapp'
        });

        // Also open WA link manually for immediate interaction
        const message = encodeURIComponent(`Olá ${bride.clientName}! Tudo bem? 💍`);
        window.open(`https://wa.me/55${bride.clientPhone}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-12 h-12 rounded-neo flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #E8C547 100%)` }}
                        >
                            <Crown size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-display">Noivas</h1>
                            <p className="text-caption">Central de Comando</p>
                        </div>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 px-4">
                    <button
                        onClick={() => setActiveTab('brides')}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-neo font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                            activeTab === 'brides'
                                ? 'shadow-neo-pressed text-neo-accent'
                                : 'shadow-neo-out text-neo-text-secondary hover:shadow-neo-flat'
                        )}
                    >
                        <Crown size={16} />
                        Noivas
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-neo font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                            activeTab === 'services'
                                ? 'shadow-neo-pressed'
                                : 'shadow-neo-out text-neo-text-secondary hover:shadow-neo-flat'
                        )}
                        style={{ color: activeTab === 'services' ? GOLD : undefined }}
                    >
                        <Settings size={16} />
                        Serviços
                    </button>
                </div>

                {/* Conditional Content based on Tab */}
                {activeTab === 'services' ? (
                    <BridalServicesManager />
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6 px-4">
                            <StatsCard
                                icon={<Heart size={18} />}
                                label="Noivas Ativas"
                                value={activeBrides.length.toString()}
                                subvalue="em andamento"
                            />
                            <StatsCard
                                icon={<DollarSign size={18} />}
                                label="Valor Total"
                                value={formatCurrency(totalPackageValue)}
                                subvalue={`${formatCurrency(totalReceived)} recebido`}
                            />
                            <StatsCard
                                icon={<Calendar size={18} />}
                                label="Próximas Provas"
                                value={upcomingTrials.length.toString()}
                                subvalue="agendadas"
                            />
                            <StatsCard
                                icon={<Users size={18} />}
                                label="Acompanhantes"
                                value={brides.reduce((sum, b) => sum + b.attendants.length, 0).toString()}
                                subvalue="cadastrados"
                            />
                        </div>

                        {/* Add Bride Button - Glassmorphic with Pulse */}
                        <div className="px-4 mb-6">
                            <motion.button
                                onClick={() => setShowAddBride(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold",
                                    // Glassmorphism Recipe
                                    "bg-white/10 backdrop-blur-xl border border-white/20",
                                    "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_8px_24px_-4px_rgba(0,0,0,0.15)]",
                                    "text-neo-text hover:bg-white/15 transition-all",
                                    "group relative overflow-hidden"
                                )}
                            >
                                {/* Liquid Pulse Animation on Hover */}
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{
                                        background: `radial-gradient(circle at center, ${ROSE}20 0%, transparent 70%)`
                                    }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                />
                                <Plus size={20} style={{ color: GOLD }} className="relative z-10" />
                                <span className="relative z-10">Cadastrar Noiva</span>
                            </motion.button>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar noiva..."
                                    className="w-full pl-10 pr-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                                />
                            </div>
                            <button className="w-12 h-12 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center">
                                <Filter size={18} className="text-neo-text-secondary" />
                            </button>
                        </div>

                        {/* Status Filter - Dropdown */}
                        <div className="relative px-4 mb-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BridalStatus | 'all')}
                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text appearance-none cursor-pointer focus:outline-none"
                                style={{ color: statusFilter !== 'all' ? GOLD : undefined }}
                            >
                                <option value="all">Todas as Noivas</option>
                                <option value="lead">Leads</option>
                                <option value="confirmed">Confirmadas</option>
                                <option value="trial_done">Prova OK</option>
                                <option value="completed">Concluídas</option>
                            </select>
                            <ChevronRight size={18} className="absolute right-7 top-1/2 -translate-y-1/2 rotate-90 text-neo-text-secondary pointer-events-none" />
                        </div>

                        {/* Content */}
                        <main className="px-6 space-y-4">
                            {filteredBrides.length === 0 ? (
                                <div className="text-center py-12">
                                    <Crown size={48} className="mx-auto mb-4 text-neo-text-secondary/30" />
                                    <p className="text-neo-text-secondary">Nenhuma noiva encontrada</p>
                                </div>
                            ) : (
                                filteredBrides.map(bride => (
                                    <BrideCard
                                        key={bride.id}
                                        bride={bride}
                                        onClick={() => setSelectedBride(bride)}
                                        onWhatsApp={() => handleWhatsApp(bride)}
                                    />
                                ))
                            )}
                        </main>

                        {/* FAB removed - using inline "Cadastrar Noiva" button instead */}

                        {/* Bride Detail Modal */}
                        {selectedBride && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
                                onClick={() => setSelectedBride(null)}
                            >
                                <motion.div
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                                style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                                            >
                                                <Crown size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-neo-text">{selectedBride.clientName}</h2>
                                                <p className="text-sm text-neo-text-secondary">{selectedBride.clientPhone}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={selectedBride.status} />
                                    </div>

                                    {/* Wedding Info */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <h3 className="font-semibold text-neo-text mb-2" style={{ color: GOLD }}>📅 Casamento</h3>
                                        <p className="text-neo-text">
                                            {selectedBride.weddingDate.toLocaleDateString('pt-BR', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        {selectedBride.weddingVenue && (
                                            <p className="text-sm text-neo-text-secondary">{selectedBride.weddingVenue}</p>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <h3 className="font-semibold text-neo-text mb-3" style={{ color: GOLD }}>📅 Cronograma</h3>
                                        <TimelineSection packageId={selectedBride.id} />
                                    </div>

                                    {/* Financial Summary */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <h3 className="font-semibold text-neo-text mb-3" style={{ color: GOLD }}>💰 Financeiro</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-neo-text-secondary">Valor do Pacote</span>
                                                <span className="font-semibold text-neo-text">{formatCurrency(selectedBride.packageValue)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neo-text-secondary">Sinal Pago</span>
                                                <span className="font-semibold text-green-600">{formatCurrency(selectedBride.depositPaid)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neo-text-secondary">Saldo Pendente</span>
                                                <span className="font-semibold" style={{ color: GOLD }}>{formatCurrency(selectedBride.balanceDue)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendants */}
                                    {selectedBride.attendants.length > 0 && (
                                        <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                            <h3 className="font-semibold text-neo-text mb-3" style={{ color: GOLD }}>👥 Acompanhantes</h3>
                                            <div className="space-y-2">
                                                {selectedBride.attendants.map(att => (
                                                    <div key={att.id} className="flex justify-between items-center">
                                                        <span className="text-neo-text">{att.name}</span>
                                                        <div className="text-right">
                                                            <span className="font-medium text-neo-text">{formatCurrency(att.totalPrice)}</span>
                                                            {att.isPaid && <span className="text-xs text-green-500 ml-2">✓</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 mt-6">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleWhatsApp(selectedBride)}
                                                className="flex-1 py-3 rounded-neo shadow-neo-out bg-neo-bg border-2 border-green-500 text-green-600 font-semibold flex items-center justify-center gap-2 active:shadow-neo-pressed"
                                            >
                                                <MessageCircle size={18} />
                                                Confirmar WhatsApp
                                            </button>
                                            <button
                                                onClick={() => {
                                                    notificationService.sendMilestoneAlert(
                                                        selectedBride.clientName,
                                                        selectedBride.clientPhone,
                                                        "Sua prova está chegando!"
                                                    );
                                                }}
                                                className="flex-1 py-3 rounded-neo shadow-neo-out bg-neo-bg border-2 border-neo-accent text-neo-accent font-semibold flex items-center justify-center gap-2 active:shadow-neo-pressed"
                                            >
                                                <Sparkles size={18} />
                                                Lembrete Mágico
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBride(null)}
                                            className="w-full py-3 rounded-neo shadow-neo-out text-neo-text-secondary font-semibold"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Add Bride Modal */}
                        {showAddBride && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
                                onClick={() => setShowAddBride(false)}
                            >
                                <motion.div
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                                        >
                                            <Crown size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-neo-text">Nova Noiva</h2>
                                            <p className="text-sm text-neo-text-secondary">Preencha os dados da nova cliente</p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-neo-text mb-2">Nome Completo *</label>
                                            <input
                                                type="text"
                                                value={newBride.name}
                                                onChange={(e) => setNewBride({ ...newBride, name: e.target.value })}
                                                placeholder="Nome da noiva"
                                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text placeholder:text-neo-text-secondary/50 focus:outline-none"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-neo-text mb-2">WhatsApp *</label>
                                            <input
                                                type="tel"
                                                value={newBride.phone}
                                                onChange={(e) => setNewBride({ ...newBride, phone: e.target.value })}
                                                placeholder="(11) 99999-9999"
                                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text placeholder:text-neo-text-secondary/50 focus:outline-none"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-neo-text mb-2">E-mail</label>
                                            <input
                                                type="email"
                                                value={newBride.email}
                                                onChange={(e) => setNewBride({ ...newBride, email: e.target.value })}
                                                placeholder="email@exemplo.com"
                                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text placeholder:text-neo-text-secondary/50 focus:outline-none"
                                            />
                                        </div>

                                        {/* Wedding Date */}
                                        <div>
                                            <label className="block text-sm font-medium text-neo-text mb-2">Data do Casamento *</label>
                                            <input
                                                type="date"
                                                value={newBride.weddingDate}
                                                onChange={(e) => setNewBride({ ...newBride, weddingDate: e.target.value })}
                                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text focus:outline-none"
                                            />
                                        </div>

                                        {/* Services Selector */}
                                        <div>
                                            <label className="block text-sm font-medium text-neo-text mb-2" style={{ color: GOLD }}>
                                                Selecione os Serviços *
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-neo shadow-neo-in">
                                                {[
                                                    { id: 'bride-day', name: 'Noiva Dia D (Make + Hair)', price: 850 },
                                                    { id: 'bride-trial', name: 'Prova de Noiva', price: 350 },
                                                    { id: 'bride-pre-wedding', name: 'Ensaio Pré-Wedding', price: 450 },
                                                    { id: 'hair-only', name: 'Penteado Noiva', price: 400 },
                                                    { id: 'makeup-only', name: 'Make Noiva', price: 450 },
                                                    { id: 'attendant-combo', name: 'Acompanhante (Make + Hair)', price: 280 },
                                                    { id: 'attendant-makeup', name: 'Acompanhante (Make)', price: 160 },
                                                    { id: 'attendant-hair', name: 'Acompanhante (Penteado)', price: 140 },
                                                    { id: 'mother-combo', name: 'Mãe da Noiva (Make + Hair)', price: 350 },
                                                ].map(service => (
                                                    <label
                                                        key={service.id}
                                                        className={`flex items-center justify-between p-3 rounded-neo cursor-pointer transition-all ${newBride.selectedServices.includes(service.id)
                                                            ? 'shadow-neo-in bg-neo-bg'
                                                            : 'shadow-neo-out hover:shadow-neo-flat'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={newBride.selectedServices.includes(service.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setNewBride({
                                                                            ...newBride,
                                                                            selectedServices: [...newBride.selectedServices, service.id]
                                                                        });
                                                                    } else {
                                                                        setNewBride({
                                                                            ...newBride,
                                                                            selectedServices: newBride.selectedServices.filter(s => s !== service.id)
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-5 h-5 accent-amber-500"
                                                            />
                                                            <span className="text-neo-text text-sm">{service.name}</span>
                                                        </div>
                                                        <span className="font-semibold text-neo-text-secondary text-sm">
                                                            {formatCurrency(service.price)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total Package Value */}
                                        {newBride.selectedServices.length > 0 && (
                                            <div className="p-4 rounded-neo shadow-neo-in bg-neo-bg">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neo-text font-medium">Total do Pacote:</span>
                                                    <span className="text-xl font-bold" style={{ color: GOLD }}>
                                                        {formatCurrency(
                                                            [
                                                                { id: 'bride-day', price: 850 },
                                                                { id: 'bride-trial', price: 350 },
                                                                { id: 'bride-pre-wedding', price: 450 },
                                                                { id: 'hair-only', price: 400 },
                                                                { id: 'makeup-only', price: 450 },
                                                                { id: 'attendant-combo', price: 280 },
                                                                { id: 'attendant-makeup', price: 160 },
                                                                { id: 'attendant-hair', price: 140 },
                                                                { id: 'mother-combo', price: 350 },
                                                            ].filter(s => newBride.selectedServices.includes(s.id))
                                                                .reduce((sum, s) => sum + s.price, 0)
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neo-text-secondary mt-1">
                                                    {newBride.selectedServices.length} serviço(s) selecionado(s)
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => {
                                                if (!newBride.name || !newBride.phone || !newBride.weddingDate || newBride.selectedServices.length === 0) {
                                                    alert('Preencha todos os campos obrigatórios e selecione ao menos um serviço');
                                                    return;
                                                }
                                                const servicesData = [
                                                    { id: 'bride-day', price: 850 },
                                                    { id: 'bride-trial', price: 350 },
                                                    { id: 'bride-pre-wedding', price: 450 },
                                                    { id: 'hair-only', price: 400 },
                                                    { id: 'makeup-only', price: 450 },
                                                    { id: 'attendant-combo', price: 280 },
                                                    { id: 'attendant-makeup', price: 160 },
                                                    { id: 'attendant-hair', price: 140 },
                                                    { id: 'mother-combo', price: 350 },
                                                ];
                                                const totalValue = servicesData
                                                    .filter(s => newBride.selectedServices.includes(s.id))
                                                    .reduce((sum, s) => sum + s.price, 0);

                                                createBrideMutation.mutate({
                                                    clientId: `client-${Date.now()}`,
                                                    clientName: newBride.name,
                                                    clientPhone: newBride.phone,
                                                    orgId: org?.id || 'default',
                                                    weddingDate: new Date(newBride.weddingDate),
                                                });
                                                setNewBride({ name: '', phone: '', email: '', weddingDate: '', selectedServices: [] });
                                                setShowAddBride(false);
                                            }}
                                            className="flex-1 btn-glass-glow"
                                        >
                                            <Plus size={18} />
                                            Adicionar
                                        </button>
                                        <button
                                            onClick={() => setShowAddBride(false)}
                                            className="flex-1 py-3 rounded-neo shadow-neo-out text-neo-text-secondary font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BrideCommandCenter;
