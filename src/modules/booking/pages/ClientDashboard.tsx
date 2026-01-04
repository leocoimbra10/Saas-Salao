import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    Gift,
    Share2,
    Calendar,
    Image as ImageIcon,
    User,
    Crown,
    ChevronRight,
    TrendingUp,
    LogOut
} from 'lucide-react';
import { PageWrapper } from '../../../shared/components/ui/AppLayout';
import { NeoCard, NeoButton, Progress, Badge, Typography } from '../../../shared/components/ui/NeoComponents';
import { cn } from '../../../shared/lib/utils';
import { useAuth } from '../../auth/context/AuthContext';
import { signOutUser, getUserProfile } from '../../auth/services/authService';
import { UserProfile } from '../../../shared/types/types';
import { useClientAppointments } from '../hooks/useAppointments';
import { ROUTES } from '../../../shared/lib/constants';

const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';

export const ClientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Load user profile with preferredName
    useEffect(() => {
        if (user?.uid) {
            getUserProfile(user.uid).then(setUserProfile);
        }
    }, [user]);

    // Fetch Client Appointments
    const { data: appointments = [], isLoading } = useClientAppointments(user?.uid);

    // Calculate Loyalty Stats
    const totalSpent = appointments
        .filter(app => app.status === 'completed' || app.status === 'confirmed')
        .reduce((sum, app) => sum + (Number(app.totalAmount) || 0), 0);

    // Simple fidelity: 1 point per 1 BRL
    const points = Math.floor(totalSpent);
    const nextRewardAt = 1000;
    const visits = appointments.filter(app => app.status === 'completed' || app.status === 'confirmed').length;

    const loyaltyData = {
        points: points,
        nextRewardAt: nextRewardAt,
        tier: points > 2000 ? 'Platinum' : points > 1000 ? 'Gold' : 'Silver',
        visits: visits,
        referralCode: userProfile?.displayName ? `BEAUTY-${userProfile.displayName.split(' ')[0].toUpperCase()}-${points}` : 'BEAUTY-VIP'
    };

    const progress = Math.min((loyaltyData.points / loyaltyData.nextRewardAt) * 100, 100);

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Use preferred name if available, fallback to display name or default
    const displayName = userProfile?.preferredName || userProfile?.displayName || user?.displayName || 'Maravilhosa';

    return (
        <PageWrapper>
            <div className="min-h-screen bg-neo-bg pb-24">
                {/* Header / Hero */}
                <header className="p-6 pt-12 text-center relative">
                    {/* Logout NeoButton */}
                    <NeoButton
                        variant="neu"
                        size="sm"
                        onClick={handleLogout}
                        className="absolute top-6 right-6 p-2 rounded-full text-neo-text-secondary hover:text-neo-danger shadow-neo-out"
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </NeoButton>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 bg-neo-accent rounded-full shadow-neo-out-lg flex items-center justify-center mx-auto mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-neo-accent/20 blur-2xl rounded-full scale-150 -z-10 animate-pulse" />
                        <Crown size={40} className="text-white" />
                    </motion.div>
                    <Typography variant="h1" className="mb-1">Olá, {displayName}!</Typography>
                    <Typography variant="caption" className="italic mb-8">Sua beleza em evidência</Typography>
                </header>

                <main className="px-6 space-y-8">
                    {/* Loyalty NeoCard - Gamified */}
                    <section>
                        <NeoCard className="p-6 relative overflow-hidden border-2 border-neo-accent/10">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-neo-accent/10 blur-3xl rounded-full" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div>
                                        <Badge variant="info" className="bg-neo-accent/20 text-neo-accent border-neo-accent/20 mb-2 font-bold">
                                            NÍVEL {loyaltyData.tier.toUpperCase()}
                                        </Badge>
                                        <Typography variant="h3">Seus Pontos</Typography>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Typography variant="h2" className="text-neo-accent">{loyaltyData.points}</Typography>
                                    <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase tracking-widest">Beauty Points</Typography>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-neo-text-secondary">
                                    <Typography variant="caption">Progresso para 50% OFF</Typography>
                                    <Typography variant="caption">{loyaltyData.points} / {loyaltyData.nextRewardAt}</Typography>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <Typography variant="caption" className="text-[10px] text-center italic mt-2 block">
                                    Faltam apenas {loyaltyData.nextRewardAt - loyaltyData.points} pontos para sua próxima recompensa!
                                </Typography>
                            </div>

                            <div className="mt-6 pt-6 border-t border-neo-text-secondary/10 flex justify-around">
                                <div className="text-center">
                                    <Typography variant="h4">{loyaltyData.visits}</Typography>
                                    <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Visitas</Typography>
                                </div>
                                <div className="w-[1px] bg-neo-text-secondary/10" />
                                <div className="text-center">
                                    <Typography variant="h4">2</Typography>
                                    <Typography variant="label" className="text-[10px] text-neo-text-secondary uppercase">Mimos Ganhos</Typography>
                                </div>
                            </div>
                        </NeoCard>
                    </section>

                    {/* Quick Actions */}
                    <section className="grid grid-cols-2 gap-4">
                        <NeoButton
                            variant="neu"
                            className="h-auto py-6 flex flex-col gap-3 shadow-neo-out border-2 border-white/40 hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => navigate(ROUTES.CLIENT_BOOKING)}
                        >
                            <Calendar size={24} className="text-neo-info" />
                            <Typography variant="label" className="text-sm">Novo Agendamento</Typography>
                        </NeoButton>
                        <NeoButton
                            variant="neu"
                            className="h-auto py-6 flex flex-col gap-3 shadow-neo-out border-2 border-white/40 hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => navigate('/portfolio')}
                        >
                            <ImageIcon size={24} className="text-neo-accent" />
                            <Typography variant="label" className="text-sm">Ver Inspirações</Typography>
                        </NeoButton>
                    </section>

                    {/* Referral NeoCard */}
                    <section>
                        <NeoCard className="p-5 bg-gradient-to-br from-neo-bg to-neo-accent/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/50 shadow-neo-out flex items-center justify-center text-neo-accent">
                                    <Share2 size={24} />
                                </div>
                                <div className="flex-1">
                                    <Typography variant="h6">Indique e Ganhe</Typography>
                                    <Typography variant="caption">Ganhe 100 pontos por cada amiga que agendar!</Typography>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <div className="flex-1 py-2 px-3 bg-neo-bg rounded-neo shadow-neo-in text-xs font-mono text-neo-text-secondary flex items-center justify-center">
                                    {loyaltyData.referralCode}
                                </div>
                                <NeoButton size="sm" className="shadow-neo-out text-[10px]">
                                    Copiar
                                </NeoButton>
                            </div>
                        </NeoCard>
                    </section>

                    {/* Exclusive Bride Access */}
                    <section>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/noiva')}
                            className="block relative overflow-hidden bg-neo-bg rounded-neo shadow-neo-out p-6 active:shadow-neo-pressed transition-all border border-[var(--color-brand-gold)]/20 group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-gold)]/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div
                                    className="w-14 h-14 rounded-neo shadow-neo-out flex items-center justify-center flex-shrink-0 border-2 border-white/50 group-hover:shadow-neo-out-lg transition-all"
                                    style={{ backgroundColor: '#FAF6E9' }}
                                >
                                    <Crown size={28} style={{ color: 'var(--color-brand-gold)' }} />
                                </div>
                                <div className="flex-1">
                                    <Typography variant="h4" className="text-lg">Portal da Noiva</Typography>
                                    <Typography variant="caption">Seu planejamento exclusivo em um só lugar</Typography>
                                </div>
                                <ChevronRight size={20} style={{ color: 'var(--color-brand-gold)' }} />
                            </div>
                        </motion.div>
                    </section>
                </main>
            </div>
        </PageWrapper>
    );
};

export default ClientDashboard;

