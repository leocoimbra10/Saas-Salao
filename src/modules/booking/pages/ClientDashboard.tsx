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
import { Card, Button, Progress, Badge } from '../../../shared/components/ui/NeoComponents';
import { cn } from '../../../shared/lib/utils';
import { useAuth } from '../../auth/context/AuthContext';
import { signOutUser, getUserProfile } from '../../auth/services/authService';
import { UserProfile } from '../../../shared/types/types';

const ROSE = '#E8A0B8';
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

    // Mock data for loyalty
    const loyaltyData = {
        points: 850,
        nextRewardAt: 1000,
        tier: 'Gold',
        visits: 8,
        referralCode: 'BEAUTY-MARCELA-850'
    };

    const progress = (loyaltyData.points / loyaltyData.nextRewardAt) * 100;

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
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="absolute top-6 right-6 p-2 rounded-full bg-neo-bg shadow-neo-out hover:shadow-neo-pressed active:shadow-neo-pressed transition-all text-neo-text-secondary hover:text-neo-danger"
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 bg-neo-accent rounded-full shadow-neo-out-lg flex items-center justify-center mx-auto mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-neo-accent/20 blur-2xl rounded-full scale-150 -z-10 animate-pulse" />
                        <Crown size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-display font-bold text-neo-text mb-1">Olá, {displayName}!</h1>
                    <p className="text-caption italic mb-8">Sua beleza em evidência</p>
                </header>

                <main className="px-6 space-y-8">
                    {/* Loyalty Card - Gamified */}
                    <section>
                        <Card className="p-6 relative overflow-hidden border-2 border-neo-accent/10">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-neo-accent/10 blur-3xl rounded-full" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div>
                                        <Badge variant="info" className="bg-neo-accent/20 text-neo-accent border-neo-accent/20 mb-2 font-bold">
                                            NÍVEL {loyaltyData.tier.toUpperCase()}
                                        </Badge>
                                        <h3 className="text-xl font-display font-bold text-neo-text">Seus Pontos</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-neo-accent">{loyaltyData.points}</p>
                                    <p className="text-[10px] text-neo-text-secondary uppercase tracking-widest">Beauty Points</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-neo-text-secondary">
                                    <span>Progresso para 50% OFF</span>
                                    <span>{loyaltyData.points} / {loyaltyData.nextRewardAt}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-[10px] text-center text-neo-text-secondary italic">
                                    Faltam apenas {loyaltyData.nextRewardAt - loyaltyData.points} pontos para sua próxima recompensa!
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-neo-text-secondary/10 flex justify-around">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-neo-text">{loyaltyData.visits}</p>
                                    <p className="text-[10px] text-neo-text-secondary uppercase">Visitas</p>
                                </div>
                                <div className="w-[1px] bg-neo-text-secondary/10" />
                                <div className="text-center">
                                    <p className="text-lg font-bold text-neo-text">2</p>
                                    <p className="text-[10px] text-neo-text-secondary uppercase">Mimos Ganhos</p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Quick Actions */}
                    <section className="grid grid-cols-2 gap-4">
                        <Button
                            variant="secondary"
                            className="h-auto py-6 flex flex-col gap-3 shadow-neo-out border-2 border-white/40"
                            onClick={() => window.location.href = '/booking'}
                        >
                            <Calendar size={24} className="text-neo-info" />
                            <span className="font-semibold text-sm">Novo Agendamento</span>
                        </Button>
                        <Button
                            variant="secondary"
                            className="h-auto py-6 flex flex-col gap-3 shadow-neo-out border-2 border-white/40"
                            onClick={() => window.location.href = '/portfolio'}
                        >
                            <ImageIcon size={24} className="text-neo-accent" />
                            <span className="font-semibold text-sm">Ver Inspirações</span>
                        </Button>
                    </section>

                    {/* Referral Card */}
                    <section>
                        <Card className="p-5 bg-gradient-to-br from-neo-bg to-neo-accent/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/50 shadow-neo-out flex items-center justify-center text-neo-accent">
                                    <Share2 size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-neo-text">Indique e Ganhe</h4>
                                    <p className="text-xs text-neo-text-secondary">Ganhe 100 pontos por cada amiga que agendar!</p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <div className="flex-1 py-2 px-3 bg-neo-bg rounded-neo shadow-neo-in text-xs font-mono text-neo-text-secondary flex items-center justify-center">
                                    {loyaltyData.referralCode}
                                </div>
                                <Button size="sm" className="shadow-neo-out text-[10px]">
                                    Copiar
                                </Button>
                            </div>
                        </Card>
                    </section>

                    {/* Exclusive Bride Access */}
                    <section>
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="/noiva"
                            className="block relative overflow-hidden bg-neo-bg rounded-neo shadow-neo-out p-6 active:shadow-neo-pressed transition-all border border-[#D4AF37]/20 group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div
                                    className="w-14 h-14 rounded-neo shadow-neo-out flex items-center justify-center flex-shrink-0 border-2 border-white/50 group-hover:shadow-neo-out-lg transition-all"
                                    style={{ backgroundColor: '#FAF6E9' }}
                                >
                                    <Crown size={28} style={{ color: '#D4AF37' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-neo-text text-lg">Portal da Noiva</h3>
                                    <p className="text-xs text-neo-text-secondary">Seu planejamento exclusivo em um só lugar</p>
                                </div>
                                <ChevronRight size={20} style={{ color: '#D4AF37' }} />
                            </div>
                        </motion.a>
                    </section>
                </main>
            </div>
        </PageWrapper>
    );
};

export default ClientDashboard;
