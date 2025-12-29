/**
 * COMMISSION CONTROL DASHBOARD
 * Professional commission management system
 * Style: Light Neomorphism with Gold highlights
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    ChevronRight,
    ChevronDown,
    Filter,
    Check,
    TrendingUp,
    Scissors,
    Palette,
    Crown
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { NeoCard, NeoButton, Badge, Progress, Typography } from '../../../shared/components/ui/NeoComponents';

// Brand Colors - Rose Pink
const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

// Types
export interface Professional {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    commissionRate: number; // 0.4 = 40%
    status: 'active' | 'inactive';
}

export interface CompletedService {
    id: string;
    professionalId: string;
    clientName: string;
    serviceName: string;
    date: Date;
    grossValue: number;
    materialCost: number;
    depositPaid: number;
    depositToSalon: boolean; // true = deposit goes to salon
    isPaid: boolean;
}

export interface CommissionSummary {
    totalAppointments: number;
    totalGross: number;
    totalDeductions: number;
    netPayout: number;
    paid: number;
    pending: number;
}

// Mock Data
const MOCK_PROFESSIONALS: Professional[] = [
    { id: '1', name: 'Vitória', role: 'Maquiadora', commissionRate: 0.50, status: 'active' },
    { id: '2', name: 'Dani', role: 'Cabelereira', commissionRate: 0.45, status: 'active' },
    { id: '3', name: 'Amanda', role: 'Maquiadora/Cabelereira', commissionRate: 0.40, status: 'active' },
];

const MOCK_SERVICES: CompletedService[] = [
    { id: '1', professionalId: '1', clientName: 'Ana Duarte', serviceName: 'Maquiagem Social', date: new Date('2024-12-20'), grossValue: 160, materialCost: 15, depositPaid: 40, depositToSalon: true, isPaid: false },
    { id: '2', professionalId: '1', clientName: 'Maria Silva', serviceName: 'Maquiagem Noiva', date: new Date('2024-12-21'), grossValue: 350, materialCost: 30, depositPaid: 100, depositToSalon: false, isPaid: false },
    { id: '3', professionalId: '2', clientName: 'Julia Santos', serviceName: 'Penteado Coque', date: new Date('2024-12-20'), grossValue: 140, materialCost: 10, depositPaid: 0, depositToSalon: true, isPaid: true },
    { id: '4', professionalId: '2', clientName: 'Carolina Melo', serviceName: 'Penteado Semi-preso', date: new Date('2024-12-22'), grossValue: 110, materialCost: 8, depositPaid: 30, depositToSalon: true, isPaid: false },
    { id: '5', professionalId: '3', clientName: 'Beatriz Lima', serviceName: 'Combo Completo', date: new Date('2024-12-22'), grossValue: 280, materialCost: 25, depositPaid: 80, depositToSalon: true, isPaid: false },
];

// Utility Functions
export const calculateCommission = (
    grossValue: number,
    materialCost: number,
    commissionRate: number,
    depositPaid: number,
    depositToSalon: boolean
): { netBase: number; commission: number; professionalGets: number } => {
    const netBase = grossValue - materialCost;
    const commission = netBase * commissionRate;

    // If deposit goes directly to professional, they keep it
    const depositAdjustment = depositToSalon ? 0 : depositPaid;

    return {
        netBase,
        commission,
        professionalGets: commission + depositAdjustment,
    };
};

export const calculateProfessionalSummary = (
    professional: Professional,
    services: CompletedService[]
): CommissionSummary => {
    const proServices = services.filter(s => s.professionalId === professional.id);

    let totalGross = 0;
    let totalDeductions = 0;
    let netPayout = 0;
    let paid = 0;
    let pending = 0;

    proServices.forEach(service => {
        const { commission, professionalGets } = calculateCommission(
            service.grossValue,
            service.materialCost,
            professional.commissionRate,
            service.depositPaid,
            service.depositToSalon
        );

        totalGross += service.grossValue;
        totalDeductions += service.materialCost;
        netPayout += professionalGets;

        if (service.isPaid) {
            paid += professionalGets;
        } else {
            pending += professionalGets;
        }
    });

    return {
        totalAppointments: proServices.length,
        totalGross,
        totalDeductions,
        netPayout,
        paid,
        pending,
    };
};

// Date Filter Options
type DateFilter = 'week' | 'fortnight' | 'month';

// Components
const ProfessionalCard: React.FC<{
    professional: Professional;
    summary: CommissionSummary;
    isExpanded: boolean;
    onToggle: () => void;
    services: CompletedService[];
    onMarkPaid: (serviceId: string) => void;
}> = ({ professional, summary, isExpanded, onToggle, services, onMarkPaid }) => {
    const proServices = services.filter(s => s.professionalId === professional.id);
    const paidPercent = summary.netPayout > 0 ? (summary.paid / summary.netPayout) * 100 : 0;

    return (
        <NeoCard className="overflow-hidden">
            {/* Header */}
            <NeoButton
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between hover:bg-neo-bg-secondary transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center">
                        {professional.role.includes('Maquiadora') ? (
                            <Palette size={20} className="text-neo-accent" />
                        ) : (
                            <Scissors size={20} className="text-neo-info" />
                        )}
                    </div>
                    <div className="text-left">
                        <Typography variant="h6">{professional.name}</Typography>
                        <Typography variant="caption">{professional.role}</Typography>
                        <Badge variant="neutral" className="mt-1 text-[10px]">
                            {(professional.commissionRate * 100).toFixed(0)}% comissão
                        </Badge>
                    </div>
                </div>

                <div className="text-right">
                    <Typography variant="h4" style={{ color: GOLD }}>
                        {formatCurrency(summary.pending)}
                    </Typography>
                    <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">a pagar</Typography>
                    <ChevronDown
                        size={16}
                        className={cn(
                            'mt-1 text-neo-text-secondary transition-transform mx-auto',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </div>
            </NeoButton>

            {/* Summary Stats */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2 text-center p-3 bg-neo-bg rounded-neo shadow-neo-in">
                    <div>
                        <Typography variant="h4">{summary.totalAppointments}</Typography>
                        <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Atendimentos</Typography>
                    </div>
                    <div>
                        <Typography variant="h4">{formatCurrency(summary.totalGross)}</Typography>
                        <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Faturado</Typography>
                    </div>
                    <div>
                        <Typography variant="h4" className="text-green-600">{formatCurrency(summary.paid)}</Typography>
                        <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Pago</Typography>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                        <Typography variant="caption" className="text-neo-text-secondary">Pagamento</Typography>
                        <Typography variant="label">{paidPercent.toFixed(0)}%</Typography>
                    </div>
                    <Progress value={paidPercent} />
                </div>
            </div>

            {/* Expanded Detail */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-neo-text-secondary/10">
                            <Typography variant="h6" className="py-3">
                                Serviços Realizados
                            </Typography>

                            <div className="space-y-2">
                                {proServices.map(service => {
                                    const { commission, professionalGets } = calculateCommission(
                                        service.grossValue,
                                        service.materialCost,
                                        professional.commissionRate,
                                        service.depositPaid,
                                        service.depositToSalon
                                    );

                                    return (
                                        <div
                                            key={service.id}
                                            className={cn(
                                                'p-3 rounded-neo flex items-center justify-between',
                                                service.isPaid ? 'bg-green-50' : 'shadow-neo-out'
                                            )}
                                        >
                                            <div>
                                                <Typography variant="body" className="font-medium">{service.clientName}</Typography>
                                                <Typography variant="caption">{service.serviceName}</Typography>
                                                <Typography variant="label" className="text-[10px] text-neo-text-secondary">
                                                    {service.date.toLocaleDateString('pt-BR')} •
                                                    Bruto: {formatCurrency(service.grossValue)} -
                                                    Mat: {formatCurrency(service.materialCost)}
                                                </Typography>
                                            </div>
                                            <div className="text-right">
                                                <Typography variant="body" className="font-semibold" style={{ color: GOLD }}>
                                                    {formatCurrency(professionalGets)}
                                                </Typography>
                                                {service.isPaid ? (
                                                    <Badge variant="success" className="text-[10px]">
                                                        <Check size={10} /> Pago
                                                    </Badge>
                                                ) : (
                                                    <NeoButton
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onMarkPaid(service.id)}
                                                        className="text-[10px] text-neo-accent h-auto p-0 hover:bg-transparent"
                                                    >
                                                        Marcar Pago
                                                    </NeoButton>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pay All NeoButton */}
                            {summary.pending > 0 && (
                                <NeoButton
                                    variant="gradient"
                                    className="w-full mt-4"
                                    style={{ backgroundColor: GOLD }}
                                >
                                    <DollarSign size={18} />
                                    Pagar {formatCurrency(summary.pending)}
                                </NeoButton>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NeoCard>
    );
};

// Main Commission Dashboard Component
export const CommissionDashboard: React.FC = () => {
    const [professionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
    const [services, setServices] = useState<CompletedService[]>(MOCK_SERVICES);
    const [expandedPro, setExpandedPro] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');

    // Filter services by date
    const filteredServices = useMemo(() => {
        const now = new Date();
        const filterDays = dateFilter === 'week' ? 7 : dateFilter === 'fortnight' ? 14 : 30;
        const cutoffDate = new Date(now.getTime() - filterDays * 24 * 60 * 60 * 1000);

        return services.filter(s => s.date >= cutoffDate);
    }, [services, dateFilter]);

    // Calculate totals
    const totalStats = useMemo(() => {
        let totalGross = 0;
        let totalCommission = 0;
        let totalPaid = 0;
        let totalPending = 0;

        professionals.forEach(pro => {
            const summary = calculateProfessionalSummary(pro, filteredServices);
            totalGross += summary.totalGross;
            totalCommission += summary.netPayout;
            totalPaid += summary.paid;
            totalPending += summary.pending;
        });

        return { totalGross, totalCommission, totalPaid, totalPending };
    }, [professionals, filteredServices]);

    const handleMarkPaid = (serviceId: string) => {
        setServices(prev =>
            prev.map(s => s.id === serviceId ? { ...s, isPaid: true } : s)
        );
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-12 h-12 rounded-neo flex items-center justify-center"
                            style={{ backgroundColor: GOLD_LIGHT }}
                        >
                            <DollarSign size={24} style={{ color: GOLD }} />
                        </div>
                        <div>
                            <Typography variant="h2" className="text-display">Comissões</Typography>
                            <Typography variant="caption">Controle de pagamentos</Typography>
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'week', label: 'Semana' },
                            { id: 'fortnight', label: 'Quinzena' },
                            { id: 'month', label: 'Mês' },
                        ].map(filter => (
                            <NeoButton
                                key={filter.id}
                                variant={dateFilter === filter.id ? 'gradient' : 'neu'}
                                onClick={() => setDateFilter(filter.id as DateFilter)}
                                className="flex-1 py-2 text-sm"
                            >
                                {filter.label}
                            </NeoButton>
                        ))}
                    </div>

                    {/* Total Stats NeoCard */}
                    <NeoCard className="p-4 mb-6" style={{ backgroundColor: GOLD_LIGHT }}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={18} style={{ color: GOLD }} />
                            <Typography variant="body" className="font-semibold">Resumo do Período</Typography>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 rounded-neo p-3 text-center">
                                <Typography variant="h3">
                                    {formatCurrency(totalStats.totalGross)}
                                </Typography>
                                <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Faturamento Total</Typography>
                            </div>
                            <div className="bg-white/50 rounded-neo p-3 text-center">
                                <Typography variant="h3" style={{ color: GOLD }}>
                                    {formatCurrency(totalStats.totalPending)}
                                </Typography>
                                <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">A Pagar</Typography>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 text-sm">
                            <Typography variant="caption" className="text-green-600 flex items-center">
                                <Check size={14} className="mr-1" />
                                Pago: {formatCurrency(totalStats.totalPaid)}
                            </Typography>
                            <Typography variant="caption" className="text-neo-text-secondary">
                                Total Comissões: {formatCurrency(totalStats.totalCommission)}
                            </Typography>
                        </div>

                        {/* Team Goal Thermometer */}
                        <div className="mt-6 pt-6 border-t border-neo-text-secondary/10">
                            <div className="flex justify-between items-center mb-2">
                                <Typography variant="h6" className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-neo-accent" />
                                    META DA EQUIPE
                                </Typography>
                                <Typography variant="label" className="text-neo-accent">
                                    {Math.round((totalStats.totalGross / 25000) * 100)}%
                                </Typography>
                            </div>
                            <Progress
                                value={(totalStats.totalGross / 25000) * 100}
                                className="h-3 shadow-neo-in bg-white/30"
                            />
                            <div className="flex justify-between mt-1">
                                <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">R$ 0</Typography>
                                <Typography variant="caption" className="text-[10px] text-neo-text-secondary italic">Faltam {formatCurrency(Math.max(0, 25000 - totalStats.totalGross))} para o bônus!</Typography>
                                <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">R$ 25k</Typography>
                            </div>
                        </div>
                    </NeoCard>
                </header>

                {/* Professionals List */}
                <main className="px-4 space-y-4">
                    <Typography variant="h2" className="flex items-center gap-2">
                        <Users size={18} style={{ color: GOLD }} />
                        Profissionais
                    </Typography>

                    {professionals.map(pro => {
                        const summary = calculateProfessionalSummary(pro, filteredServices);
                        return (
                            <ProfessionalCard
                                key={pro.id}
                                professional={pro}
                                summary={summary}
                                isExpanded={expandedPro === pro.id}
                                onToggle={() => setExpandedPro(expandedPro === pro.id ? null : pro.id)}
                                services={filteredServices}
                                onMarkPaid={handleMarkPaid}
                            />
                        );
                    })}
                </main>
            </div>
        </div>
    );
};

export default CommissionDashboard;

