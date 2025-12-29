/**
 * BRIDAL SERVICES MANAGER
 * Full CRUD for bridal services with customizable fields
 * Style: Silent Luxury / Neomorphic
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    ChevronDown,
    GripVertical,
    DollarSign,
    Clock,
    Tag,
    Sparkles,
    Settings,
    Eye,
    EyeOff,
    Copy,
    Save
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Card, Badge, Toggle } from '../../../shared/components/ui/NeoComponents';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = ROSE; // Legacy alias
const GOLD_LIGHT = '#F5E6B3';

// Types
interface BridalService {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // minutes
    category: 'bride' | 'attendant' | 'mother' | 'trial' | 'package';
    isActive: boolean;
    hasDiscount: boolean;
    discountPercentage: number;
    customFields: CustomField[];
    order: number;
}

interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'toggle';
    value: string;
    options?: string[]; // For select type
}

// Heart icon component (defined before usage)
const Heart: React.FC<{ size: number }> = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

// Category Labels
const CATEGORY_LABELS: Record<BridalService['category'], { label: string; icon: React.ReactNode; color: string }> = {
    bride: { label: 'Noiva', icon: <Crown size={14} />, color: GOLD },
    attendant: { label: 'Acompanhante', icon: <Sparkles size={14} />, color: '#8B5CF6' },
    mother: { label: 'Mãe/Sogra', icon: <Heart size={14} />, color: '#EC4899' },
    trial: { label: 'Prova', icon: <Eye size={14} />, color: '#3B82F6' },
    package: { label: 'Pacote', icon: <Tag size={14} />, color: '#10B981' },
};

// Mock Data
const INITIAL_SERVICES: BridalService[] = [
    {
        id: '1',
        name: 'Noiva Dia D (Make + Hair)',
        description: 'Maquiagem completa e penteado para o grande dia',
        price: 850,
        duration: 180,
        category: 'bride',
        isActive: true,
        hasDiscount: false,
        discountPercentage: 0,
        customFields: [],
        order: 1,
    },
    {
        id: '2',
        name: 'Prova de Noiva',
        description: 'Teste de maquiagem e penteado antes do casamento',
        price: 350,
        duration: 120,
        category: 'trial',
        isActive: true,
        hasDiscount: true,
        discountPercentage: 15,
        customFields: [],
        order: 2,
    },
    {
        id: '3',
        name: 'Ensaio Pré-Wedding',
        description: 'Produção para sessão de fotos pré-casamento',
        price: 450,
        duration: 120,
        category: 'bride',
        isActive: true,
        hasDiscount: false,
        discountPercentage: 0,
        customFields: [],
        order: 3,
    },
    {
        id: '4',
        name: 'Acompanhante (Make + Hair)',
        description: 'Maquiagem e penteado para madrinhas/damas',
        price: 280,
        duration: 90,
        category: 'attendant',
        isActive: true,
        hasDiscount: false,
        discountPercentage: 0,
        customFields: [],
        order: 4,
    },
    {
        id: '5',
        name: 'Acompanhante (Make)',
        description: 'Apenas maquiagem para acompanhantes',
        price: 160,
        duration: 60,
        category: 'attendant',
        isActive: true,
        hasDiscount: false,
        discountPercentage: 0,
        customFields: [],
        order: 5,
    },
    {
        id: '6',
        name: 'Mãe da Noiva (Make + Hair)',
        description: 'Produção especial para a mãe da noiva',
        price: 350,
        duration: 120,
        category: 'mother',
        isActive: true,
        hasDiscount: false,
        discountPercentage: 0,
        customFields: [],
        order: 6,
    },
    {
        id: '7',
        name: 'Pacote Completo Noiva',
        description: 'Inclui prova + dia D + retoque',
        price: 1350,
        duration: 300,
        category: 'package',
        isActive: true,
        hasDiscount: true,
        discountPercentage: 10,
        customFields: [
            { id: 'f1', label: 'Inclui Retoque', type: 'toggle', value: 'true' },
            { id: 'f2', label: 'Qtd. de Provas', type: 'number', value: '2' },
        ],
        order: 7,
    },
];

// Service Card Component
const ServiceCard: React.FC<{
    service: BridalService;
    onEdit: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
    onDuplicate: () => void;
}> = ({ service, onEdit, onDelete, onToggleActive, onDuplicate }) => {
    const category = CATEGORY_LABELS[service.category];
    const finalPrice = service.hasDiscount
        ? service.price * (1 - service.discountPercentage / 100)
        : service.price;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                'bg-neo-bg rounded-neo p-4 transition-all',
                service.isActive ? 'shadow-neo-out' : 'shadow-neo-in opacity-60'
            )}
            style={{ borderLeft: `3px solid ${category.color}` }}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Drag Handle */}
                <div className="pt-1 cursor-grab text-neo-text-secondary/50 hover:text-neo-text-secondary">
                    <GripVertical size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neo-text truncate">{service.name}</h3>
                        {!service.isActive && (
                            <Badge variant="warning" className="text-xs">Inativo</Badge>
                        )}
                    </div>
                    <p className="text-sm text-neo-text-secondary mb-2 line-clamp-1">
                        {service.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                            {category.icon}
                            {category.label}
                        </span>
                        <span className="flex items-center gap-1 text-neo-text-secondary">
                            <Clock size={12} />
                            {service.duration}min
                        </span>
                        {service.hasDiscount && (
                            <span className="flex items-center gap-1 text-green-600">
                                <Tag size={12} />
                                -{service.discountPercentage}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Price */}
                <div className="text-right">
                    {service.hasDiscount && (
                        <span className="text-xs text-neo-text-secondary line-through">
                            {formatCurrency(service.price)}
                        </span>
                    )}
                    <p className="font-bold" style={{ color: GOLD }}>
                        {formatCurrency(finalPrice)}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-neo-text-secondary/10">
                <button
                    onClick={onToggleActive}
                    className="p-2 rounded-neo shadow-neo-out hover:shadow-neo-pressed transition-all"
                    title={service.isActive ? 'Desativar' : 'Ativar'}
                >
                    {service.isActive ? (
                        <EyeOff size={16} className="text-neo-text-secondary" />
                    ) : (
                        <Eye size={16} className="text-green-500" />
                    )}
                </button>
                <button
                    onClick={onDuplicate}
                    className="p-2 rounded-neo shadow-neo-out hover:shadow-neo-pressed transition-all"
                    title="Duplicar"
                >
                    <Copy size={16} className="text-neo-text-secondary" />
                </button>
                <button
                    onClick={onEdit}
                    className="p-2 rounded-neo shadow-neo-out hover:shadow-neo-pressed transition-all"
                    title="Editar"
                >
                    <Edit2 size={16} className="text-blue-500" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-neo shadow-neo-out hover:shadow-neo-pressed transition-all"
                    title="Excluir"
                >
                    <Trash2 size={16} className="text-red-500" />
                </button>
            </div>
        </motion.div>
    );
};

// Service Editor Modal
const ServiceEditorModal: React.FC<{
    service: BridalService | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: BridalService) => void;
}> = ({ service, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<BridalService>(
        service || {
            id: `service-${Date.now()}`,
            name: '',
            description: '',
            price: 0,
            duration: 60,
            category: 'bride',
            isActive: true,
            hasDiscount: false,
            discountPercentage: 0,
            customFields: [],
            order: 999,
        }
    );

    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');

    React.useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                id: `service-${Date.now()}`,
                name: '',
                description: '',
                price: 0,
                duration: 60,
                category: 'bride',
                isActive: true,
                hasDiscount: false,
                discountPercentage: 0,
                customFields: [],
                order: 999,
            });
        }
    }, [service, isOpen]);

    const addCustomField = () => {
        if (!newFieldLabel.trim()) return;
        setFormData({
            ...formData,
            customFields: [
                ...formData.customFields,
                {
                    id: `field-${Date.now()}`,
                    label: newFieldLabel,
                    type: newFieldType,
                    value: newFieldType === 'toggle' ? 'false' : '',
                    options: newFieldType === 'select' ? ['Opção 1', 'Opção 2'] : undefined,
                },
            ],
        });
        setNewFieldLabel('');
    };

    const removeCustomField = (fieldId: string) => {
        setFormData({
            ...formData,
            customFields: formData.customFields.filter(f => f.id !== fieldId),
        });
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` }}
                        >
                            {service ? <Edit2 size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
                        </div>
                        <h2 className="text-lg font-bold text-neo-text">
                            {service ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-neo shadow-neo-out">
                        <X size={18} className="text-neo-text-secondary" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neo-text mb-2">Nome do Serviço *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Noiva Dia D (Make + Hair)"
                            className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text placeholder:text-neo-text-secondary/50 focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-neo-text mb-2">Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva o serviço..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text placeholder:text-neo-text-secondary/50 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Price & Duration */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-neo-text mb-2">Preço (R$) *</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-10 pr-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neo-text mb-2">Duração (min)</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-text-secondary" />
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                                    step={15}
                                    className="w-full pl-10 pr-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category - Dropdown Selector */}
                    <div>
                        <label className="block text-sm font-medium text-neo-text mb-2">Categoria</label>
                        <div className="relative">
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as BridalService['category'] })}
                                className="w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg text-neo-text appearance-none cursor-pointer focus:outline-none"
                                style={{ color: CATEGORY_LABELS[formData.category].color }}
                            >
                                {(Object.entries(CATEGORY_LABELS) as [BridalService['category'], typeof CATEGORY_LABELS[BridalService['category']]][]).map(([key, cat]) => (
                                    <option key={key} value={key}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-text-secondary pointer-events-none" />
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="bg-neo-bg rounded-neo shadow-neo-in p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-neo-text">Desconto</span>
                            <Toggle
                                checked={formData.hasDiscount}
                                onChange={(checked) => setFormData({ ...formData, hasDiscount: checked })}
                            />
                        </div>
                        {formData.hasDiscount && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    max={100}
                                    className="w-20 px-3 py-2 rounded-neo shadow-neo-in bg-neo-bg text-neo-text text-center focus:outline-none"
                                />
                                <span className="text-neo-text-secondary">%</span>
                                <span className="ml-auto text-sm text-green-600 font-medium">
                                    Preço final: {formatCurrency(formData.price * (1 - formData.discountPercentage / 100))}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Custom Fields */}
                    <div>
                        <label className="block text-sm font-medium text-neo-text mb-2" style={{ color: GOLD }}>
                            <Settings size={14} className="inline mr-1" />
                            Campos Personalizados
                        </label>
                        <div className="space-y-2 mb-3">
                            {formData.customFields.map((field) => (
                                <div key={field.id} className="flex items-center gap-2 p-2 bg-neo-bg rounded-neo shadow-neo-in">
                                    <span className="flex-1 text-sm text-neo-text">{field.label}</span>
                                    <span className="text-xs text-neo-text-secondary px-2 py-0.5 bg-neo-bg rounded-full shadow-neo-out">
                                        {field.type}
                                    </span>
                                    <button
                                        onClick={() => removeCustomField(field.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFieldLabel}
                                onChange={(e) => setNewFieldLabel(e.target.value)}
                                placeholder="Nome do campo"
                                className="flex-1 px-3 py-2 rounded-neo shadow-neo-in bg-neo-bg text-neo-text text-sm focus:outline-none"
                            />
                            <select
                                value={newFieldType}
                                onChange={(e) => setNewFieldType(e.target.value as CustomField['type'])}
                                className="px-3 py-2 rounded-neo shadow-neo-in bg-neo-bg text-neo-text text-sm focus:outline-none"
                            >
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="toggle">Sim/Não</option>
                                <option value="select">Seleção</option>
                            </select>
                            <button
                                onClick={addCustomField}
                                disabled={!newFieldLabel.trim()}
                                className={cn(
                                    "px-3 py-2 rounded-neo font-medium text-sm transition-all",
                                    newFieldLabel.trim()
                                        ? "shadow-neo-out bg-neo-bg text-neo-accent active:shadow-neo-pressed cursor-pointer"
                                        : "shadow-neo-in bg-neo-bg/50 text-neo-text-secondary/40 cursor-not-allowed"
                                )}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 bg-neo-bg rounded-neo shadow-neo-in">
                        <span className="font-medium text-neo-text">Serviço Ativo</span>
                        <Toggle
                            checked={formData.isActive}
                            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => onSave(formData)}
                        className="flex-1 btn-glass-glow"
                    >
                        <Save size={18} />
                        Salvar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-neo shadow-neo-out text-neo-text-secondary font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Filter Dropdown Component - Collapsible
const FilterDropdown: React.FC<{
    filterCategory: BridalService['category'] | 'all';
    setFilterCategory: (cat: BridalService['category'] | 'all') => void;
    showInactive: boolean;
    setShowInactive: (show: boolean) => void;
}> = ({ filterCategory, setFilterCategory, showInactive, setShowInactive }) => {
    const [isOpen, setIsOpen] = useState(false);

    const currentLabel = filterCategory === 'all'
        ? 'Todos os Serviços'
        : CATEGORY_LABELS[filterCategory].label;

    const currentColor = filterCategory === 'all'
        ? GOLD
        : CATEGORY_LABELS[filterCategory].color;

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full px-4 py-3 rounded-neo flex items-center justify-between transition-all',
                    isOpen ? 'shadow-neo-pressed' : 'shadow-neo-out'
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: currentColor }}>
                        {filterCategory !== 'all' && CATEGORY_LABELS[filterCategory].icon}
                    </span>
                    <span className="text-neo-text font-medium">{currentLabel}</span>
                    {filterCategory !== 'all' && (
                        <span className="text-xs text-neo-text-secondary">
                            (filtrado)
                        </span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={18} className="text-neo-text-secondary" />
                </motion.div>
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-neo-bg rounded-neo shadow-neo-out-lg z-20 overflow-hidden"
                    >
                        <div className="p-3 space-y-2">
                            {/* All Option */}
                            <button
                                onClick={() => { setFilterCategory('all'); setIsOpen(false); }}
                                className={cn(
                                    'w-full px-3 py-2 rounded-neo text-left text-sm font-medium flex items-center gap-2 transition-all',
                                    filterCategory === 'all'
                                        ? 'shadow-neo-pressed text-neo-accent bg-neo-accent/5'
                                        : 'shadow-neo-out hover:shadow-neo-flat text-neo-text-secondary'
                                )}
                            >
                                <Check size={14} className={filterCategory === 'all' ? 'opacity-100' : 'opacity-0'} />
                                Todos os Serviços
                            </button>

                            {/* Category Options */}
                            {(Object.entries(CATEGORY_LABELS) as [BridalService['category'], typeof CATEGORY_LABELS[BridalService['category']]][]).map(([key, cat]) => (
                                <button
                                    key={key}
                                    onClick={() => { setFilterCategory(key); setIsOpen(false); }}
                                    className={cn(
                                        'w-full px-3 py-2 rounded-neo text-left text-sm font-medium flex items-center gap-2 transition-all',
                                        filterCategory === key
                                            ? 'shadow-neo-pressed bg-neo-accent/5'
                                            : 'shadow-neo-out hover:shadow-neo-flat'
                                    )}
                                    style={{ color: filterCategory === key ? cat.color : undefined }}
                                >
                                    <Check size={14} className={filterCategory === key ? 'opacity-100' : 'opacity-0'} style={{ color: cat.color }} />
                                    <span style={{ color: cat.color }}>{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-neo-text-secondary/10 my-2" />

                            {/* Show Inactive Toggle */}
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className="text-sm text-neo-text-secondary">Mostrar inativos</span>
                                <Toggle checked={showInactive} onChange={setShowInactive} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

// Main Bridal Services Manager Component
export const BridalServicesManager: React.FC = () => {
    const [services, setServices] = useState<BridalService[]>(INITIAL_SERVICES);
    const [selectedService, setSelectedService] = useState<BridalService | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [filterCategory, setFilterCategory] = useState<BridalService['category'] | 'all'>('all');
    const [showInactive, setShowInactive] = useState(true);

    const filteredServices = services
        .filter(s => filterCategory === 'all' || s.category === filterCategory)
        .filter(s => showInactive || s.isActive)
        .sort((a, b) => a.order - b.order);

    const handleAddService = () => {
        setSelectedService(null);
        setShowEditor(true);
    };

    const handleEditService = (service: BridalService) => {
        setSelectedService(service);
        setShowEditor(true);
    };

    const handleSaveService = (service: BridalService) => {
        if (selectedService) {
            // Edit existing
            setServices(services.map(s => s.id === service.id ? service : s));
        } else {
            // Add new
            setServices([...services, { ...service, order: services.length + 1 }]);
        }
        setShowEditor(false);
    };

    const handleDeleteService = (serviceId: string) => {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            setServices(services.filter(s => s.id !== serviceId));
        }
    };

    const handleToggleActive = (serviceId: string) => {
        setServices(services.map(s =>
            s.id === serviceId ? { ...s, isActive: !s.isActive } : s
        ));
    };

    const handleDuplicate = (service: BridalService) => {
        const duplicated: BridalService = {
            ...service,
            id: `service-${Date.now()}`,
            name: `${service.name} (Cópia)`,
            order: services.length + 1,
        };
        setServices([...services, duplicated]);
    };

    // Stats
    const activeCount = services.filter(s => s.isActive).length;
    const totalValue = services.reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-neo shadow-neo-out flex items-center justify-center"
                        style={{ backgroundColor: GOLD_LIGHT }}
                    >
                        <Crown size={24} style={{ color: GOLD }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-neo-text">Serviços de Noivas</h2>
                        <p className="text-sm text-neo-text-secondary">
                            {activeCount} ativos · Total: {formatCurrency(totalValue)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleAddService}
                    className="btn-glass-glow px-4"
                >
                    <Plus size={18} />
                    Novo
                </button>
            </div>

            {/* Filters - Collapsible Dropdown */}
            <div className="mb-4">
                <FilterDropdown
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    showInactive={showInactive}
                    setShowInactive={setShowInactive}
                />
            </div>

            {/* Services List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onEdit={() => handleEditService(service)}
                            onDelete={() => handleDeleteService(service.id)}
                            onToggleActive={() => handleToggleActive(service.id)}
                            onDuplicate={() => handleDuplicate(service)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filteredServices.length === 0 && (
                <div className="text-center py-12">
                    <Crown size={48} className="mx-auto mb-4 text-neo-text-secondary/30" />
                    <p className="text-neo-text-secondary">Nenhum serviço encontrado</p>
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <ServiceEditorModal
                        service={selectedService}
                        isOpen={showEditor}
                        onClose={() => setShowEditor(false)}
                        onSave={handleSaveService}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BridalServicesManager;
