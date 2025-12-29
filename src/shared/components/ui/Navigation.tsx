/**
 * BEAUTY SALON NEOMORPHIC APP - Navigation Components
 * Updated: Premium Glassmorphism Tab Bar with Expanding Labels
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, Calendar, Image, User, Settings } from 'lucide-react';

// Feminine Rose Accent Color
const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';

// Client Bottom Navigation - Premium Glassmorphism Pill Style
interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/booking', icon: Calendar, label: 'Agendar' },
    { path: '/portfolio', icon: Image, label: 'Portfolio' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
        'px-2 py-2',
        'rounded-full',
        // Glassmorphism effect
        'bg-slate-800/90 backdrop-blur-xl',
        'border border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative"
          >
            {({ isActive }) => (
              <motion.div
                layout
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full',
                  'transition-all duration-300',
                  isActive
                    ? 'bg-slate-700/80 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

// Admin Sidebar Navigation
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate,
}) => {
  const menuItems = [
    { id: '/admin', icon: 'home', label: 'Dashboard' },
    { id: '/admin/calendar', icon: 'calendar', label: 'Calendário' },
    { id: '/admin/clients', icon: 'users', label: 'Clientes' },
    { id: '/admin/services', icon: 'settings', label: 'Serviços' },
    { id: '/admin/portfolio', icon: 'image', label: 'Portfolio' },
    { id: '/admin/analytics', icon: 'chart', label: 'Relatórios' },
    { id: '/settings', icon: 'cog', label: 'Configurações' },
  ];

  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    image: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    cog: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-neo-bg shadow-neo-out-lg z-50 lg:translate-x-0 lg:shadow-none lg:static"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-neo flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${ROSE} 0%, ${ROSE_LIGHT} 100%)` }}
            >
              <SparklesIcon />
            </div>
            <div>
              <h2 className="font-display font-semibold text-neo-text">Beauty Studio</h2>
              <p className="text-xs text-neo-text-secondary">Admin Panel</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-neo',
                  'transition-all duration-200',
                  currentPath === item.id
                    ? 'shadow-neo-pressed'
                    : 'shadow-neo-out text-neo-text-secondary hover:text-neo-text'
                )}
                style={{ color: currentPath === item.id ? ROSE : undefined }}
              >
                <span className={cn(currentPath === item.id && 'transform scale-110')}>
                  {icons[item.icon]}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-neo-text-secondary/10">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-neo shadow-neo-out text-neo-danger active:shadow-neo-pressed transition-all"
            >
              <LogoutIcon />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Icons
const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19.5 15l-1.5 4.5L15 21l1.5-4.5L21 15l-4.5-1.5L19.5 15z" />
    <path d="M3.5 15l1.5-4.5L1 9l4.5 1.5L3.5 15z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default BottomNav;
