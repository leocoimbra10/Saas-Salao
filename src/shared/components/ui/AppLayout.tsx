/**
 * BEAUTY SALON NEOMORPHIC APP - Global Layout Wrapper
 * Refatorado para utilizar componentes modulares de navegação.
 */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { BottomNav, AdminSidebar } from './Navigation';

// Admin tabs configuration for the mobile bottom bar (kept for fallback/mobile-admin)
// Note: Desktop sidebar is now handled by AdminSidebar component
interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const ADMIN_TABS: TabItem[] = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/admin/calendar',
    label: 'Calendário',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    path: '/admin/services',
    label: 'Serviços',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    path: '/admin/portfolio',
    label: 'Portfolio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    path: '/admin/brides',
    label: 'Noivas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15 8H9L12 2Z" />
        <path d="M3 8H21L19 13H5L3 8Z" />
        <path d="M5 13L6 21H18L19 13" />
        <circle cx="12" cy="17" r="2" />
      </svg>
    ),
  },
];

const getParentTab = (path: string, tabs: TabItem[]): TabItem | undefined => {
  if (path.startsWith('/admin')) {
    const matchingTabs = ADMIN_TABS.filter(tab => path.startsWith(tab.path));
    matchingTabs.sort((a, b) => b.path.length - a.path.length);
    return matchingTabs[0];
  }
  return undefined;
};

// Smart Back Button Component
interface SmartBackButtonProps {
  onBack?: () => void;
  show: boolean;
}

export const SmartBackButton: React.FC<SmartBackButtonProps> = ({ onBack, show }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={handleBack}
          className={cn(
            'w-10 h-10 rounded-full',
            'bg-neo-bg shadow-neo-out',
            'flex items-center justify-center',
            'text-neo-text',
            'active:shadow-neo-pressed active:scale-95',
            'transition-all duration-200'
          )}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Header Component
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neo-bg/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <SmartBackButton show={showBack} onBack={onBack} />
          {title && (
            <h1 className="text-lg font-semibold text-neo-text">{title}</h1>
          )}
        </div>
        {rightAction && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
};

// Page Wrapper with animations
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('pb-24', className)}
    >
      {children}
    </motion.div>
  );
};

// Client Layout
interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neo-bg">
      <main className="relative w-full max-w-[480px] mx-auto bg-neo-bg min-h-screen">
        {children}
      </main>

      {/* FIX: Usamos o BottomNav importado diretamente.
        Removemos o wrapper com 'fixed' e 'transform' que criava um novo contexto de empilhamento 
        e escondia a barra de navegação original. O BottomNav já possui 'fixed' e 'z-index' corretos.
      */}
      <BottomNav />
    </div>
  );
};

// Admin Layout with sidebar
interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTab = getParentTab(location.pathname, ADMIN_TABS);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neo-bg">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-neo-bg/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center active:shadow-neo-pressed transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="font-display font-semibold text-neo-text">
            {currentTab?.label || 'Dashboard'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex">
        {/* Modular Admin Sidebar from Navigation.tsx */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={location.pathname}
          onNavigate={handleNavigate}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[280px] p-4 lg:p-6 pb-24">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar for Admin (Mantido pois Navigation.tsx foca em Client) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-neo-bg z-40 lg:hidden">
        <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        <div className="flex items-center justify-around px-2 pb-safe pt-2">
          {ADMIN_TABS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 relative',
                'transition-all duration-200 rounded-neo',
                location.pathname === item.path ? 'text-neo-accent' : 'text-neo-text-secondary'
              )}
            >
              <div className={cn(
                'transition-transform duration-200',
                location.pathname === item.path && 'transform -translate-y-0.5'
              )}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute bottom-0 w-8 h-0.5 bg-neo-accent rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="h-safe-bottom bg-neo-bg" />
      </div>
    </div>
  );
};

// Main App Layout
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <ClientLayout>{children}</ClientLayout>;
};

export default AppLayout;
