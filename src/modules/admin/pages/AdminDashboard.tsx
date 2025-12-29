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
import { Card, Button, Badge, Avatar, Toggle, Progress, Input, Skeleton } from '../../../shared/components/ui/NeoComponents';
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
const StatsPanel: React.FC = () => {
  const stats = {
    monthlyRevenue: 12850,
    monthlyAppointments: 45,
    clientRetention: 78,
    topServices: [
      { name: 'Maquiagem', count: 18 },
      { name: 'Coque', count: 12 },
      { name: 'Combo', count: 8 },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-neo-accent" />
          <span className="text-xs text-neo-text-secondary">Receita Mensal</span>
        </div>
        <p className="text-xl font-bold text-neo-text">
          {formatCurrency(stats.monthlyRevenue)}
        </p>
        <p className="text-xs text-neo-success mt-1">+12% vs último mês</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon size={18} className="text-neo-info" />
          <span className="text-xs text-neo-text-secondary">Agendamentos</span>
        </div>
        <p className="text-xl font-bold text-neo-text">
          {stats.monthlyAppointments}
        </p>
        <p className="text-xs text-neo-text-secondary mt-1">este mês</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-neo-success" />
          <span className="text-xs text-neo-text-secondary">Retenção</span>
        </div>
        <p className="text-xl font-bold text-neo-text">
          {stats.clientRetention}%
        </p>
        <Progress value={stats.clientRetention} className="mt-2" />
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-neo-warning" />
          <span className="text-xs text-neo-text-secondary">Novos Clientes</span>
        </div>
        <p className="text-xl font-bold text-neo-text">8</p>
        <p className="text-xs text-neo-success mt-1">este mês</p>
      </Card>
    </div>
  );
};

// Pro Stats Panel (Hidden until toggled)
const ProStatsPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const projections = {
    projectedRevenue: 18500,
    projectedAppointments: 62,
    averageTicket: 285,
    conversionRate: 0.78,
    topServices: [
      { name: 'Maquiagem', count: 18 },
      { name: 'Coque', count: 12 },
      { name: 'Combo', count: 8 },
    ],
  };

  // Dummy stats for the new section, replace with actual data if available
  const stats = [
    { title: 'Receita Mensal', value: formatCurrency(12850), icon: DollarSign, trend: '+12% vs último mês' },
    { title: 'Agendamentos', value: '45', icon: CalendarIcon, trend: 'este mês' },
    { title: 'Retenção', value: '78%', icon: TrendingUp, trend: '' },
    { title: 'Novos Clientes', value: '8', icon: Users, trend: 'este mês' },
  ];


  return (
    <div className="mb-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full p-3 rounded-neo shadow-neo-out flex items-center justify-between mb-4"
      >
        <span className="font-medium text-neo-text">Pro Stats</span>
        {isVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Card className="p-4 bg-gradient-to-br from-neo-accent/5 to-neo-accent/10">
              <h4 className="font-semibold text-neo-text mb-4">Projeções do Mês</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neo-text-secondary">Receita Projetada</p>
                  <p className="text-lg font-bold text-neo-accent">
                    {formatCurrency(projections.projectedRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neo-text-secondary">Agendamentos</p>
                  <p className="text-lg font-bold text-neo-text">
                    {projections.projectedAppointments}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neo-text-secondary">Ticket Médio</p>
                  <p className="text-lg font-bold text-neo-text">
                    {formatCurrency(projections.averageTicket)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neo-text-secondary">Taxa de Conversão</p>
                  <p className="text-lg font-bold text-neo-success">
                    {(projections.conversionRate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                  <Card key={stat.title} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-neo-bg rounded-neo shadow-neo-in">
                        <stat.icon size={24} className="text-neo-accent" />
                      </div>
                      <span className="text-xs font-medium text-neo-success">{stat.trend}</span>
                    </div>
                    <h3 className="text-sm font-medium text-neo-text-secondary mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-neo-text">{stat.value}</p>
                  </Card>
                ))}
              </div>

              {/* Marcela AI: Churn Insights */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-neo-accent" />
                  <h2 className="text-xl font-display font-bold text-neo-text">Insights - Marcela AI</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getChurnAlerts().map((alert, idx) => (
                    <Card key={idx} className="p-5 border-l-4 border-neo-warning relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={16} className="text-neo-warning" />
                            <span className="text-xs font-bold text-neo-warning tracking-widest uppercase">Risco de Churn: {alert.risk}</span>
                          </div>
                          <h4 className="font-bold text-lg text-neo-text">{alert.clientName}</h4>
                          <p className="text-sm text-neo-text-secondary">Última visita há {alert.lastVisit}</p>
                        </div>
                        <Button size="sm" variant="secondary" className="shadow-neo-out text-xs gap-2">
                          Falar com Cliente <ArrowRight size={14} />
                        </Button>
                      </div>
                      <div className="mt-4 p-3 bg-neo-warning/5 rounded-neo border border-neo-warning/10">
                        <p className="text-xs font-medium text-neo-warning/80 italic">Ação sugerida: {alert.action}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              <div className="mt-4 pt-4 border-t border-neo-text-secondary/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neo-text-secondary">Meta Mensal</span>
                  <span className="font-semibold text-neo-text">
                    {Math.round((projections.projectedRevenue / 20000) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(projections.projectedRevenue / 20000) * 100}
                  className="mt-2"
                />
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-neo-text mb-3">Serviços Mais Populares</h4>
              <div className="space-y-3">
                {projections.topServices?.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center text-xs font-bold text-neo-accent">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-neo-text">{service.name}</span>
                    <span className="text-neo-text-secondary">{service.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useBranding } from '../../organization/context/BrandingContext';
// ... props

import { useAppointments, useAppointmentMutations } from '../../booking/hooks/useAppointments';
import { useStaff } from '../hooks/useStaff';
import { useServices } from '../hooks/useServices';

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
  const TEST_APPOINTMENTS: Appointment[] = [
    {
      id: 'test-1',
      orgId: organization?.id || 'org-1',
      clientId: 'client-1',
      clientName: 'Ana Paula Silva',
      clientEmail: 'ana@email.com',
      clientPhone: '11987654321',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      services: services.filter(s => s.name.includes('Maquiagem')).map(s => s.id) || ['service-1'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'confirmed',
      depositPaid: 100,
      totalAmount: 250,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-2',
      orgId: organization?.id || 'org-1',
      clientId: 'client-2',
      clientName: 'Mariana Costa',
      clientEmail: 'mariana@email.com',
      clientPhone: '11976543210',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:30',
      services: services.filter(s => s.name.toLowerCase().includes('cabelo')).map(s => s.id) || ['service-2'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'pending',
      depositPaid: 0,
      totalAmount: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-3',
      orgId: organization?.id || 'org-1',
      clientId: 'client-3',
      clientName: 'Juliana Noiva',
      clientEmail: 'juliana@email.com',
      clientPhone: '11965432109',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      services: services.filter(s => s.name.toLowerCase().includes('noiva')).map(s => s.id) || ['service-3'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'confirmed',
      depositPaid: 300,
      totalAmount: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-4',
      orgId: organization?.id || 'org-1',
      clientId: 'client-4',
      clientName: 'Beatriz Santos',
      clientEmail: 'bia@email.com',
      clientPhone: '11954321098',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:30',
      services: services.filter(s => s.name.toLowerCase().includes('depila')).map(s => s.id) || ['service-4'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'confirmed',
      depositPaid: 50,
      totalAmount: 120,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-5',
      orgId: organization?.id || 'org-1',
      clientId: 'client-5',
      clientName: 'Carolina Oliveira',
      clientEmail: 'carol@email.com',
      clientPhone: '11943210987',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '17:00',
      services: services.filter(s => s.name.toLowerCase().includes('unhas')).map(s => s.id) || ['service-5'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'pending',
      depositPaid: 0,
      totalAmount: 90,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-6',
      orgId: organization?.id || 'org-1',
      clientId: 'client-6',
      clientName: 'Fernanda Lima',
      clientEmail: 'fernanda@email.com',
      clientPhone: '11932109876',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '18:30',
      services: services.filter(s => s.name.toLowerCase().includes('maquiagem')).map(s => s.id) || ['service-1'],
      staffId: staff[0]?.id || 'staff-1',
      status: 'confirmed',
      depositPaid: 80,
      totalAmount: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Merge test data with real appointments (only if not in production)
  const allAppointments = process.env.NODE_ENV === 'development'
    ? [...appointments, ...TEST_APPOINTMENTS]
    : appointments;
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
            <h2 className="text-2xl font-display font-bold text-neo-text">
              {isLoading ? <Skeleton className="w-32 h-8" /> : (organization?.name || (initialView === 'schedule' ? 'Dashboard' : 'Agenda'))}
            </h2>
            <p className="text-neo-text-secondary">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          {initialView === 'schedule' && (
            <a href="/register-business" title="Configurações do Salão">
              <Button variant="ghost" size="sm">
                <Settings size={20} />
              </Button>
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
                <StatsPanel />
                <ProStatsPanel />
              </>
            )}

            {/* Recent Activity / Simplified List could go here */}
            <div className="bg-neo-bg rounded-neo shadow-neo-out p-6 border border-white/40">
              <h3 className="text-lg font-display font-semibold text-neo-text mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {todaysAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-neo bg-white/30 border border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neo-accent/10 flex items-center justify-center text-neo-accent font-bold">
                        {apt.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-neo-text">{apt.clientName}</p>
                        <p className="text-xs text-neo-text-secondary">{apt.time} • {apt.services.join(', ')}</p>
                      </div>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'}>
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
                {todaysAppointments.length === 0 && (
                  <p className="text-sm text-neo-text-secondary text-center py-4">Nenhuma atividade recente.</p>
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

      {/* FAB - Handled by AgendaView now */}
      {/* 
      {
        initialView === 'calendar' && (
          <button
            onClick={() => setShowAddAppointment(true)}
            className="neo-fab"
          >
            <Plus size={24} />
          </button>
        )
      } 
      */}

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
