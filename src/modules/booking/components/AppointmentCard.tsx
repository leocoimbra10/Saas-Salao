/**
 * BEAUTY SALON NEOMORPHIC APP - Appointment Components
 */
import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { cn, formatCurrency, formatTime, getStatusColor } from '../../../shared/lib/utils';
import { Appointment, Service } from '../../../shared/types/types';
import { Badge, Avatar, NeoButton, Divider } from '../../../shared/components/ui/NeoComponents';
import { ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';

interface AppointmentCardProps {
  appointment: Appointment;
  services: Service[];
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onWhatsApp?: () => void;
  onStatusChange?: (status: Appointment['status']) => void;
  className?: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  services,
  onViewDetails,
  onEdit,
  onDelete,
  onWhatsApp,
  onStatusChange,
  className,
}) => {
  // Null safety checks
  if (!appointment) return null;
  const appointmentServices = appointment.services || [];
  const safeServices = services || [];

  const serviceNames = appointmentServices.map(id =>
    safeServices.find(s => s.id === id)?.name || id
  );

  const isPending = appointment.status === 'pending';
  const depositRatio = appointment.depositPaid > 0
    ? (appointment.depositPaid / appointment.totalAmount) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onViewDetails}
      className={cn(
        'bg-neo-bg rounded-neo shadow-neo-out p-4 cursor-pointer',
        'active:shadow-neo-pressed transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={appointment.clientName} size="sm" />
          <div>
            <h4 className="font-semibold text-neo-text">{appointment.clientName}</h4>
            <p className="text-xs text-neo-text-secondary">{serviceNames[0]}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(appointment.status) as any}>
          {appointment.status === 'confirmed' ? 'Confirmado' :
            appointment.status === 'pending' ? 'Pendente' :
              appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
        </Badge>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 text-sm text-neo-text-secondary mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>
            {format(parseISO(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatTime(appointment.time)}</span>
        </div>
      </div>

      {/* Services */}
      {serviceNames.length > 1 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {serviceNames.slice(0, 3).map((name, idx) => (
            <Badge key={idx} variant="neutral" className="text-[10px]">
              {name}
            </Badge>
          ))}
          {serviceNames.length > 3 && (
            <Badge variant="neutral" className="text-[10px]">
              +{serviceNames.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Payment Status */}
      {isPending && appointment.depositPaid > 0 && (
        <div className="bg-neo-bg rounded-neo-sm shadow-neo-in p-2 mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neo-text-secondary">Pagamento</span>
            <span className="text-neo-warning">
              {formatCurrency(appointment.depositPaid)} de {formatCurrency(appointment.totalAmount)}
            </span>
          </div>
          <div className="h-1.5 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
            <div
              className="h-full bg-neo-warning rounded-full"
              style={{ width: `${depositRatio}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {(onWhatsApp || onEdit) && (
        <div className="flex gap-2 pt-2 border-t border-neo-text-secondary/10">
          {onWhatsApp && (
            <NeoButton
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
              className="flex-1 text-neo-success"
            >
              <MessageCircle size={16} />
              WhatsApp
            </NeoButton>
          )}
          {onEdit && (
            <NeoButton
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex-1"
            >
              <Edit size={16} />
              Editar
            </NeoButton>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Appointment Actions Component
interface AppointmentActionsProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWhatsApp: () => void;
  onStatusConfirm: () => void;
  onStatusComplete: () => void;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onWhatsApp,
  onStatusConfirm,
  onStatusComplete,
}) => {
  // Don't render if no appointment
  if (!appointment) return null;

  const actions = [
    {
      label: 'Enviar WhatsApp',
      icon: <MessageCircle size={20} className="text-neo-success" />,
      onClick: onWhatsApp,
    },
    ...(appointment.status === 'pending' ? [{
      label: 'Confirmar Agendamento',
      icon: <CheckCircle size={20} className="text-neo-success" />,
      onClick: onStatusConfirm,
    }] : []),
    ...(appointment.status === 'confirmed' ? [{
      label: 'Marcar como Concluído',
      icon: <CheckCircle size={20} className="text-neo-info" />,
      onClick: onStatusComplete,
    }] : []),
    {
      label: 'Editar',
      icon: <Edit size={20} className="text-neo-text" />,
      onClick: onEdit,
    },
    {
      label: 'Cancelar Agendamento',
      icon: <XCircle size={20} className="text-neo-danger" />,
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <ActionBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Ações do Agendamento"
      actions={actions}
    />
  );
};

// Appointment Details Modal
interface AppointmentDetailsProps {
  appointment: Appointment;
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  services,
  isOpen,
  onClose,
  onEdit,
}) => {
  // Don't render if no appointment
  if (!appointment) return null;

  const appointmentServices = appointment.services || [];
  const safeServices = services || [];

  const serviceDetails = appointmentServices.map(id =>
    safeServices.find(s => s.id === id)
  ).filter(Boolean);

  const isPending = appointment.status === 'pending';

  return (
    <ActionBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Agendamento"
      actions={[
        {
          label: 'Editar',
          icon: <Edit size={20} className="text-neo-text" />,
          onClick: onEdit,
        },
      ]}
    >
      <div className="space-y-4">
        {/* Client Info */}
        <div className="flex items-center gap-4">
          <Avatar name={appointment.clientName} size="lg" />
          <div>
            <h4 className="font-semibold text-neo-text text-lg">{appointment.clientName}</h4>
            <div className="flex items-center gap-1 text-sm text-neo-text-secondary">
              <Phone size={14} />
              <span>{appointment.clientPhone}</span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neo-bg rounded-neo shadow-neo-in p-3">
            <div className="flex items-center gap-2 text-neo-text-secondary mb-1">
              <Calendar size={14} />
              <span className="text-xs">Data</span>
            </div>
            <span className="font-semibold text-neo-text">
              {format(parseISO(appointment.date), 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="bg-neo-bg rounded-neo shadow-neo-in p-3">
            <div className="flex items-center gap-2 text-neo-text-secondary mb-1">
              <Clock size={14} />
              <span className="text-xs">Horário</span>
            </div>
            <span className="font-semibold text-neo-text">
              {formatTime(appointment.time)}
            </span>
          </div>
        </div>

        <Divider />

        {/* Services */}
        <div>
          <h5 className="text-sm font-semibold text-neo-text-secondary mb-2">Serviços</h5>
          <div className="space-y-2">
            {serviceDetails.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-neo-bg rounded-neo-sm shadow-neo-in p-3"
              >
                <span className="text-neo-text">{service.name}</span>
                <span className="text-neo-text-secondary">
                  {formatCurrency(service.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Payment */}
        <div className="bg-neo-bg rounded-neo shadow-neo-in p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={18} className="text-neo-accent" />
            <span className="font-semibold text-neo-text">Pagamento</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neo-text-secondary">Total</span>
              <span className="font-semibold">{formatCurrency(appointment.totalAmount)}</span>
            </div>
            {appointment.depositPaid > 0 && (
              <div className="flex justify-between">
                <span className="text-neo-text-secondary">Sinal pago</span>
                <span className="text-neo-success">{formatCurrency(appointment.depositPaid)}</span>
              </div>
            )}
            {isPending && appointment.depositPaid > 0 && (
              <div className="flex justify-between pt-2 border-t border-neo-text-secondary/10">
                <span className="text-neo-text-secondary">Saldo</span>
                <span className="font-semibold text-neo-warning">
                  {formatCurrency(appointment.totalAmount - appointment.depositPaid)}
                </span>
              </div>
            )}
          </div>

          {isPending && (
            <div className="mt-3 p-2 bg-neo-warning/10 rounded-neo-sm">
              <p className="text-xs text-neo-warning text-center">
                Aguardando confirmação do pagamento
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-center">
          <Badge
            variant={getStatusColor(appointment.status) as any}
            className="text-sm px-4 py-2"
          >
            {appointment.status === 'confirmed' ? 'Confirmado' :
              appointment.status === 'pending' ? 'Pendente' :
                appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
          </Badge>
        </div>
      </div>
    </ActionBottomSheet>
  );
};
