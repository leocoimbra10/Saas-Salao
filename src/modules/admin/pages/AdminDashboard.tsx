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
  Clock
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

  const todaysAppointments = useMemo(() => {
    return appointments.filter(apt =>
      isSameDay(new Date(apt.date), selectedDate)
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

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
            <Button variant="ghost" size="sm">
              <Settings size={20} />
            </Button>
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
              appointments={appointments}
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
