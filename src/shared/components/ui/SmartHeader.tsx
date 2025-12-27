/**
 * SMART TOP NAVIGATION BAR
 * Header with functional icons for admin panel
 * Style: Light Neomorphism with Purple Accents
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    Globe,
    Megaphone,
    FileText,
    Cake,
    Search,
    Calendar,
    X,
    Users,
    DollarSign,
    MessageSquare,
    Send
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Brand Colors - Rose Pink
const PURPLE = '#8A2BE2';
const ROSE = '#E8A0B8';
const GOLD = ROSE; // Legacy alias

interface NavIconProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

// Individual Nav Icon with Neomorphic styling
const NavIcon: React.FC<NavIconProps> = ({ icon, label, isActive, onClick }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={cn(
                'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150',
                isPressed || isActive
                    ? 'shadow-neo-pressed bg-neo-bg'
                    : 'shadow-neo-out bg-neo-bg hover:shadow-neo-out-lg'
            )}
            style={{ color: isActive ? PURPLE : '#6B7280' }}
            title={label}
        >
            {icon}

            {/* Active indicator dot */}
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: GOLD }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}
        </button>
    );
};

// Search Overlay Component
const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-neo-bg p-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar clientes, agendamentos..."
                            className="w-full pl-10 pr-4 py-3 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-neo shadow-neo-out flex items-center justify-center"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Quick Results */}
                {searchTerm && (
                    <div className="mt-4 max-w-lg mx-auto space-y-2">
                        <p className="text-xs text-neo-text-secondary px-2">Resultados para "{searchTerm}"</p>
                        <div className="bg-neo-bg rounded-neo shadow-neo-in p-3">
                            <div className="flex items-center gap-3">
                                <Users size={16} className="text-neo-accent" />
                                <span className="text-neo-text">Buscar em Clientes</span>
                            </div>
                        </div>
                        <div className="bg-neo-bg rounded-neo shadow-neo-in p-3">
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-neo-info" />
                                <span className="text-neo-text">Buscar em Agendamentos</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

// Birthday Panel Component
const BirthdayPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const mockBirthdays = [
        { name: 'Maria Silva', date: '23/12', phone: '11999999999' },
        { name: 'Ana Santos', date: '25/12', phone: '11988888888' },
        { name: 'Juliana Pereira', date: '28/12', phone: '11977777777' },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Cake size={20} style={{ color: PURPLE }} />
                        <h2 className="font-semibold text-neo-text">Aniversariantes do Mês</h2>
                    </div>
                    <button onClick={onClose}>
                        <X size={20} className="text-neo-text-secondary" />
                    </button>
                </div>

                <div className="space-y-3">
                    {mockBirthdays.map((client, idx) => (
                        <div key={idx} className="bg-neo-bg rounded-neo shadow-neo-out p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-neo-text">{client.name}</p>
                                <p className="text-sm text-neo-text-secondary">🎂 {client.date}</p>
                            </div>
                            <button
                                onClick={() => {
                                    const msg = encodeURIComponent(`Feliz aniversário, ${client.name.split(' ')[0]}! 🎉🎂 Desejamos muitas felicidades!`);
                                    window.open(`https://wa.me/55${client.phone}?text=${msg}`, '_blank');
                                }}
                                className="px-3 py-2 rounded-neo shadow-neo-out text-green-500 text-sm font-medium"
                            >
                                Parabenizar
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Marketing Panel Component
const MarketingPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const quickMessages = [
        { title: 'Lembrete de Agendamento', icon: <Calendar size={16} /> },
        { title: 'Promoção do Mês', icon: <DollarSign size={16} /> },
        { title: 'Feliz Aniversário', icon: <Cake size={16} /> },
        { title: 'Confirmação de Horário', icon: <MessageSquare size={16} /> },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Megaphone size={20} style={{ color: PURPLE }} />
                        <h2 className="font-semibold text-neo-text">Mensagens Rápidas</h2>
                    </div>
                    <button onClick={onClose}>
                        <X size={20} className="text-neo-text-secondary" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {quickMessages.map((msg, idx) => (
                        <button
                            key={idx}
                            className="bg-neo-bg rounded-neo shadow-neo-out p-4 text-left active:shadow-neo-pressed transition-all"
                        >
                            <div className="mb-2" style={{ color: PURPLE }}>{msg.icon}</div>
                            <p className="text-sm font-medium text-neo-text">{msg.title}</p>
                        </button>
                    ))}
                </div>

                <button
                    className="mt-4 w-full btn-glass-glow"
                >
                    <Send size={18} />
                    Enviar para Todos
                </button>
            </motion.div>
        </motion.div>
    );
};

// Main Smart Header Component
interface SmartHeaderProps {
    onMenuClick: () => void;
}

export const SmartHeader: React.FC<SmartHeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showSearch, setShowSearch] = useState(false);
    const [showBirthdays, setShowBirthdays] = useState(false);
    const [showMarketing, setShowMarketing] = useState(false);

    // Determine active section based on current path
    const getActiveSection = () => {
        if (location.pathname === '/admin/calendar') return 'calendar';
        if (location.pathname === '/admin') return 'dashboard';
        return null;
    };

    const navItems = [
        {
            id: 'menu',
            icon: <Menu size={20} />,
            label: 'Menu',
            onClick: onMenuClick,
        },
        {
            id: 'globe',
            icon: <Globe size={20} />,
            label: 'Link de Agendamento Online',
            onClick: () => navigate('/admin/online-booking'),
        },
        {
            id: 'megaphone',
            icon: <Megaphone size={20} />,
            label: 'Marketing',
            onClick: () => setShowMarketing(true),
        },
        {
            id: 'document',
            icon: <FileText size={20} />,
            label: 'Comandas e Relatórios',
            onClick: () => navigate('/admin/reports'),
        },
        {
            id: 'cake',
            icon: <Cake size={20} />,
            label: 'Aniversariantes',
            onClick: () => setShowBirthdays(true),
        },
        {
            id: 'search',
            icon: <Search size={20} />,
            label: 'Buscar',
            onClick: () => setShowSearch(true),
        },
        {
            id: 'calendar',
            icon: <Calendar size={20} />,
            label: 'Agenda',
            onClick: () => navigate('/admin'),
            isActive: getActiveSection() === 'dashboard',
        },
    ];

    return (
        <>
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-neo-bg/95 backdrop-blur-lg border-b border-white/10">
                <div className="flex items-center justify-between px-2 py-2 max-w-[480px] mx-auto">
                    {navItems.map((item) => (
                        <NavIcon
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={item.isActive}
                            onClick={item.onClick}
                        />
                    ))}
                </div>
            </header>

            {/* Overlays */}
            <AnimatePresence>
                {showSearch && (
                    <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
                )}
                {showBirthdays && (
                    <BirthdayPanel isOpen={showBirthdays} onClose={() => setShowBirthdays(false)} />
                )}
                {showMarketing && (
                    <MarketingPanel isOpen={showMarketing} onClose={() => setShowMarketing(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default SmartHeader;
