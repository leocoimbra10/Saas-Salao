/**
 * BEAUTY SALON NEOMORPHIC APP - Main Application with Layout
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster, toast } from 'sonner';

// Shared Components/Context/Lib
import { AppLayout, PageWrapper } from './shared/components/ui/AppLayout';
import { AuthProvider, useAuth } from './modules/auth/context/AuthContext';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { queryClient } from './shared/lib/QueryClient';
import { BrandingProvider } from './shared/context/BrandingContext';
import { APP_TEXTS, ROUTES } from './shared/lib/constants'; // Centralized Constants

import {
  NeoButton,
  NeoCard,
  Typography,
  Badge,
  Skeleton
} from './shared/components/ui';

import './App.css';
import { Star, Shield, Smartphone, ArrowRight, User, Briefcase, AlertTriangle, RefreshCw } from 'lucide-react';

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
const CreateCollectionPage = React.lazy(() => import('./modules/bride/pages/BrideCollectionPage').then(m => ({ default: m.BrideCollectionPage })));
const ReceiptPDF = React.lazy(() => import('./modules/payment/components/ReceiptPDF'));
const DesignSystemPage = React.lazy(() => import('./modules/admin/pages/DesignSystemPage').then(m => ({ default: m.DesignSystemPage })));

// ENHANCED Config Guard Component
const ConfigGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true); // Assuming true for now, would typically ping a health endpoint

  useEffect(() => {
    const requiredKeys = ['VITE_FIREBASE_API_KEY', 'VITE_MERCADOPAGO_PUBLIC_KEY'];
    const missing = requiredKeys.filter(key => !import.meta.env[key]);

    // Simulate connection check (or implement real one)
    // For now we just check keys
    if (missing.length > 0) {
      setMissingKeys(missing);
      console.warn('Missing configuration keys:', missing);
      toast.error(`Missing keys: ${missing.join(', ')}`);
      setStatus('ready'); // Proceed to allow UI testing/setup
    } else {
      setStatus('ready'); // Set to ready if no keys are missing
    }
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
        <NeoCard className="max-w-md w-full p-8 text-center border-l-4 border-neo-danger" variant="raised">
          <div className="w-16 h-16 bg-neo-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-neo-danger" />
          </div>

          <Typography variant="h3" className="text-neo-text font-bold mb-2">
            {APP_TEXTS.CONFIG_ERROR_TITLE}
          </Typography>

          <Typography variant="body" className="text-neo-text-secondary mb-6">
            {APP_TEXTS.CONFIG_ERROR_DESC}
          </Typography>

          {missingKeys.length > 0 && (
            <div className="bg-neo-bg rounded-neo-sm p-3 mb-6 text-left">
              <Typography variant="caption" className="font-mono text-neo-danger break-all">
                Missing: {missingKeys.join(', ')}
              </Typography>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <NeoButton
              variant="gradient"
              onClick={() => window.location.reload()}
              icon={<RefreshCw size={18} />}
            >
              {APP_TEXTS.CONFIG_BUTTON_RETRY}
            </NeoButton>
          </div>
        </NeoCard>
      </div>
    );
  }

  if (status === 'checking') {
    return <PageLoader />;
  }

  return <>{children}</>;
};

// Fallback Loader
const PageLoader = () => (
  <PageWrapper>
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <Typography variant="caption" className="animate-pulse">Carregando...</Typography>
    </div>
  </PageWrapper>
);

// Home Page (Landing)
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-[100px]" />
      </div>

      <NeoCard className="w-full max-w-md p-8 text-center z-10 relative bg-opacity-80 backdrop-blur-md">
        <Typography variant="h1" className="mb-2 font-serif text-4xl bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
          {APP_TEXTS.HOME_HERO_TITLE}
        </Typography>

        <Typography variant="body" className="text-neo-text-secondary mb-8">
          {APP_TEXTS.HOME_HERO_SUBTITLE}
        </Typography>

        <div className="grid gap-4 w-full">
          <Link to={ROUTES.LOGIN} className="w-full">
            <NeoButton
              variant="glow"
              className="w-full py-4 text-lg"
              icon={<User size={18} />}
            >
              {APP_TEXTS.HOME_BUTTON_LOGIN}
            </NeoButton>
          </Link>

          <Link to={ROUTES.REGISTER_BUSINESS} className="w-full">
            <NeoButton
              variant="glass"
              className="w-full"
              icon={<Briefcase size={18} />}
            >
              {APP_TEXTS.HOME_BUTTON_REGISTER_BUSINESS}
            </NeoButton>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-neo-bg shadow-neo-out text-brand-primary">
              <Star size={20} />
            </div>
            <Typography variant="caption" className="text-xs">{APP_TEXTS.HOME_FEATURE_PREMIUM}</Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-neo-bg shadow-neo-out text-brand-primary">
              <Shield size={20} />
            </div>
            <Typography variant="caption" className="text-xs">{APP_TEXTS.HOME_FEATURE_SECURE}</Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-neo-bg shadow-neo-out text-brand-primary">
              <Smartphone size={20} />
            </div>
            <Typography variant="caption" className="text-xs">{APP_TEXTS.HOME_FEATURE_DIGITAL}</Typography>
          </div>
        </div>
      </NeoCard>

      <Typography variant="caption" className="mt-8 text-neo-text-secondary/60">
        {APP_TEXTS.COPYRIGHT}
      </Typography>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrandingProvider>
          <ConfigGuard>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.LOGIN} element={
                  <React.Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </React.Suspense>
                } />
                <Route path={ROUTES.REGISTER_BUSINESS} element={
                  <React.Suspense fallback={<PageLoader />}>
                    <RegisterBusinessPage />
                  </React.Suspense>
                } />
                <Route path="/agendar/:subdomain" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <OnlineBookingPage />
                  </React.Suspense>
                } />
                <Route path="/portfolio" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <Portfolio />
                  </React.Suspense>
                } />

                {/* Home/Landing */}
                <Route path={ROUTES.HOME} element={<HomePage />} />

                {/* Client Routes */}
                <Route path={ROUTES.CLIENT_DASHBOARD} element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path={ROUTES.CLIENT_BOOKING} element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client']}>
                      <ClientBooking />
                    </ProtectedRoute>
                  </React.Suspense>
                } />

                {/* Bride Portal Routes */}
                <Route path="/noiva" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client', 'owner']}>
                      <BridePortalPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path="/noiva/:brideId" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client', 'owner']}>
                      <BridePortalPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path="/noiva-onboarding" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client']}>
                      <BrideSelfOnboardingPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path="/noiva/:brideId/colecao" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client', 'owner']}>
                      <CreateCollectionPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path="/noiva/pacotes" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client', 'owner']}>
                      <BrideCollectionPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />

                {/* Booking Success Route */}
                <Route path={ROUTES.BOOKING_SUCCESS} element={
                  <React.Suspense fallback={<PageLoader />}>
                    <BookingSuccessPage />
                  </React.Suspense>
                } />

                {/* Checkout Route */}
                <Route path="/checkout" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <CheckoutPage />
                  </React.Suspense>
                } />

                {/* Payment Route */}
                <Route path="/pagamento" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ProtectedRoute allowedRoles={['client', 'owner']}>
                      <PaymentPage />
                    </ProtectedRoute>
                  </React.Suspense>
                } />
                <Route path="/receipt/:transactionId" element={
                  <React.Suspense fallback={<PageLoader />}>
                    <ReceiptPDF />
                  </React.Suspense>
                } />

                {/* Admin Routes */}
                <Route path={ROUTES.ADMIN_DASHBOARD} element={
                  <ProtectedRoute allowedRoles={['owner', 'employee']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <AdminDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                {/* Design System Route */}
                <Route path={ROUTES.ADMIN_DESIGN_SYSTEM} element={
                  <ProtectedRoute allowedRoles={['owner', 'employee']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <DesignSystemPage />
                    </React.Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/admin/services" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <ServicesManagement />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/team" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <TeamManagementPage />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/commissions" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <CommissionDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/financial" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <FinancialDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <AnalyticsDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <SalonSettingsPage />
                    </React.Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/admin/bride-center" element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <React.Suspense fallback={<PageLoader />}>
                      <BrideCommandCenter />
                    </React.Suspense>
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster richColors position="top-right" />
            <ReactQueryDevtools initialIsOpen={false} />
          </ConfigGuard>
        </BrandingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
