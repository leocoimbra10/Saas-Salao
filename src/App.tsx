/**
 * BEAUTY SALON NEOMORPHIC APP - Main Application with Layout
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Shared Components
import { AppLayout, PageWrapper } from './shared/components/ui/AppLayout';
import { Skeleton } from './shared/components/ui/NeoComponents';

// Auth Module
import { AuthProvider } from './modules/auth/context/AuthContext';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster, toast } from 'sonner';
import { queryClient } from './shared/lib/QueryClient';

// Config Guard Component
const ConfigGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    const requiredKeys = ['VITE_FIREBASE_API_KEY', 'VITE_MERCADOPAGO_PUBLIC_KEY'];
    const missing = requiredKeys.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
      toast.error('Configuração Necessária', {
        description: `As seguintes chaves estão faltando: ${missing.join(', ')}. O aplicativo pode não funcionar corretamente.`,
        duration: Infinity,
      });
    }
  }, []);

  return <>{children}</>;
};

// Organization Module
import { BrandingProvider } from './modules/organization/context/BrandingContext';

// Lazy Loaded Pages
const LoginPage = React.lazy(() => import('./modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterBusinessPage = React.lazy(() => import('./modules/organization/pages/RegisterBusinessPage').then(m => ({ default: m.RegisterBusinessPage })));
const ClientDashboard = React.lazy(() => import('./modules/booking/pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const ClientBooking = React.lazy(() => import('./modules/booking/pages/ClientBooking').then(m => ({ default: m.ClientBooking })));
const OnlineBookingPage = React.lazy(() => import('./modules/booking/pages/OnlineBookingPage').then(m => ({ default: m.OnlineBookingPage })));
const BookingSuccessPage = React.lazy(() => import('./modules/booking/pages/BookingSuccessPage').then(m => ({ default: m.BookingSuccessPage })));
const CheckoutPage = React.lazy(() => import('./modules/booking/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const Portfolio = React.lazy(() => import('./modules/portfolio/pages/Portfolio').then(m => ({ default: m.Portfolio })));
const BridePortalPage = React.lazy(() => import('./modules/bride/pages/BridePortalPage').then(m => ({ default: m.BridePortalPage })));
const BrideSelfOnboardingPage = React.lazy(() => import('./modules/bride/pages/BrideSelfOnboardingPage').then(m => ({ default: m.BrideSelfOnboardingPage })));
const BrideCollectionPage = React.lazy(() => import('./modules/bride/pages/BrideCollectionPage').then(m => ({ default: m.BrideCollectionPage })));
const AdminDashboard = React.lazy(() => import('./modules/admin/pages/AdminDashboard'));
const ServicesManagement = React.lazy(() => import('./modules/admin/pages/ServicesManagement').then(m => ({ default: m.ServicesManagement })));
const TeamManagementPage = React.lazy(() => import('./modules/admin/pages/TeamManagementPage').then(m => ({ default: m.TeamManagementPage })));
const CommissionDashboard = React.lazy(() => import('./modules/admin/pages/CommissionDashboard').then(m => ({ default: m.CommissionDashboard })));
const FinancialDashboard = React.lazy(() => import('./modules/admin/pages/FinancialDashboard').then(m => ({ default: m.FinancialDashboard })));
const AnalyticsDashboard = React.lazy(() => import('./modules/admin/pages/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const BrideCommandCenter = React.lazy(() => import('./modules/bride/pages/BrideCommandCenter').then(m => ({ default: m.BrideCommandCenter })));
const SalonSettingsPage = React.lazy(() => import('./modules/admin/pages/SalonSettingsPage'));
const PaymentPage = React.lazy(() => import('./modules/payment/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));

// Fallback Loader
const PageLoader = () => (
  <PageWrapper>
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-neo" />
        <Skeleton className="h-48 rounded-neo" />
        <Skeleton className="h-64 md:col-span-2 rounded-neo" />
      </div>
    </div>
  </PageWrapper>
);


// Home Page (Landing)
const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-neo-bg">
        {/* Hero Section */}
        <header className="p-6 pt-12">
          {/* Logout Button */}
          <a
            href="/login"
            className="absolute top-4 right-4 p-3 bg-neo-bg rounded-full shadow-neo-out active:shadow-neo-pressed transition-all"
            title="Sair"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neo-text-secondary">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </a>

          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-28 h-28 bg-neo-accent rounded-full shadow-neo-out-lg flex items-center justify-center mx-auto mb-6 relative"
            >
              {/* Decorative aura */}
              <div className="absolute inset-0 bg-neo-accent/20 blur-2xl rounded-full scale-150 -z-10 animate-pulse" />

              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                <path d="M19.5 15l-1.5 4.5L15 21l1.5-4.5L21 15l-4.5-1.5L19.5 15z" />
                <path d="M3.5 15l1.5-4.5L1 9l4.5 1.5L3.5 15z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-display font-bold text-neo-text mb-2 tracking-tight">Salão Beauty</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-neo-accent/30" />
              <p className="text-caption italic">Sua beleza em evidência</p>
              <div className="h-[1px] w-8 bg-neo-accent/30" />
            </div>
          </div>

          {/* CTA - Pronta para brilhar? (TOP) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-neo-bg rounded-neo shadow-neo-out p-6 text-center border border-white/40 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-neo-accent/10 blur-3xl rounded-full" />
              <h3 className="text-xl font-display font-bold text-neo-text mb-2">Pronta para brilhar?</h3>
              <p className="text-xs text-neo-text-secondary mb-5">
                Sua beleza merece o melhor atendimento.
              </p>
              <a href="/booking" className="btn-glass-glow btn-primary px-10 py-3 inline-block text-lg font-semibold">
                Agendar Agora
              </a>
            </div>
          </motion.div>

          {/* Noiva - Portal Exclusivo */}
          <motion.a
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            href="/noiva"
            className="block mb-6 relative overflow-hidden bg-neo-bg rounded-neo shadow-neo-out p-6 active:shadow-neo-pressed transition-all border border-[#D4AF37]/10 group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div
                className="w-16 h-16 rounded-neo shadow-neo-out flex items-center justify-center flex-shrink-0 border-2 border-white/50 group-hover:shadow-neo-out-lg transition-all"
                style={{ backgroundColor: '#FAF6E9' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <path d="M2 8l4 12h12l4-12-5 4-5-8-5 8-5-4z" />
                  <path d="M6 20h12" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/10" style={{ color: '#D4AF37' }}>
                    Exclusivo Noivas
                  </span>
                </div>
                <h3 className="font-display font-bold text-neo-text text-lg">Portal da Noiva</h3>
                <p className="text-xs text-neo-text-secondary mt-1">
                  Moodboard, timeline e planejamento exclusivo
                </p>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 rounded-neo shadow-neo-out flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.div>
            </div>
          </motion.a>

          {/* SECONDARY ACTIONS: Portfolio + Perfil */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <a
              href="/portfolio"
              className="bg-neo-bg rounded-neo shadow-neo-out p-4 active:shadow-neo-pressed transition-all group flex flex-col items-center text-center"
            >
              <div className="mb-2 text-neo-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h4 className="font-semibold text-neo-text text-sm">Portfolio</h4>
            </a>
            <a
              href="/profile"
              className="bg-neo-bg rounded-neo shadow-neo-out p-4 active:shadow-neo-pressed transition-all group flex flex-col items-center text-center"
            >
              <div className="mb-2 text-neo-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h4 className="font-semibold text-neo-text text-sm">Meu Perfil</h4>
            </a>
          </div>
        </header>

        {/* Premium Vibe Section */}
        <section className="px-6 mt-6 pb-12">
          <div className="relative overflow-hidden bg-neo-bg rounded-neo shadow-neo-out p-6 text-center border-2 border-white/20">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-neo-accent/5 blur-3xl rounded-full" />
            <h3 className="text-lg font-semibold text-neo-text mb-3">Experiência Única</h3>
            <p className="text-xs text-neo-text-secondary leading-relaxed mb-4">
              Cada detalhe foi pensado para proporcionar a você um momento de relaxamento e transformação.
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center text-neo-accent mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-[9px] text-neo-text-secondary">Segurança</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center text-neo-info mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <span className="text-[9px] text-neo-text-secondary">Conforto</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center text-neo-warning mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <span className="text-[9px] text-neo-text-secondary">Exclusivo</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};


// Profile Page
const ProfilePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="p-6">
        <h1 className="text-display mb-2">Perfil</h1>
        <p className="text-caption">Sua área personalizada</p>

        <div className="mt-8 bg-neo-bg rounded-neo shadow-neo-out p-6">
          <div className="w-20 h-20 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neo-accent">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-center text-neo-text font-semibold">Faça login para ver seu histórico</p>
          <button className="mt-4 w-full py-3 bg-neo-bg rounded-neo shadow-neo-out text-neo-accent font-semibold active:shadow-neo-pressed transition-all">
            Entrar com E-mail
          </button>
          <button className="mt-3 w-full py-3 bg-neo-bg rounded-neo shadow-neo-out font-semibold active:shadow-neo-pressed transition-all flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-neo-text">Entrar com Google</span>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

// Main App with animated routes
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BrandingProvider>
            <AppLayout>
              <ConfigGuard>
                <React.Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register-business" element={<RegisterBusinessPage />} />

                    {/* Client Routes */}
                    <Route path="/" element={<ClientDashboard />} />
                    <Route path="/booking" element={<ClientBooking />} />
                    <Route path="/booking/online" element={<OnlineBookingPage />} />
                    <Route path="/booking/success" element={<BookingSuccessPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/noiva" element={<BridePortalPage />} />
                    <Route path="/noiva/cadastro" element={<BrideSelfOnboardingPage />} />
                    <Route path="/noiva/colecao" element={<BrideCollectionPage />} />
                    <Route path="/bride-portal" element={<BridePortalPage />} /> {/* Legacy alias */}

                    {/* Payment Route - Public */}
                    <Route path="/pagamento/:id" element={<PaymentPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/calendar" element={<AdminDashboard initialView="calendar" />} />
                    <Route path="/admin/clients" element={
                      <PageWrapper>
                        <div className="p-6">
                          <h1 className="text-display">Clientes</h1>
                        </div>
                      </PageWrapper>
                    } />
                    <Route path="/admin/services" element={<ServicesManagement />} />
                    <Route path="/admin/portfolio" element={<Portfolio />} />
                    <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/admin/team" element={<TeamManagementPage />} />
                    <Route path="/admin/brides" element={<BrideCommandCenter />} />
                    <Route path="/admin/brides/:brideId" element={<BrideCommandCenter />} />
                    <Route path="/admin/commissions" element={<CommissionDashboard />} />
                    <Route path="/admin/online-booking" element={
                      <PageWrapper>
                        <div className="p-6">
                          <h1 className="text-display">Link de Agendamento</h1>
                          <p className="text-caption mt-2">Configure seu link de agendamento online</p>
                        </div>
                      </PageWrapper>
                    } />
                    <Route path="/admin/reports" element={
                      <PageWrapper>
                        <div className="p-6">
                          <h1 className="text-display">Relatórios</h1>
                          <p className="text-caption mt-2">Comandas e receitas</p>
                        </div>
                      </PageWrapper>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </React.Suspense>
              </ConfigGuard>
              <Toaster position="top-center" richColors />
              <ReactQueryDevtools initialIsOpen={false} />
            </AppLayout>
          </BrandingProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
