/**
 * FINANCIAL PERFORMANCE DASHBOARD
 * Revenue, expenses, profit tracking with charts
 * Style: Golden Neomorphic Light Theme
 */
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    Crown,
    Star,
    ChevronRight,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { NeoCard, NeoButton, Badge, Progress, Typography } from '../../../shared/components/ui/NeoComponents';

// Brand Colors - Rose Pink
const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = ROSE_LIGHT; // Legacy alias

// ... types ... (RevenueData, TopClient, StaffEarnings)
interface RevenueData {
    date: string;
    revenue: number;
    expenses: number;
    appointments: number;
}

interface TopClient {
    id: string;
    name: string;
    totalSpent: number;
    visits: number;
    lastVisit: string;
    isBride?: boolean;
}

interface StaffEarnings {
    id: string;
    name: string;
    grossGenerated: number;
    commission: number;
    commissionRate: number;
}

// Mock Data
const MONTHLY_DATA: RevenueData[] = [
    { date: '01/12', revenue: 1200, expenses: 180, appointments: 4 },
    { date: '02/12', revenue: 890, expenses: 120, appointments: 3 },
    { date: '03/12', revenue: 1500, expenses: 200, appointments: 5 },
    { date: '04/12', revenue: 750, expenses: 100, appointments: 2 },
    { date: '05/12', revenue: 1800, expenses: 250, appointments: 6 },
    { date: '06/12', revenue: 2100, expenses: 300, appointments: 7 },
    { date: '07/12', revenue: 980, expenses: 140, appointments: 3 },
];

const TOP_CLIENTS: TopClient[] = [
    { id: '1', name: 'Jessica Silva Cordova', totalSpent: 2850, visits: 12, lastVisit: '20/12/2024', isBride: true },
    { id: '2', name: 'Ana Carolina Santos', totalSpent: 1920, visits: 8, lastVisit: '18/12/2024' },
    { id: '3', name: 'Maria Helena Duarte', totalSpent: 1680, visits: 7, lastVisit: '15/12/2024' },
    { id: '4', name: 'Beatriz Lima', totalSpent: 1450, visits: 6, lastVisit: '12/12/2024', isBride: true },
    { id: '5', name: 'Juliana Melo', totalSpent: 1200, visits: 5, lastVisit: '10/12/2024' },
];

const STAFF_EARNINGS: StaffEarnings[] = [
    { id: '1', name: 'Marcela', grossGenerated: 8500, commission: 4250, commissionRate: 0.50 },
    { id: '2', name: 'Vitória', grossGenerated: 5200, commission: 2340, commissionRate: 0.45 },
    { id: '3', name: 'Dani', grossGenerated: 3800, commission: 1520, commissionRate: 0.40 },
];

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{ data: RevenueData[] }> = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
        <div className="mt-4">
            <div className="flex items-end justify-between gap-1 h-32">
                {data.map((item, idx) => {
                    const height = (item.revenue / maxRevenue) * 100;
                    const isToday = idx === data.length - 1;

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className={cn(
                                    'w-full rounded-t-lg',
                                    isToday ? '' : 'bg-neo-accent/20'
                                )}
                                style={{ backgroundColor: isToday ? GOLD : undefined }}
                            />
                            <Typography variant="caption" className="text-[10px] text-neo-text-secondary">{item.date}</Typography>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-neo-accent/20" />
                    <span className="text-neo-text-secondary">Dias anteriores</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GOLD }} />
                    <span className="text-neo-text-secondary">Hoje</span>
                </div>
            </div>
        </div>
    );
};

// Summary Stats Cards
const SummaryCards: React.FC<{
    totalRevenue: number;
    totalExpenses: number;
    totalAppointments: number;
    profit: number;
}> = ({ totalRevenue, totalExpenses, totalAppointments, profit }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
        <NeoCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} style={{ color: GOLD }} />
                <Typography variant="caption" className="text-neo-text-secondary">Receita</Typography>
            </div>
            <Typography variant="h5" className="font-bold text-neo-text">{formatCurrency(totalRevenue)}</Typography>
            <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} className="text-green-500" />
                <span className="text-xs text-green-500">+12%</span>
            </div>
        </NeoCard>

        <NeoCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-neo-danger" />
                <Typography variant="caption" className="text-neo-text-secondary">Despesas</Typography>
            </div>
            <Typography variant="h5" className="font-bold text-neo-text">{formatCurrency(totalExpenses)}</Typography>
            <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight size={14} className="text-green-500" />
                <span className="text-xs text-green-500">-5%</span>
            </div>
        </NeoCard>

        <NeoCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-500" />
                <Typography variant="caption" className="text-neo-text-secondary">Lucro Líquido</Typography>
            </div>
            <Typography variant="h5" className="font-bold text-green-600">{formatCurrency(profit)}</Typography>
            <Typography variant="caption" className="text-neo-text-secondary mt-1">Após comissões</Typography>
        </NeoCard>

        <NeoCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-neo-info" />
                <Typography variant="caption" className="text-neo-text-secondary">Atendimentos</Typography>
            </div>
            <Typography variant="h5" className="font-bold text-neo-text">{totalAppointments}</Typography>
            <Typography variant="caption" className="text-neo-text-secondary mt-1">este mês</Typography>
        </NeoCard>
    </div>
);

// Top Clients Section
const TopClientsSection: React.FC<{ clients: TopClient[] }> = ({ clients }) => (
    <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="font-semibold text-lg text-neo-text flex items-center gap-2">
                <Star size={18} style={{ color: GOLD }} />
                Melhores Clientes
            </Typography>
            <NeoButton variant="ghost" size="sm" className="text-neo-accent font-medium">Ver todos</NeoButton>
        </div>

        <div className="space-y-3">
            {clients.slice(0, 5).map((client, idx) => (
                <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <NeoCard className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: idx === 0 ? GOLD : '#CBD5E1' }}
                                    >
                                        {idx + 1}
                                    </div>
                                    {client.isBride && (
                                        <Crown
                                            size={12}
                                            className="absolute -top-1 -right-1"
                                            style={{ color: GOLD }}
                                            fill={GOLD}
                                        />
                                    )}
                                </div>
                                <div>
                                    <Typography variant="body" className="font-medium text-neo-text">{client.name}</Typography>
                                    <Typography variant="caption" className="text-xs text-neo-text-secondary">
                                        {client.visits} visitas • Última: {client.lastVisit}
                                    </Typography>
                                </div>
                            </div>
                            <div className="text-right">
                                <Typography variant="body" className="font-bold" style={{ color: GOLD }}>
                                    {formatCurrency(client.totalSpent)}
                                </Typography>
                                <Typography variant="caption" className="text-xs text-neo-text-secondary">total gasto</Typography>
                            </div>
                        </div>
                    </NeoCard>
                </motion.div>
            ))}
        </div>
    </section>
);

// Staff Performance Section
const StaffPerformanceSection: React.FC<{ staff: StaffEarnings[] }> = ({ staff }) => {
    const totalGenerated = staff.reduce((sum, s) => sum + s.grossGenerated, 0);

    return (
        <section className="mb-6">
            <Typography variant="h3" className="font-semibold text-lg text-neo-text flex items-center gap-2 mb-4">
                <Users size={18} style={{ color: GOLD }} />
                Performance da Equipe
            </Typography>

            <div className="space-y-3">
                {staff.map((member, idx) => {
                    const percentage = (member.grossGenerated / totalGenerated) * 100;

                    return (
                        <NeoCard key={member.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-neo shadow-neo-in flex items-center justify-center">
                                        <span className="font-semibold text-neo-accent">{member.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <Typography variant="body" className="font-medium text-neo-text">{member.name}</Typography>
                                        <Typography variant="caption" className="text-xs text-neo-text-secondary">
                                            {(member.commissionRate * 100).toFixed(0)}% comissão
                                        </Typography>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Typography variant="body" className="font-bold text-neo-text">{formatCurrency(member.grossGenerated)}</Typography>
                                    <Typography variant="caption" className="text-xs" style={{ color: GOLD }}>
                                        Comissão: {formatCurrency(member.commission)}
                                    </Typography>
                                </div>
                            </div>

                            <div className="relative h-2 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: idx * 0.2, duration: 0.5 }}
                                    className="absolute top-0 left-0 h-full rounded-full"
                                    style={{ backgroundColor: GOLD }}
                                />
                            </div>
                            <Typography variant="caption" className="text-xs text-neo-text-secondary text-right mt-1">
                                {percentage.toFixed(1)}% do faturamento
                            </Typography>
                        </NeoCard>
                    );
                })}
            </div>
        </section>
    );
};

// Main Financial Dashboard
export const FinancialDashboard: React.FC = () => {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

    // Calculate totals
    const totals = useMemo(() => {
        const totalRevenue = MONTHLY_DATA.reduce((sum, d) => sum + d.revenue, 0);
        const totalExpenses = MONTHLY_DATA.reduce((sum, d) => sum + d.expenses, 0);
        const totalAppointments = MONTHLY_DATA.reduce((sum, d) => sum + d.appointments, 0);
        const totalCommissions = STAFF_EARNINGS.reduce((sum, s) => sum + s.commission, 0);
        const profit = totalRevenue - totalExpenses - totalCommissions;

        return { totalRevenue, totalExpenses, totalAppointments, totalCommissions, profit };
    }, []);

    return (
        <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4 pt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-12 h-12 rounded-neo shadow-neo-out flex items-center justify-center"
                            style={{ backgroundColor: GOLD_LIGHT }}
                        >
                            <BarChart3 size={24} style={{ color: GOLD }} />
                        </div>
                        <div>
                            <Typography variant="h2" className="text-xl font-bold text-neo-text">Performance</Typography>
                            <Typography variant="caption" className="text-sm text-neo-text-secondary">Resumo financeiro</Typography>
                        </div>
                    </div>

                    {/* Period Filter */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'week', label: 'Semana' },
                            { id: 'month', label: 'Mês' },
                            { id: 'year', label: 'Ano' },
                        ].map(p => (
                            <NeoButton
                                key={p.id}
                                variant={period === p.id ? 'neu' : 'neu'}
                                onClick={() => setPeriod(p.id as typeof period)}
                                className={cn(
                                    'flex-1 py-2 text-sm font-medium transition-all',
                                    period === p.id
                                        ? 'shadow-neo-pressed text-brand-primary'
                                        : 'shadow-neo-out text-neo-text-secondary'
                                )}
                            >
                                {p.label}
                            </NeoButton>
                        ))}
                    </div>
                </header>

                {/* Content */}
                <main className="px-4">
                    {/* Summary Cards */}
                    <SummaryCards
                        totalRevenue={totals.totalRevenue}
                        totalExpenses={totals.totalExpenses}
                        totalAppointments={totals.totalAppointments}
                        profit={totals.profit}
                    />

                    {/* Revenue Chart */}
                    <NeoCard className="p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="h3" className="font-semibold text-lg text-neo-text">Receita por Dia</Typography>
                            <Badge variant="success">
                                +{((totals.totalRevenue / 10000) * 100).toFixed(0)}%
                            </Badge>
                        </div>
                        <SimpleBarChart data={MONTHLY_DATA} />
                    </NeoCard>

                    {/* Top Clients */}
                    <TopClientsSection clients={TOP_CLIENTS} />

                    {/* Staff Performance */}
                    <StaffPerformanceSection staff={STAFF_EARNINGS} />

                    {/* Profit Summary */}
                    <NeoCard className="p-4 mb-6">
                        <Typography variant="h3" className="font-semibold text-lg text-neo-text mb-4 flex items-center gap-2">
                            <DollarSign size={18} style={{ color: GOLD }} />
                            Resumo de Lucro
                        </Typography>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Typography variant="body" className="text-neo-text-secondary">Receita Total</Typography>
                                <Typography variant="body" className="font-medium text-neo-text">{formatCurrency(totals.totalRevenue)}</Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography variant="body" className="text-neo-text-secondary">(-) Despesas</Typography>
                                <Typography variant="body" className="font-medium text-neo-danger">-{formatCurrency(totals.totalExpenses)}</Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography variant="body" className="text-neo-text-secondary">(-) Comissões Equipe</Typography>
                                <Typography variant="body" className="font-medium text-neo-warning">-{formatCurrency(totals.totalCommissions)}</Typography>
                            </div>
                            <div className="h-px bg-neo-text-secondary/20" />
                            <div className="flex justify-between">
                                <Typography variant="body" className="font-semibold text-neo-text">Lucro Líquido</Typography>
                                <Typography variant="h5" className="font-bold text-green-600">{formatCurrency(totals.profit)}</Typography>
                            </div>
                        </div>
                    </NeoCard>
                </main>
            </div>
        </div>
    );
};

export default FinancialDashboard;
