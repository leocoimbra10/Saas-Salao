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
import { Badge, NeoButton, NeoInput, Typography, NeoCard, NeoSelect, Checkbox } from '../../../shared/components/ui/NeoComponents';
import BridalServicesManager from '../../admin/components/BridalServicesManager';

// Brand Colors - Rose Pink
const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBridalPackagesByOrg,
    createBridalPackage,
    // updateBridalPackage, 
    getBridalServices // New import
} from '../../bride/services/brideService';
import { useBranding } from '../../../shared/context/BrandingContext';
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
        <Badge variant={status === 'confirmed' ? 'success' : status === 'cancelled' ? 'danger' : status === 'lead' ? 'info' : 'warning'}>
            {label}
        </Badge>
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
                        <Typography variant="h4">{bride.clientName}</Typography>
                        <Typography variant="caption" className="text-neo-text-secondary">
                            {bride.weddingDate.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Typography>
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
                        <Typography variant="label" className="text-[10px] uppercase">Casamento</Typography>
                    </div>
                    <Typography variant="body" className="font-semibold">
                        {daysUntilWedding > 0 ? `${daysUntilWedding} dias` : 'Hoje!'}
                    </Typography>
                </div>

                {/* Package Value */}
                <div className="bg-neo-bg rounded-neo-sm shadow-neo-in p-2">
                    <div className="flex items-center gap-1 text-neo-text-secondary text-xs mb-1">
                        <DollarSign size={12} />
                        <Typography variant="label" className="text-[10px] uppercase">Pacote</Typography>
                    </div>
                    <Typography variant="body" className="font-semibold">
                        {formatCurrency(bride.packageValue)}
                    </Typography>
                </div>
            </div>

            {/* Trial Date */}
            {trialDate && (
                <div className="flex items-center gap-2 text-xs text-neo-text-secondary mb-3">
                    <Clock size={12} />
                    <Typography variant="caption">
                        Prova: {trialDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </Typography>
                    {bride.timeline.find(t => t.type === 'trial')?.status === 'completed' && (
                        <CheckCircle size={12} className="text-green-500" />
                    )}
                </div>
            )}

            {/* Attendants */}
            {bride.attendants.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neo-text-secondary mb-3">
                    <Users size={12} />
                    <Typography variant="caption">{bride.attendants.length} pessoas + {formatCurrency(
                        bride.attendants.reduce((sum, a) => sum + a.totalPrice, 0)
                    )}</Typography>
                </div>
            )}

            {/* Payment Progress */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-neo-text-secondary mb-1">
                    <Typography variant="caption">Pagamento</Typography>
                    <Typography variant="label">{depositPercent.toFixed(0)}%</Typography>
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
                <NeoButton
                    variant="neu"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
                    className="flex-1 text-green-500 gap-1 h-auto py-2"
                    icon={<MessageCircle size={14} />}
                >
                    WhatsApp
                </NeoButton>
                <NeoButton
                    variant="neu"
                    size="sm"
                    onClick={onClick}
                    className="flex-1 text-neo-text-secondary gap-1 h-auto py-2"
                    icon={<ChevronRight size={14} />}
                >
                    Ver Detalhes
                </NeoButton>
            </div>
        </motion.div>
    );
};

// Stats Card Component
const StatsCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subvalue?: string }> = ({
    icon, label, value, subvalue
}) => (
    <NeoCard className="p-4">
        <div className="flex items-center gap-2 mb-2">
            <span style={{ color: GOLD }}>{icon}</span>
            <Typography variant="label" className="text-neo-text-secondary">{label}</Typography>
        </div>
        <Typography variant="h3">{value}</Typography>
        {subvalue && <Typography variant="caption">{subvalue}</Typography>}
    </NeoCard>
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
                            <Typography variant="body" className="font-medium">
                                {milestone.type === 'trial' ? 'Prova' : milestone.type === 'pre_wedding' ? 'Pré-Wedding' : 'Casamento'}
                            </Typography>
                            <Typography variant="caption">
                                {milestone.date ? milestone.date.toLocaleDateString('pt-BR') : 'Data a definir'}
                            </Typography>
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

    const { data: services = [] } = useQuery({
        queryKey: ['bridal_services', org?.id],
        queryFn: () => (org?.id ? getBridalServices(org.id) : Promise.resolve([])),
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
                            className="w-12 h-12 rounded-neo flex items-center justify-center p-2.5 shadow-neo-out"
                            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #E8C547 100%)` }}
                        >
                            <Crown size={24} className="text-white" />
                        </div>
                        <div>
                            <Typography variant="h1">Noivas</Typography>
                            <Typography variant="caption">Central de Comando</Typography>
                        </div>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 px-4">
                    <NeoButton
                        variant={activeTab === 'brides' ? 'gradient' : 'neu'}
                        onClick={() => setActiveTab('brides')}
                        className={cn(
                            'flex-1 py-3 px-4 h-auto',
                            activeTab === 'brides' ? 'shadow-neo-pressed' : ''
                        )}
                        icon={<Crown size={16} className={activeTab === 'brides' ? 'text-white' : 'text-neo-text-secondary'} />}
                    >
                        <Typography variant="label" className={activeTab === 'brides' ? 'text-white' : ''}>Noivas</Typography>
                    </NeoButton>
                    <NeoButton
                        variant={activeTab === 'services' ? 'gradient' : 'neu'}
                        onClick={() => setActiveTab('services')}
                        className={cn(
                            'flex-1 py-3 px-4 h-auto',
                            activeTab === 'services' ? 'shadow-neo-pressed' : ''
                        )}
                        icon={<Settings size={16} className={activeTab === 'services' ? 'text-white' : 'text-neo-text-secondary'} />}
                    >
                        <Typography variant="label" className={activeTab === 'services' ? 'text-white' : ''}>Serviços</Typography>
                    </NeoButton>
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
                            <NeoButton
                                variant="glass"
                                onClick={() => setShowAddBride(true)}
                                className="w-full py-6 rounded-2xl gap-3 shadow-neo-out-lg"
                                icon={<Plus size={20} className="text-brand-gold" />}
                            >
                                <Typography variant="h6" className="font-semibold">Cadastrar Noiva</Typography>
                            </NeoButton>
                        </div>

                        <div className="flex gap-2 mb-4 px-4">
                            <NeoInput
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar noiva..."
                                icon={<Search size={18} />}
                                className="flex-1"
                            />
                            <NeoButton
                                variant="neu"
                                className="w-12 h-12 p-0 flex items-center justify-center"
                                icon={<Filter size={18} className="text-neo-text-secondary" />}
                            />
                        </div>

                        <div className="px-4 mb-4">
                            <NeoSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BridalStatus | 'all')}
                                options={[
                                    { value: 'all', label: 'Todas as Noivas' },
                                    { value: 'lead', label: 'Leads' },
                                    { value: 'confirmed', label: 'Confirmadas' },
                                    { value: 'trial_done', label: 'Prova OK' },
                                    { value: 'completed', label: 'Concluídas' },
                                ]}
                                className="w-full"
                            />
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
                                                <Typography variant="h4">{selectedBride.clientName}</Typography>
                                                <Typography variant="caption">{selectedBride.clientPhone}</Typography>
                                            </div>
                                        </div>
                                        <StatusBadge status={selectedBride.status} />
                                    </div>

                                    {/* Wedding Info */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <Typography variant="h6" className="mb-2" style={{ color: GOLD }}>📅 Casamento</Typography>
                                        <Typography variant="body">
                                            {selectedBride.weddingDate.toLocaleDateString('pt-BR', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                        {selectedBride.weddingVenue && (
                                            <Typography variant="caption">{selectedBride.weddingVenue}</Typography>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <Typography variant="h6" className="mb-3" style={{ color: GOLD }}>📅 Cronograma</Typography>
                                        <TimelineSection packageId={selectedBride.id} />
                                    </div>

                                    {/* Financial Summary */}
                                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                        <Typography variant="h6" className="mb-3" style={{ color: GOLD }}>💰 Financeiro</Typography>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Typography variant="caption">Valor do Pacote</Typography>
                                                <Typography variant="body" className="font-semibold">{formatCurrency(selectedBride.packageValue)}</Typography>
                                            </div>
                                            <div className="flex justify-between">
                                                <Typography variant="caption">Sinal Pago</Typography>
                                                <Typography variant="body" className="font-semibold text-green-600">{formatCurrency(selectedBride.depositPaid)}</Typography>
                                            </div>
                                            <div className="flex justify-between">
                                                <Typography variant="caption">Saldo Pendente</Typography>
                                                <Typography variant="body" className="font-semibold" style={{ color: GOLD }}>{formatCurrency(selectedBride.balanceDue)}</Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendants */}
                                    {selectedBride.attendants.length > 0 && (
                                        <div className="bg-neo-bg rounded-neo shadow-neo-in p-4 mb-4">
                                            <Typography variant="h6" className="mb-3" style={{ color: GOLD }}>👥 Acompanhantes</Typography>
                                            <div className="space-y-2">
                                                {selectedBride.attendants.map(att => (
                                                    <div key={att.id} className="flex justify-between items-center">
                                                        <Typography variant="body">{att.name}</Typography>
                                                        <div className="text-right">
                                                            <Typography variant="body" className="font-medium">{formatCurrency(att.totalPrice)}</Typography>
                                                            {att.isPaid && <Typography variant="caption" className="text-green-500 ml-2">✓</Typography>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 mt-6">
                                        <div className="flex gap-3">
                                            <NeoButton
                                                variant="outline"
                                                onClick={() => handleWhatsApp(selectedBride)}
                                                className="flex-1 py-3 text-green-600 border-green-500 gap-2 h-auto"
                                                icon={<MessageCircle size={18} />}
                                            >
                                                Confirmar WhatsApp
                                            </NeoButton>
                                            <NeoButton
                                                variant="outline"
                                                onClick={() => {
                                                    notificationService.sendMilestoneAlert(
                                                        selectedBride.clientName,
                                                        selectedBride.clientPhone,
                                                        "Sua prova está chegando!"
                                                    );
                                                }}
                                                className="flex-1 py-3 border-neo-accent text-neo-accent gap-2 h-auto"
                                                icon={<Sparkles size={18} />}
                                            >
                                                Lembrete Mágico
                                            </NeoButton>
                                        </div>
                                        <NeoButton
                                            variant="neu"
                                            onClick={() => setSelectedBride(null)}
                                            className="w-full py-3 text-neo-text-secondary h-auto"
                                        >
                                            Fechar
                                        </NeoButton>
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
                                            <Typography variant="h4">Nova Noiva</Typography>
                                            <Typography variant="caption">Preencha os dados da nova cliente</Typography>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <Typography variant="label" className="mb-2 block">Nome Completo *</Typography>
                                            <NeoInput
                                                value={newBride.name}
                                                onChange={(e) => setNewBride({ ...newBride, name: e.target.value })}
                                                placeholder="Nome da noiva"
                                            />
                                        </div>
                                        {/* Phone */}
                                        <div>
                                            <Typography variant="label" className="mb-2 block">WhatsApp *</Typography>
                                            <NeoInput
                                                type="tel"
                                                value={newBride.phone}
                                                onChange={(e) => setNewBride({ ...newBride, phone: e.target.value })}
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                        {/* Email */}
                                        <div>
                                            <Typography variant="label" className="mb-2 block">E-mail</Typography>
                                            <NeoInput
                                                type="email"
                                                value={newBride.email}
                                                onChange={(e) => setNewBride({ ...newBride, email: e.target.value })}
                                                placeholder="email@exemplo.com"
                                            />
                                        </div>
                                        {/* Wedding Date */}
                                        <div>
                                            <Typography variant="label" className="mb-2 block">Data do Casamento *</Typography>
                                            <NeoInput
                                                type="date"
                                                value={newBride.weddingDate}
                                                onChange={(e) => setNewBride({ ...newBride, weddingDate: e.target.value })}
                                            />
                                        </div>

                                        {/* Services Selector */}
                                        <div>
                                            <Typography variant="label" className="mb-2 block" style={{ color: GOLD }}>
                                                Selecione os Serviços *
                                            </Typography>
                                            {services.length === 0 ? (
                                                <div className="p-4 rounded-neo shadow-neo-in text-center text-sm text-neo-text-secondary">
                                                    Nenhum serviço cadastrado. Vá em "Serviços" para adicionar.
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-neo shadow-neo-in">
                                                    {services.filter(s => s.isActive).map(service => (
                                                        <label
                                                            key={service.id}
                                                            className={`flex items-center justify-between p-3 rounded-neo cursor-pointer transition-all ${newBride.selectedServices.includes(service.id!)
                                                                ? 'shadow-neo-in bg-neo-bg'
                                                                : 'shadow-neo-out hover:shadow-neo-flat'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Checkbox
                                                                    checked={newBride.selectedServices.includes(service.id!)}
                                                                    onChange={(checked) => {
                                                                        if (checked) {
                                                                            setNewBride({
                                                                                ...newBride,
                                                                                selectedServices: [...newBride.selectedServices, service.id!]
                                                                            });
                                                                        } else {
                                                                            setNewBride({
                                                                                ...newBride,
                                                                                selectedServices: newBride.selectedServices.filter(s => s !== service.id)
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                <Typography variant="body">{service.name}</Typography>
                                                            </div>
                                                            <Typography variant="label" className="font-semibold text-neo-text-secondary">
                                                                {formatCurrency(service.price)}
                                                            </Typography>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Total Package Value */}
                                        {newBride.selectedServices.length > 0 && (
                                            <div className="p-4 rounded-neo shadow-neo-in bg-neo-bg">
                                                <div className="flex justify-between items-center">
                                                    <Typography variant="body" className="font-medium">Total do Pacote:</Typography>
                                                    <Typography variant="h4" style={{ color: GOLD }}>
                                                        {formatCurrency(
                                                            services
                                                                .filter(s => newBride.selectedServices.includes(s.id!))
                                                                .reduce((sum, s) => sum + s.price, 0)
                                                        )}
                                                    </Typography>
                                                </div>
                                                <Typography variant="caption" className="mt-1 block">
                                                    {newBride.selectedServices.length} serviço(s) selecionado(s)
                                                </Typography>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <NeoButton
                                            variant="gradient"
                                            onClick={() => {
                                                if (!newBride.name || !newBride.phone || !newBride.weddingDate || newBride.selectedServices.length === 0) {
                                                    alert('Preencha todos os campos obrigatórios e selecione ao menos um serviço');
                                                    return;
                                                }
                                                // Removed hardcoded servicesData, relies on 'services' query now

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
                                            className="flex-1 h-auto py-3"
                                            icon={<Plus size={18} />}
                                        >
                                            Adicionar
                                        </NeoButton>
                                        <NeoButton
                                            variant="neu"
                                            onClick={() => setShowAddBride(false)}
                                            className="flex-1 h-auto py-3 text-neo-text-secondary"
                                        >
                                            Cancelar
                                        </NeoButton>
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
