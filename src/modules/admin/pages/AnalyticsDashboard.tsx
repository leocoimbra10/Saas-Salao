import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight,
    Filter, Download, Share2, MoreHorizontal
} from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '../../../shared/components/ui/NeoComponents';
import { PageWrapper } from '../../../shared/components/ui/AppLayout';
import { formatCurrency } from '../../../shared/lib/utils';

// Mock Data
const revenueData = [
    { name: 'Jan', value: 12400 },
    { name: 'Fev', value: 15800 },
    { name: 'Mar', value: 13200 },
    { name: 'Abr', value: 18400 },
    { name: 'Mai', value: 22100 },
    { name: 'Jun', value: 25400 },
];

const categoryData = [
    { name: 'Cabelo', value: 40, color: '#E8A0B8' },
    { name: 'Maquiagem', value: 30, color: '#B8A0E8' },
    { name: 'Noivas', value: 20, color: '#A0E8D0' },
    { name: 'Outros', value: 10, color: '#E8D0A0' },
];

const stats = [
    { label: 'Receita Total', value: 'R$ 107.300', change: '+12.5%', trend: 'up', icon: <DollarSign size={20} /> },
    { label: 'Novos Clientes', value: '142', change: '+8.2%', trend: 'up', icon: <Users size={20} /> },
    { label: 'Agendamentos', value: '486', change: '-2.4%', trend: 'down', icon: <Calendar size={20} /> },
    { label: 'Ticket Médio', value: 'R$ 220', change: '+4.1%', trend: 'up', icon: <TrendingUp size={20} /> },
];

export const AnalyticsDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="p-6 space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-neo" />)}
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-neo" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="p-6 pb-24 space-y-6 bg-neo-bg min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-neo-text">Analytics</h1>
                        <p className="text-neo-text-secondary text-sm">Visão estratégica do seu negócio</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="flex items-center gap-2">
                            <Filter size={16} />
                            Filtros
                        </Button>
                        <Button variant="primary" size="sm" className="flex items-center gap-2">
                            <Download size={16} />
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-neo-bg shadow-neo-out rounded-full text-neo-accent">
                                    {stat.icon}
                                </div>
                                <Badge variant={stat.trend === 'up' ? 'success' : 'danger'} className="text-[10px]">
                                    {stat.change}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-[10px] text-neo-text-secondary uppercase tracking-widest">{stat.label}</h3>
                                <p className="text-xl font-bold text-neo-text">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Area Chart */}
                    <Card className="p-6 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-neo-text">Crescimento de Receita</h3>
                            <button className="text-neo-text-secondary"><MoreHorizontal size={20} /></button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E8A0B8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#E8A0B8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        tickFormatter={(value) => `R$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#FAF9F6', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#E8A0B8"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Category Distribution Pie Chart */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-neo-text">Distribuição por Categoria</h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                            {categoryData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-neo-text-secondary">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-neo-text">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Best Sellers (Mock Table) */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-neo-text">Serviços Mais Procurados</h3>
                        <Button variant="secondary" size="sm">Ver todos</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Mechas Premium', count: 48, trend: '+15%', rev: 'R$ 24.000' },
                            { name: 'Maquiagem Noiva', count: 32, trend: '+8%', rev: 'R$ 19.200' },
                            { name: 'Protocolo Hidratação', count: 24, trend: '-3%', rev: 'R$ 4.800' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-neo-bg rounded-neo shadow-neo-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-neo bg-neo-bg shadow-neo-out flex items-center justify-center text-neo-accent font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neo-text text-sm">{item.name}</p>
                                        <p className="text-[10px] text-neo-text-secondary">{item.count} agendamentos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neo-text text-sm">{item.rev}</p>
                                    <span className="text-[9px] text-green-500 font-bold">{item.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
};
