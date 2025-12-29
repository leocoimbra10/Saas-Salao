/**
 * BEAUTY SALON NEOMORPHIC APP - Services Management Page
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Heart,
  Save,
  X
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Service } from '../../../shared/types/types';
import { SERVICES_DATA } from '../../../shared/types/types';
import { Card, Button, Badge, Input, Toggle, Skeleton } from '../../../shared/components/ui/NeoComponents';
import { ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';

// Service Editor Modal
const ServiceEditor: React.FC<{
  service?: Service;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}> = ({ service, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    price: service?.price?.toString() || '',
    duration: service?.duration?.toString() || '',
    description: service?.description || '',
    category: service?.category || 'makeup',
    active: service?.active ?? true,
    hasDiscount: false,
    discountDays: [] as string[],
  });

  const handleSave = () => {
    onSave({
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      description: formData.description,
      category: formData.category as 'makeup' | 'hairstyle',
      active: formData.active,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ActionBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Editar Serviço' : 'Novo Serviço'}
      headerIcon={<Sparkles className="text-white" size={24} />}
      actions={[]}
    >
      <div className="space-y-4">
        {/* Category Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setFormData(prev => ({ ...prev, category: 'makeup' }))}
            className={cn(
              'flex-1 py-3 rounded-neo flex items-center justify-center gap-2 transition-all',
              formData.category === 'makeup'
                ? 'shadow-neo-pressed text-neo-accent'
                : 'shadow-neo-out text-neo-text-secondary'
            )}
          >
            <Sparkles size={18} />
            Maquiagem
          </button>
          <button
            onClick={() => setFormData(prev => ({ ...prev, category: 'hairstyle' }))}
            className={cn(
              'flex-1 py-3 rounded-neo flex items-center justify-center gap-2 transition-all',
              formData.category === 'hairstyle'
                ? 'shadow-neo-pressed text-neo-accent'
                : 'shadow-neo-out text-neo-text-secondary'
            )}
          >
            <Heart size={18} />
            Cabelo
          </button>
        </div>

        <Input
          label="Nome do Serviço"
          placeholder="Ex: Maquiagem Completa"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço (R$)"
            type="number"
            placeholder="0,00"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            icon={<DollarSign size={18} />}
          />
          <Input
            label="Duração (min)"
            type="number"
            placeholder="60"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            icon={<Clock size={18} />}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-neo-text-secondary mb-2">
            Descrição
          </label>
          <textarea
            className="w-full bg-neo-bg rounded-neo shadow-neo-in px-4 py-3 text-neo-text placeholder:text-neo-text-secondary outline-none focus:ring-2 focus:ring-neo-accent/20 transition-all resize-none h-20"
            placeholder="Descreva o serviço..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-neo-text font-medium">Serviço Ativo</span>
          <Toggle
            checked={formData.active}
            onChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
          />
        </div>

        {/* Discount Section */}
        <div className="py-3 border-t border-neo-text-secondary/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-neo-text font-medium">Desconto 10% OFF</span>
              <p className="text-xs text-neo-text-secondary">Aplicar em dias específicos</p>
            </div>
            <Toggle
              checked={formData.hasDiscount || false}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                hasDiscount: checked,
                discountDays: checked ? ['mon', 'tue', 'wed', 'thu'] : []
              }))}
            />
          </div>

          {formData.hasDiscount && (
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mon', label: 'Seg' },
                { id: 'tue', label: 'Ter' },
                { id: 'wed', label: 'Qua' },
                { id: 'thu', label: 'Qui' },
                { id: 'fri', label: 'Sex' },
                { id: 'sat', label: 'Sáb' },
              ].map(day => (
                <button
                  key={day.id}
                  onClick={() => {
                    const days = formData.discountDays || [];
                    setFormData(prev => ({
                      ...prev,
                      discountDays: days.includes(day.id)
                        ? days.filter(d => d !== day.id)
                        : [...days, day.id]
                    }));
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-neo text-sm transition-all',
                    (formData.discountDays || []).includes(day.id)
                      ? 'shadow-neo-pressed text-neo-success'
                      : 'shadow-neo-out text-neo-text-secondary'
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}

          {formData.hasDiscount && (formData.discountDays || []).length > 0 && (
            <p className="text-xs text-neo-success mt-2">
              💰 Preço com desconto: {formatCurrency(parseFloat(formData.price || '0') * 0.9)}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            <Save size={18} />
            Salvar
          </Button>
        </div>
      </div>
    </ActionBottomSheet>
  );
};

// Service List Item
const ServiceListItem: React.FC<{
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}> = ({ service, onEdit, onDelete, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        'bg-neo-bg rounded-neo p-4 transition-all duration-200',
        !service.active && 'opacity-50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-12 h-12 rounded-neo flex items-center justify-center',
            service.category === 'makeup'
              ? 'bg-neo-accent/10 text-neo-accent'
              : 'bg-neo-info/10 text-neo-info'
          )}>
            {service.category === 'makeup' ? <Sparkles size={24} /> : <Heart size={24} />}
          </div>

          <div>
            <h4 className="font-semibold text-neo-text">{service.name}</h4>
            <p className="text-xs text-neo-text-secondary mt-1 line-clamp-1">
              {service.description || 'Sem descrição'}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-neo-text-secondary flex items-center gap-1">
                <Clock size={12} />
                {service.duration} min
              </span>
              <Badge variant={service.category === 'makeup' ? 'warning' : 'info'}>
                {service.category === 'makeup' ? 'Maquiagem' : 'Cabelo'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="font-bold text-neo-text text-lg">
            {formatCurrency(service.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="w-8 h-8 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center text-neo-text-secondary active:shadow-neo-pressed transition-all"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center text-neo-danger active:shadow-neo-pressed transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neo-text-secondary/10">
        <span className="text-xs text-neo-text-secondary">
          {service.active ? 'Disponível para agendamento' : 'Indisponível'}
        </span>
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-1 text-sm font-medium transition-colors',
            service.active ? 'text-neo-success' : 'text-neo-text-secondary'
          )}
        >
          {service.active ? (
            <>
              <ToggleRight size={20} />
              Ativo
            </>
          ) : (
            <>
              <ToggleLeft size={20} />
              Inativo
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Statistics Card
const ServiceStats: React.FC<{ services: Service[] }> = ({ services }) => {
  const makeupServices = services.filter(s => s.category === 'makeup' && s.active);
  const hairstyleServices = services.filter(s => s.category === 'hairstyle' && s.active);
  const avgPrice = services.filter(s => s.active).reduce((sum, s) => sum + s.price, 0) / services.filter(s => s.active).length;
  const avgDuration = services.filter(s => s.active).reduce((sum, s) => sum + s.duration, 0) / services.filter(s => s.active).length;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-neo-accent" />
          <span className="text-xs text-neo-text-secondary">Maquiagem</span>
        </div>
        <p className="text-xl font-bold text-neo-text">{makeupServices.length}</p>
        <p className="text-xs text-neo-text-secondary">serviços ativos</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={18} className="text-neo-info" />
          <span className="text-xs text-neo-text-secondary">Cabelos</span>
        </div>
        <p className="text-xl font-bold text-neo-text">{hairstyleServices.length}</p>
        <p className="text-xs text-neo-text-secondary">serviços ativos</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-neo-success" />
          <span className="text-xs text-neo-text-secondary">Preço Médio</span>
        </div>
        <p className="text-xl font-bold text-neo-text">{formatCurrency(avgPrice)}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-neo-warning" />
          <span className="text-xs text-neo-text-secondary">Duração Média</span>
        </div>
        <p className="text-xl font-bold text-neo-text">{Math.round(avgDuration)} min</p>
      </Card>
    </div>
  );
};

import { useBranding } from '../../organization/context/BrandingContext';
import { useServices, useServiceMutations } from '../hooks/useServices';

// Main Services Management Page
export const ServicesManagement: React.FC = () => {
  const { organization } = useBranding();
  const { data: services = [], isLoading } = useServices(organization?.id);
  const { createService, updateService, deleteService } = useServiceMutations(organization?.id);

  const [editingService, setEditingService] = useState<Service | undefined>();
  const [showEditor, setShowEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Service | undefined>();

  const handleSave = (data: Partial<Service>) => {
    if (editingService) {
      updateService({ id: editingService.id, data });
    } else {
      createService({
        ...data,
        active: data.active ?? true,
        orgId: organization?.id || '',
      } as any);
    }
    setEditingService(undefined);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteService(showDeleteConfirm.id);
      setShowDeleteConfirm(undefined);
    }
  };

  const handleToggle = (service: Service) => {
    updateService({ id: service.id, data: { active: !service.active } });
  };

  return (
    <div className="min-h-screen bg-neo-bg pb-24">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-display mb-2">Serviços</h1>
            <p className="text-caption">Gerencie seus serviços</p>
          </div>
          <button
            onClick={() => {
              setEditingService(undefined);
              setShowEditor(true);
            }}
            className={cn(
              "w-14 h-14 rounded-full",
              "bg-gradient-to-br from-brand-primary to-brand-gold",
              "text-white shadow-[0_8px_32px_rgba(232,160,184,0.5)]",
              "flex items-center justify-center",
              "hover:scale-110 hover:shadow-[0_12px_40px_rgba(232,160,184,0.6)] active:scale-95",
              "transition-all duration-300",
              "border-2 border-white/30 backdrop-blur-md"
            )}
            title="Adicionar Serviço"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>

        <ServiceStats services={services} />
      </header>

      {/* Content */}
      <main className="px-6">
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)
          ) : (
            services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ServiceListItem
                  service={service}
                  onEdit={() => {
                    setEditingService(service);
                    setShowEditor(true);
                  }}
                  onDelete={() => setShowDeleteConfirm(service)}
                  onToggle={() => handleToggle(service)}
                />
              </motion.div>
            ))
          )}
        </div>

        {services.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-neo-text-secondary" />
            </div>
            <p className="text-neo-text-secondary">Nenhum serviço cadastrado</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => setShowEditor(true)}
            >
              Adicionar Primeiro Serviço
            </Button>
          </div>
        )}
      </main>

      {/* Service Editor */}
      <ServiceEditor
        service={editingService}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingService(undefined);
        }}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ActionBottomSheet
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(undefined)}
        title="Excluir Serviço"
        actions={[]}
      >
        <div className="space-y-4">
          <p className="text-neo-text-secondary text-center">
            Tem certeza que deseja excluir "{showDeleteConfirm?.name}"?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(undefined)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <Trash2 size={18} />
              Excluir
            </Button>
          </div>
        </div>
      </ActionBottomSheet>
    </div>
  );
};

export default ServicesManagement;
