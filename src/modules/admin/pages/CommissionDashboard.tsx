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
import { Card, Button, Badge, Progress } from '../../../shared/components/ui/NeoComponents';

// Brand Colors - Rose Pink
const ROSE = '#E8A0B8';
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
        <Card className="overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between"
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
                        <p className="font-semibold text-neo-text">{professional.name}</p>
                        <p className="text-xs text-neo-text-secondary">{professional.role}</p>
                        <Badge variant="neutral" className="mt-1 text-[10px]">
                            {(professional.commissionRate * 100).toFixed(0)}% comissão
                        </Badge>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: GOLD }}>
                        {formatCurrency(summary.pending)}
                    </p>
                    <p className="text-[10px] text-neo-text-secondary">a pagar</p>
                    <ChevronDown
                        size={16}
                        className={cn(
                            'mt-1 text-neo-text-secondary transition-transform mx-auto',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </div>
            </button>

            {/* Summary Stats */}
            <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2 text-center p-3 bg-neo-bg rounded-neo shadow-neo-in">
                    <div>
                        <p className="text-lg font-bold text-neo-text">{summary.totalAppointments}</p>
                        <p className="text-[10px] text-neo-text-secondary">Atendimentos</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-neo-text">{formatCurrency(summary.totalGross)}</p>
                        <p className="text-[10px] text-neo-text-secondary">Faturado</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(summary.paid)}</p>
                        <p className="text-[10px] text-neo-text-secondary">Pago</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-neo-text-secondary">Pagamento</span>
                        <span className="text-neo-text">{paidPercent.toFixed(0)}%</span>
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
                            <h4 className="text-sm font-semibold text-neo-text py-3">
                                Serviços Realizados
                            </h4>

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
                                                <p className="text-sm font-medium text-neo-text">{service.clientName}</p>
                                                <p className="text-xs text-neo-text-secondary">{service.serviceName}</p>
                                                <p className="text-[10px] text-neo-text-secondary">
                                                    {service.date.toLocaleDateString('pt-BR')} •
                                                    Bruto: {formatCurrency(service.grossValue)} -
                                                    Mat: {formatCurrency(service.materialCost)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold" style={{ color: GOLD }}>
                                                    {formatCurrency(professionalGets)}
                                                </p>
                                                {service.isPaid ? (
                                                    <Badge variant="success" className="text-[10px]">
                                                        <Check size={10} /> Pago
                                                    </Badge>
                                                ) : (
                                                    <button
                                                        onClick={() => onMarkPaid(service.id)}
                                                        className="text-[10px] text-neo-accent font-medium"
                                                    >
                                                        Marcar Pago
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pay All Button */}
                            {summary.pending > 0 && (
                                <Button
                                    variant="primary"
                                    className="w-full mt-4"
                                    style={{ backgroundColor: GOLD }}
                                >
                                    <DollarSign size={18} />
                                    Pagar {formatCurrency(summary.pending)}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
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
                            <h1 className="text-display">Comissões</h1>
                            <p className="text-caption">Controle de pagamentos</p>
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'week', label: 'Semana' },
                            { id: 'fortnight', label: 'Quinzena' },
                            { id: 'month', label: 'Mês' },
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setDateFilter(filter.id as DateFilter)}
                                className={cn(
                                    'flex-1 py-2 rounded-neo text-sm font-medium transition-all',
                                    dateFilter === filter.id
                                        ? 'shadow-neo-pressed text-neo-accent'
                                        : 'shadow-neo-out text-neo-text-secondary'
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Total Stats Card */}
                    <Card className="p-4 mb-6" style={{ backgroundColor: GOLD_LIGHT }}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={18} style={{ color: GOLD }} />
                            <span className="font-semibold text-neo-text">Resumo do Período</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 rounded-neo p-3 text-center">
                                <p className="text-2xl font-bold text-neo-text">
                                    {formatCurrency(totalStats.totalGross)}
                                </p>
                                <p className="text-[10px] text-neo-text-secondary">Faturamento Total</p>
                            </div>
                            <div className="bg-white/50 rounded-neo p-3 text-center">
                                <p className="text-2xl font-bold" style={{ color: GOLD }}>
                                    {formatCurrency(totalStats.totalPending)}
                                </p>
                                <p className="text-[10px] text-neo-text-secondary">A Pagar</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 text-sm">
                            <span className="text-green-600">
                                <Check size={14} className="inline mr-1" />
                                Pago: {formatCurrency(totalStats.totalPaid)}
                            </span>
                            <span className="text-neo-text-secondary">
                                Total Comissões: {formatCurrency(totalStats.totalCommission)}
                            </span>
                        </div>

                        {/* Team Goal Thermometer */}
                        <div className="mt-6 pt-6 border-t border-neo-text-secondary/10">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-neo-text flex items-center gap-2">
                                    <TrendingUp size={14} className="text-neo-accent" />
                                    META DA EQUIPE
                                </h4>
                                <span className="text-xs font-bold text-neo-accent">
                                    {Math.round((totalStats.totalGross / 25000) * 100)}%
                                </span>
                            </div>
                            <Progress
                                value={(totalStats.totalGross / 25000) * 100}
                                className="h-3 shadow-neo-in bg-white/30"
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-neo-text-secondary">R$ 0</span>
                                <p className="text-[10px] text-neo-text-secondary italic">Faltam {formatCurrency(Math.max(0, 25000 - totalStats.totalGross))} para o bônus!</p>
                                <span className="text-[10px] text-neo-text-secondary">R$ 25k</span>
                            </div>
                        </div>
                    </Card>
                </header>

                {/* Professionals List */}
                <main className="px-4 space-y-4">
                    <h2 className="text-subtitle flex items-center gap-2">
                        <Users size={18} style={{ color: GOLD }} />
                        Profissionais
                    </h2>

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
