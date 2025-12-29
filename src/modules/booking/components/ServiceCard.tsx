/**
 * BEAUTY SALON NEOMORPHIC APP - Service Card Component
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatCurrency, isWeekdayDiscount, getWeekday } from '../../../shared/lib/utils';
import { Service } from '../../../shared/types/types';
import { Badge, Checkbox, NeoButton } from '../../../shared/components/ui/NeoComponents';
import { Clock, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showDiscount?: boolean;
  date?: Date;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selected = false,
  onSelect,
  showDiscount = false,
  date,
  className,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const isDiscounted = date ? isWeekdayDiscount(getWeekday(date)) : false;
  const displayPrice = service.price;
  const originalPrice = isDiscounted ? service.price * 1.1 : service.price;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(!selected)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        'relative p-4 rounded-neo transition-all duration-200 cursor-pointer',
        selected
          ? 'bg-neo-bg shadow-neo-pressed border-2 border-neo-accent'
          : 'bg-neo-bg shadow-neo-out hover:shadow-neo-out-lg',
        isPressed && !selected && 'shadow-neo-pressed',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            {service.category === 'makeup' ? (
              <Sparkles size={14} className="text-neo-accent" />
            ) : (
              <Clock size={14} className="text-neo-info" />
            )}
            <Badge variant={service.category === 'makeup' ? 'warning' : 'info'}>
              {service.category === 'makeup' ? 'Maquiagem' : 'Cabelo'}
            </Badge>
            {isDiscounted && showDiscount && (
              <Badge variant="success">10% OFF</Badge>
            )}
          </div>

          {/* Service Name */}
          <h4 className={cn(
            'font-semibold text-neo-text',
            selected && 'text-neo-accent'
          )}>
            {service.name}
          </h4>

          {/* Description */}
          {service.description && (
            <p className="text-xs text-neo-text-secondary mt-1">
              {service.description}
            </p>
          )}

          {/* Duration */}
          <div className="flex items-center gap-1 mt-2 text-xs text-neo-text-secondary">
            <Clock size={12} />
            <span>{service.duration} min</span>
          </div>
        </div>

        {/* Price & Selection */}
        <div className="flex flex-col items-end gap-2">
          <div className={cn(
            'text-right',
            selected ? 'text-neo-accent' : 'text-neo-text'
          )}>
            {isDiscounted && showDiscount && (
              <span className="text-xs text-neo-text-secondary line-through mr-2">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="font-bold text-lg">
              {formatCurrency(displayPrice)}
            </span>
          </div>

          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
            selected
              ? 'bg-neo-accent text-white shadow-neo-pressed'
              : 'bg-neo-bg shadow-neo-out'
          )}>
            {selected && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Service List Component
interface ServiceListProps {
  services: Service[];
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
  date?: Date;
  className?: string;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  selectedServices,
  onToggleService,
  date,
  className,
}) => {
  const makeupServices = services.filter(s => s.category === 'makeup' && s.active);
  const hairstyleServices = services.filter(s => s.category === 'hairstyle' && s.active);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Makeup Section */}
      <div>
        <h3 className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-neo-accent" />
          Maquiagem
        </h3>
        <div className="space-y-3">
          {makeupServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedServices.includes(service.id)}
              onSelect={() => onToggleService(service.id)}
              showDiscount={true}
              date={date}
            />
          ))}
        </div>
      </div>

      {/* Hairstyle Section */}
      <div>
        <h3 className="text-sm font-semibold text-neo-text-secondary mb-3 flex items-center gap-2">
          <Clock size={16} className="text-neo-info" />
          Cabelos
        </h3>
        <div className="space-y-3">
          {hairstyleServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedServices.includes(service.id)}
              onSelect={() => onToggleService(service.id)}
              showDiscount={true}
              date={date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Service Summary Component (for booking flow)
interface ServiceSummaryProps {
  services: Service[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export const ServiceSummary: React.FC<ServiceSummaryProps> = ({
  services,
  selectedIds,
  onRemove,
  onAction,
  actionLabel = 'Continuar',
  className,
}) => {
  const selectedServices = services.filter(s => selectedIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discount = subtotal * 0.10;
  const total = subtotal - discount;
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-neo-bg rounded-neo shadow-neo-out p-4', className)}>
      <h4 className="font-semibold text-neo-text mb-3">Resumo dos Serviços</h4>

      {/* Selected Services */}
      <div className="space-y-2 mb-4">
        {selectedServices.map(service => (
          <div
            key={service.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(service.id)}
                className="w-5 h-5 rounded-full bg-neo-danger/10 text-neo-danger flex items-center justify-center text-xs hover:bg-neo-danger hover:text-white transition-colors"
              >
                ×
              </button>
              <span className="text-neo-text">{service.name}</span>
            </div>
            <span className="text-neo-text-secondary">{formatCurrency(service.price)}</span>
          </div>
        ))}
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm text-neo-text-secondary mb-3 pb-3 border-b border-neo-text-secondary/10">
        <Clock size={14} />
        <span>Duração total: {totalDuration} min</span>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-neo-text-secondary">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-neo-success">
            <span>Desconto (10%)</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-neo-text pt-2 border-t border-neo-text-secondary/10">
          <span>Total</span>
          <span className="text-neo-accent">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action Button */}
      {onAction && (
        <NeoButton
          variant="gradient"
          onClick={onAction}
          className="w-full mt-6 shadow-neo-accent/20"
        >
          {actionLabel}
        </NeoButton>
      )}
    </div>
  );
};
