/**
 * BEAUTY SALON NEOMORPHIC APP - Global Layout Wrapper
 * Provides persistent navigation and smart header across all routes
 */
import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { NeoButton } from './NeoComponents';

// Tab configuration
interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const TAB_CONFIG: TabItem[] = [
  {
    path: '/',
    label: 'Início',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/booking',
    label: 'Agendar',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    path: '/portfolio',
    label: 'Portfolio',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Perfil',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

// Admin sidebar configuration
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

// Check if a path is a root tab
const isRootTab = (path: string, tabs: TabItem[]): boolean => {
  return tabs.some(tab => tab.path === path);
};

// Get the parent tab for a given path (finds most specific match)
const getParentTab = (path: string, tabs: TabItem[]): TabItem | undefined => {
  // For admin routes, find the most specific match (longest path that matches)
  if (path.startsWith('/admin')) {
    const matchingTabs = ADMIN_TABS.filter(tab => path.startsWith(tab.path));
    // Sort by path length descending to get the most specific match
    matchingTabs.sort((a, b) => b.path.length - a.path.length);
    return matchingTabs[0];
  }
  const matchingTabs = tabs.filter(tab => path.startsWith(tab.path));
  matchingTabs.sort((a, b) => b.path.length - a.path.length);
  return matchingTabs[0];
};

// Neomorphic Tab Button Component
interface TabButtonProps {
  item: TabItem;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ item, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center py-2 px-3 relative',
        'transition-all duration-200 rounded-neo',
        isActive ? 'text-neo-accent' : 'text-neo-text-secondary'
      )}
    >
      <div className={cn(
        'transition-transform duration-200',
        isActive && 'transform -translate-y-0.5'
      )}>
        {item.icon}
      </div>
      <span className="text-[10px] font-medium mt-1">{item.label}</span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 w-8 h-0.5 bg-neo-accent rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
};

// Bottom Navigation Component
interface BottomNavigationProps {
  tabs: TabItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  currentPath,
  onNavigate,
}) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-neo-bg">
      {/* Neomorphic top shadow for the tab bar */}
      <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

      <div className="flex items-center justify-around px-2 pb-safe pt-2">
        {tabs.map((item) => (
          <TabButton
            key={item.path}
            item={item}
            isActive={currentPath === item.path || currentPath.startsWith(item.path + '/')}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </div>

      {/* Safe area padding at bottom */}
      <div className="h-safe-bottom bg-neo-bg" />
    </div>
  );
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

// Client Layout with persistent bottom navigation
interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRoot = isRootTab(location.pathname, TAB_CONFIG);

  return (
    <div className="min-h-screen bg-neo-bg">
      <main className="relative w-full max-w-[480px] mx-auto bg-neo-bg min-h-screen">
        {children}
      </main>

      {/* Persistent Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40">
        <BottomNavigation
          tabs={TAB_CONFIG}
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
      </div>
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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const currentTab = getParentTab(location.pathname, ADMIN_TABS);
  const isRoot = isRootTab(location.pathname, ADMIN_TABS);

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
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          'fixed top-0 left-0 bottom-0 w-[280px] bg-neo-bg z-50 transition-transform duration-300 lg:translate-x-0 shadow-xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="relative p-6 h-full flex flex-col bg-neo-bg">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-neo-accent rounded-neo flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                  <path d="M19.5 15l-1.5 4.5L15 21l1.5-4.5L21 15l-4.5-1.5L19.5 15z" />
                  <path d="M3.5 15l1.5-4.5L1 9l4.5 1.5L3.5 15z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-semibold text-neo-text">Salão Beauty</h2>
                <p className="text-xs text-neo-text-secondary">Admin Panel</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {ADMIN_TABS.map((item) => (
                <NeoButton
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  variant={location.pathname === item.path ? 'neu' : 'ghost'}
                  className={cn(
                    'w-full flex items-center justify-start gap-3 px-4 py-3 rounded-neo transition-all duration-200',
                    location.pathname === item.path
                      ? 'text-neo-accent'
                      : 'text-neo-text-secondary hover:text-neo-text'
                  )}
                >
                  <span className={cn(location.pathname === item.path && 'transform scale-110')}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </NeoButton>
              ))}
            </nav>

            {/* Logout */}
            <NeoButton
              onClick={() => navigate('/')}
              variant="neu"
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-neo text-neo-danger active:shadow-neo-pressed transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="font-medium">Sair</span>
            </NeoButton>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[280px] p-4 lg:p-6 pb-24">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar for Admin */}
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

// Main App Layout with route handling
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Determine if we should show the client or admin layout
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <ClientLayout>{children}</ClientLayout>;
};

export default AppLayout;
