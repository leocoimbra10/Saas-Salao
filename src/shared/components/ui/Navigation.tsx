/**
 * BEAUTY SALON NEOMORPHIC APP - Navigation Components
 * Updated: Premium Glassmorphism Tab Bar with Expanding Labels
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, Calendar, Image, User, Settings, Users, BarChart3, Settings as SettingsIcon, LogOut, Sparkles, ChevronRight } from 'lucide-react';
import { Typography, NeoButton } from './NeoComponents';
import { ROUTES } from '../../lib/constants';

// Feminine Rose Accent Color
const ROSE = 'var(--color-brand-primary)';
const ROSE_LIGHT = '#F5CED8';

// Client Bottom Navigation - Premium Glassmorphism Pill Style
interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const navItems = [
    { path: ROUTES.CLIENT_DASHBOARD, icon: Home, label: 'Início' },
    { path: ROUTES.CLIENT_BOOKING, icon: Calendar, label: 'Agendar' },
    { path: '/portfolio', icon: Image, label: 'Portfolio' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50', // Fixed z-index and raised bottom slightly
        'px-2 py-2',
        'rounded-full',
        'cursor-pointer', // Ensure cursor pointer
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
            className="relative cursor-pointer" // Explicit cursor-pointer
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
    { id: ROUTES.ADMIN_DASHBOARD, icon: Home, label: 'Dashboard' },
    { id: '/admin/calendar', icon: Calendar, label: 'Calendário' },
    { id: '/admin/clients', icon: Users, label: 'Clientes' },
    { id: '/admin/services', icon: SettingsIcon, label: 'Serviços' },
    { id: '/admin/portfolio', icon: Image, label: 'Portfolio' },
    { id: '/admin/analytics', icon: BarChart3, label: 'Relatórios' },
    { id: '/admin/settings', icon: Settings, label: 'Configurações' }, // Fixed path
  ];

  // Icons map is no longer needed as we use the components directly

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
              className="w-12 h-12 rounded-neo flex items-center justify-center p-2.5"
              style={{ background: `linear-gradient(135deg, ${ROSE} 0%, ${ROSE_LIGHT} 100%)` }}
            >
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <Typography variant="h6">Beauty Studio</Typography>
              <Typography variant="caption">Admin Panel</Typography>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NeoButton
                key={item.id}
                variant={currentPath === item.id ? 'gradient' : 'neu'}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full justify-start gap-3 h-auto py-3 px-4',
                  currentPath === item.id ? 'shadow-neo-pressed' : ''
                )}
                icon={<item.icon size={20} className={cn(currentPath === item.id ? 'text-white' : 'text-neo-text-secondary')} />}
              >
                <Typography
                  variant="body"
                  className={cn(
                    'font-medium',
                    currentPath === item.id ? 'text-white' : 'text-neo-text-secondary'
                  )}
                >
                  {item.label}
                </Typography>
              </NeoButton>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-neo-text-secondary/10">
            <NeoButton
              variant="outline"
              className="w-full justify-start gap-3 text-neo-danger border-neo-danger hover:bg-neo-danger/10 hover:text-neo-danger h-auto py-3 px-4"
              icon={<LogOut size={20} />}
            >
              <Typography variant="body" className="font-medium text-neo-danger">Sair</Typography>
            </NeoButton>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Local SVG components removed as we use lucide-react directly

export default BottomNav;
