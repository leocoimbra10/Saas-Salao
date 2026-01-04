/**
 * BEAUTY SALON NEOMORPHIC APP - Admin Dashboard Page
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Image,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency, getStatusColor } from '../../../shared/lib/utils';
import { Service, Appointment, Staff, STATS_INITIAL } from '../../../shared/types/types';
import { SERVICES_DATA } from '../../../shared/types/types';
import {
  NeoCard as NeoCard,
  NeoButton as NeoButton,
  Badge,
  Avatar,
  Progress,
  NeoInput as NeoInput,
  Skeleton,
  Typography
} from '../../../shared/components/ui/NeoComponents';
import { Calendar, DaySchedule } from '../../booking/components/Calendar';
import { StaffScheduler } from '../components/StaffScheduler';
import { AgendaView } from '../components/AgendaView';
import { NewBookingModal } from '../components/NewBookingModal';
import { AppointmentCard, AppointmentActions, AppointmentDetails } from '../../booking/components/AppointmentCard';
import { subscribeToAppointments } from '../../booking/services/appointmentService';
import { subscribeToStaff } from '../services/staffService';
import { subscribeToServices } from '../services/serviceService';
import { getChurnAlerts } from '../../../shared/services/AIService';


// Stats Panel Component (Props interface if needed)
interface AdminDashboardProps {
  initialView?: 'calendar' | 'schedule';
}
// Stats Panel Component
// Stats Panel Component (Props interface if needed)
interface StatsPanelProps {
  stats: any; // Ideally import DashboardStats interface but 'any' allows quick integration if types not exported
}

// Stats Panel Component
const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <NeoCard className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-neo-accent" />
          <Typography variant="caption" className="text-xs">Receita Mensal</Typography>
        </div>
        <Typography variant="h4" className="text-xl font-bold">
          {formatCurrency(stats.monthlyRevenue)}
        </Typography>
        <Typography variant="caption" className="text-xs text-neo-success mt-1">
          {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}% vs último mês
        </Typography>
      </NeoCard>

      <NeoCard className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon size={18} className="text-neo-info" />
          <Typography variant="caption" className="text-xs">Agendamentos</Typography>
        </div>
        <Typography variant="h4" className="text-xl font-bold">
          {stats.monthlyAppointments}
        </Typography>
        <Typography variant="caption" className="text-xs mt-1">
          {stats.appointmentGrowth > 0 ? '+' : ''}{stats.appointmentGrowth}% este mês
        </Typography>
      </NeoCard>

      <NeoCard className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-neo-success" />
          <Typography variant="caption" className="text-xs">Retenção</Typography>
        </div>
        <Typography variant="h4" className="text-xl font-bold">
          {stats.clientRetention}%
        </Typography>
        <Progress value={stats.clientRetention} className="mt-2" />
      </NeoCard>

      <NeoCard className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-neo-warning" />
          <Typography variant="caption" className="text-xs">Novos Clientes</Typography>
        </div>
        <Typography variant="h4" className="text-xl font-bold">{stats.newClients}</Typography>
        <Typography variant="caption" className="text-xs text-neo-success mt-1">este mês</Typography>
      </NeoCard>
    </div>
  );
};

// Pro Stats Panel (Hidden until toggled)
const ProStatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Stats derived from props
  const projections = {
    projectedRevenue: stats.projectedRevenue,
    projectedAppointments: stats.projectedAppointments,
    averageTicket: stats.averageTicket,
    conversionRate: 0.78, // Still hardcoded as we don't have lead data
    topServices: stats.topServices,
  };

  // Dummy stats for the new section, replace with actual data if available
  const simpleStats = [
    { title: 'Receita Mensal', value: formatCurrency(stats.monthlyRevenue), icon: DollarSign, trend: `${stats.revenueGrowth}%` },
    { title: 'Agendamentos', value: stats.monthlyAppointments.toString(), icon: CalendarIcon, trend: 'este mês' },
    { title: 'Retenção', value: `${stats.clientRetention}%`, icon: TrendingUp, trend: '' },
    { title: 'Novos Clientes', value: stats.newClients.toString(), icon: Users, trend: 'este mês' },
  ];


  return (
    <div className="mb-6">
      <NeoButton
        variant="neu"
        fullWidth
        onClick={() => setIsVisible(!isVisible)}
        className="justify-between mb-4"
        icon={isVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        iconPosition="right"
      >
        <Typography variant="h6">Pro Stats</Typography>
      </NeoButton>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <NeoCard className="p-4 bg-gradient-to-br from-neo-accent/5 to-neo-accent/10">
              <Typography variant="h4" className="mb-4">Projeções do Mês</Typography>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="caption">Receita Projetada</Typography>
                  <Typography variant="h4" className="text-lg font-bold text-neo-accent">
                    {formatCurrency(projections.projectedRevenue)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption">Agendamentos</Typography>
                  <Typography variant="h4" className="text-lg font-bold">
                    {projections.projectedAppointments}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption">Ticket Médio</Typography>
                  <Typography variant="h4" className="text-lg font-bold">
                    {formatCurrency(projections.averageTicket)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption">Taxa de Conversão</Typography>
                  <Typography variant="h4" className="text-lg font-bold text-neo-success">
                    {(projections.conversionRate * 100).toFixed(0)}%
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {simpleStats.map((stat) => (
                  <NeoCard key={stat.title} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-neo-bg rounded-neo shadow-neo-in">
                        <stat.icon size={24} className="text-neo-accent" />
                      </div>
                      <Typography variant="label" className="text-neo-success">{stat.trend}</Typography>
                    </div>
                    <Typography variant="caption" className="mb-1">{stat.title}</Typography>
                    <Typography variant="h4" className="text-2xl font-bold">{stat.value}</Typography>
                  </NeoCard>
                ))}
              </div>

              {/* Marcela AI: Churn Insights */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-neo-accent" />
                  <Typography variant="h3">Insights - Marcela AI</Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getChurnAlerts().map((alert, idx) => (
                    <NeoCard key={idx} className="p-5 border-l-4 border-neo-warning relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={16} className="text-neo-warning" />
                            <Typography variant="label" className="text-neo-warning tracking-widest uppercase">Risco de Churn: {alert.risk}</Typography>
                          </div>
                          <Typography variant="h4" className="text-lg">{alert.clientName}</Typography>
                          <Typography variant="caption">Última visita há {alert.lastVisit}</Typography>
                        </div>
                        <NeoButton size="sm" variant="outline" className="shadow-neo-out text-xs gap-2">
                          Falar com Cliente <ArrowRight size={14} />
                        </NeoButton>
                      </div>
                      <div className="mt-4 p-3 bg-neo-warning/5 rounded-neo border border-neo-warning/10">
                        <Typography variant="caption" className="text-neo-warning/80 italic">Ação sugerida: {alert.action}</Typography>
                      </div>
                    </NeoCard>
                  ))}
                </div>
              </section>

              <div className="mt-4 pt-4 border-t border-neo-text-secondary/10">
                <div className="flex items-center justify-between text-sm">
                  <Typography variant="caption" className="text-neo-text-secondary">Meta Mensal</Typography>
                  <Typography variant="body" className="font-semibold text-neo-text">
                    {Math.round((projections.projectedRevenue / 20000) * 100)}%
                  </Typography>
                </div>
                <Progress
                  value={(projections.projectedRevenue / 20000) * 100}
                  className="mt-2"
                />
              </div>
            </NeoCard>

            <NeoCard className="p-4">
              <Typography variant="h4" className="mb-3">Serviços Mais Populares</Typography>
              <div className="space-y-3">
                {projections.topServices?.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Typography variant="caption" className="w-6 h-6 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center font-bold text-neo-accent">
                      {idx + 1}
                    </Typography>
                    <Typography variant="body" className="flex-1">{service.name}</Typography>
                    <Typography variant="caption">{service.count}</Typography>
                  </div>
                ))}
              </div>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useBranding } from '../../../shared/context/BrandingContext';
// ... props

import { useAppointments, useAppointmentMutations } from '../../booking/hooks/useAppointments';
import { useStaff } from '../hooks/useStaff';
import { useServices } from '../hooks/useServices';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialView = 'schedule' }) => {
  const { organization } = useBranding();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'schedule'>(initialView);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // TanStack Query Hooks
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments(organization?.id);
  const { data: staff = [], isLoading: isLoadingStaff } = useStaff(organization?.id);
  const { data: services = [], isLoading: isLoadingServices } = useServices(organization?.id);

  const { updateAppointment: updateAppt, deleteAppointment: deleteAppt } = useAppointmentMutations(organization?.id);

  const isLoading = isLoadingAppointments || isLoadingStaff || isLoadingServices;

  // View State for Calendar Mode
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');

  // ====== TEST DATA - Remove after verification ======
  const { stats, isLoading: isLoadingStats } = useDashboardStats(organization?.id);

  // Merge test data with real appointments (only if not in production)
  const allAppointments = appointments;
  // ====== END TEST DATA ======

  const todaysAppointments = useMemo(() => {
    return allAppointments.filter(apt =>
      isSameDay(new Date(apt.date), selectedDate)
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [allAppointments, selectedDate]);

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    if (initialView === 'schedule') {
      // In Dashboard, maybe just show details? But user wants to edit.
      setShowDetails(true);
    } else {
      // In Calendar, click opens actions
      setShowActions(true);
    }
  };

  const handleActionClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowActions(true);
  };

  return (
    <div className="min-h-screen bg-neo-bg pb-24 relative">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2">
              {isLoading ? <Skeleton className="w-32 h-8" /> : (organization?.name || (initialView === 'schedule' ? 'Dashboard' : 'Agenda'))}
            </Typography>
            <Typography variant="caption">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </Typography>
          </div>

          {initialView === 'schedule' && (
            <a href="/register-business" title="Configurações do Salão">
              <NeoButton variant="ghost" size="sm">
                <Settings size={20} />
              </NeoButton>
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-6 relative z-0">
        {initialView === 'schedule' ? (
          /* DASHBOARD VIEW - Stats Only */
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : (
              <>
                <StatsPanel stats={stats} />
                <ProStatsPanel stats={stats} />
              </>
            )}

            {/* Recent Activity / Simplified List could go here */}
            <div className="bg-neo-bg rounded-neo shadow-neo-out p-6 border border-white/40">
              <Typography variant="h3" className="mb-4">Atividade Recente</Typography>
              <div className="space-y-4">
                {todaysAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-neo bg-white/30 border border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neo-accent/10 flex items-center justify-center text-neo-accent font-bold">
                        {apt.clientName.charAt(0)}
                      </div>
                      <div>
                        <Typography variant="h6">{apt.clientName}</Typography>
                        <Typography variant="caption">{apt.time} • {apt.services.join(', ')}</Typography>
                      </div>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'}>
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
                {todaysAppointments.length === 0 && (
                  <Typography variant="body" className="text-neo-text-secondary text-center py-4">Nenhuma atividade recente.</Typography>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* CALENDAR VIEW - Scheduler Only */
          /* AGENDA VIEW - iPhone Style (Universal) */
          <div className="h-[calc(100vh-180px)] animate-in fade-in duration-500">
            <AgendaView
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              appointments={allAppointments}
              services={services}
              staff={staff}
              onAppointmentClick={handleAppointmentClick}
              onAddAppointment={() => {
                setSelectedAppointment(null);
                setShowAddAppointment(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Add Appointment Modal */}

      {/* Add Appointment Modal */}
      <NewBookingModal
        isOpen={showAddAppointment}
        onClose={() => {
          setShowAddAppointment(false);
          setSelectedAppointment(null); // Clear selection on close
        }}
        selectedDate={selectedAppointment ? new Date(selectedAppointment.date) : selectedDate}
        initialTime={selectedAppointment?.time}
        initialStaffId={selectedAppointment?.staffId}
        initialAppointment={selectedAppointment} // Pass full appointment for editing
        services={services}
        staff={staff}
        onSuccess={() => {
          // Refresh data logic here
          setShowAddAppointment(false);
          setSelectedAppointment(null);
        }}
      />

      {/* Appointment Actions */}
      <AppointmentActions
        appointment={selectedAppointment!}
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        onEdit={() => {
          setShowActions(false);
          setShowAddAppointment(true);
        }}
        onDelete={() => {
          if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            deleteAppt(selectedAppointment!.id);
            setShowActions(false);
          }
        }}
        onWhatsApp={() => {
          if (selectedAppointment) {
            const message = encodeURIComponent(`Olá ${selectedAppointment.clientName}!`);
            window.open(`https://wa.me/55${selectedAppointment.clientPhone}?text=${message}`, '_blank');
          }
        }}
        onStatusConfirm={() => {
          if (selectedAppointment) {
            updateAppt({ id: selectedAppointment.id, updates: { status: 'confirmed' } });
            setShowActions(false);
          }
        }}
        onStatusComplete={() => {
          if (selectedAppointment) {
            updateAppt({ id: selectedAppointment.id, updates: { status: 'completed' } });
            setShowActions(false);
          }
        }}
      />
    </div >
  );
};

export default AdminDashboard;

