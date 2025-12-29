/**
 * APPOINTMENT EDITOR COMPONENT
 * Professional appointment editing modal with all fields
 * Style: Neomorphic Light Theme
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    User,
    Users,
    Search,
    Plus,
    Trash2,
    Tag,
    FileText,
    Bell,
    ChevronDown,
    DollarSign,
    Sparkles,
    Scissors,
    Save
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { NeoCard, NeoButton, Badge, NeoInput, NeoSelect, Toggle, NeoTextarea } from '../ui/NeoComponents';

// Types
interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
}

interface AppointmentData {
    id?: string;
    clientName: string;
    clientPhone: string;
    professionalId: string;
    date: string;
    time: string;
    endTime: string;
    services: Service[];
    duration: number;
    totalAmount: number;
    depositPaid: number;
    discount: number;
    notes: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

// Mock Data
const PROFESSIONALS = [
    { id: '1', name: 'Marcela Maquiadora' },
    { id: '2', name: 'Vitória Maquiadora' },
    { id: '3', name: 'Dani Cabelereira' },
];

const AVAILABLE_SERVICES: Service[] = [
    { id: '1', name: 'Maquiagem Social', price: 160, duration: 60 },
    { id: '2', name: 'Maquiagem Glamour', price: 220, duration: 90 },
    { id: '3', name: 'Penteado Coque', price: 140, duration: 45 },
    { id: '4', name: 'Semi-preso', price: 110, duration: 40 },
    { id: '5', name: 'Ondas Hollywood', price: 130, duration: 45 },
    { id: '6', name: 'Combo Completo', price: 280, duration: 120 },
];

const TIME_OPTIONS = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}).filter(t => t <= '22:00');

// Service Selector Modal
const ServiceSelector: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (service: Service) => void;
    selectedIds: string[];
}> = ({ isOpen, onClose, onSelect, selectedIds }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = AVAILABLE_SERVICES.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedIds.includes(s.id)
    );

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full max-w-lg bg-neo-bg rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neo-text">Adicionar Serviço</h3>
                    <button onClick={onClose}>
                        <X size={20} className="text-neo-text-secondary" />
                    </button>
                </div>

                <div className="mb-4">
                    <NeoInput
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar serviço..."
                        icon={<Search size={18} />}
                    />
                </div>

                <div className="space-y-2">
                    {filteredServices.map(service => (
                        <button
                            key={service.id}
                            onClick={() => {
                                onSelect(service);
                                onClose();
                            }}
                            className="w-full p-4 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-between active:shadow-neo-pressed transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-neo shadow-neo-in flex items-center justify-center">
                                    {service.name.includes('Maquiagem') ? (
                                        <Sparkles size={18} className="text-neo-accent" />
                                    ) : (
                                        <Scissors size={18} className="text-neo-info" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-neo-text">{service.name}</p>
                                    <p className="text-xs text-neo-text-secondary">{service.duration} min</p>
                                </div>
                            </div>
                            <span className="font-bold text-neo-accent">{formatCurrency(service.price)}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main Appointment Editor Component
export const AppointmentEditor: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AppointmentData) => void;
    initialData?: Partial<AppointmentData>;
}> = ({ isOpen, onClose, onSave, initialData }) => {
    const [showServiceSelector, setShowServiceSelector] = useState(false);
    const [showMoreFields, setShowMoreFields] = useState(false);
    const [showDiscountInput, setShowDiscountInput] = useState(false);

    const [data, setData] = useState<AppointmentData>({
        id: initialData?.id,
        clientName: initialData?.clientName || '',
        clientPhone: initialData?.clientPhone || '',
        professionalId: initialData?.professionalId || '1',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        time: initialData?.time || '09:00',
        endTime: initialData?.endTime || '11:00',
        services: initialData?.services || [],
        duration: initialData?.duration || 120,
        totalAmount: initialData?.totalAmount || 0,
        depositPaid: initialData?.depositPaid || 0,
        discount: initialData?.discount || 0,
        notes: initialData?.notes || '',
        status: initialData?.status || 'scheduled',
    });

    // Calculate totals
    useEffect(() => {
        const servicesTotal = data.services.reduce((sum, s) => sum + s.price, 0);
        const totalDuration = data.services.reduce((sum, s) => sum + s.duration, 0);

        setData(prev => ({
            ...prev,
            totalAmount: servicesTotal - prev.discount,
            duration: totalDuration || prev.duration,
        }));
    }, [data.services, data.discount]);

    const handleAddService = (service: Service) => {
        setData(prev => ({
            ...prev,
            services: [...prev.services, service],
        }));
    };

    const handleRemoveService = (serviceId: string) => {
        setData(prev => ({
            ...prev,
            services: prev.services.filter(s => s.id !== serviceId),
        }));
    };

    const handleSave = () => {
        onSave(data);
        onClose();
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-lg bg-neo-bg rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-neo-text-secondary/10 flex items-center justify-between">
                        <button onClick={onClose} className="text-neo-accent font-medium text-sm">
                            Fechar
                        </button>
                        <h2 className="font-semibold text-neo-text">
                            {initialData?.id ? 'Editando Atendimento' : 'Novo Atendimento'}
                        </h2>
                        <button className="p-2">
                            <Bell size={18} className="text-neo-text-secondary" />
                        </button>
                    </div>

                    {/* Time Badge */}
                    <div className="flex justify-center py-3">
                        <div className="px-4 py-2 bg-neo-accent text-white rounded-full text-sm font-medium">
                            {data.time} - {data.endTime}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <NeoInput
                                    label="Data"
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData(prev => ({ ...prev, date: e.target.value }))}
                                    className="text-sm"
                                    helperText={formatDate(data.date).split(',')[0]}
                                />
                            </div>
                            <div>
                                <NeoSelect
                                    label="Horário"
                                    value={data.time}
                                    onChange={e => setData(prev => ({ ...prev, time: e.target.value }))}
                                    options={TIME_OPTIONS.map(time => ({ value: time, label: time }))}
                                    className="text-sm"
                                />
                            </div>
                        </div>

                        {/* Professional */}
                        <div>
                            <NeoSelect
                                label="Profissional"
                                value={data.professionalId}
                                onChange={e => setData(prev => ({ ...prev, professionalId: e.target.value }))}
                                options={PROFESSIONALS.map(pro => ({ value: pro.id, label: pro.name }))}
                            />
                        </div>

                        {/* Client */}
                        <div>
                            <NeoInput
                                label="Cliente"
                                type="text"
                                value={data.clientName}
                                onChange={e => setData(prev => ({ ...prev, clientName: e.target.value }))}
                                placeholder="Nome do cliente"
                                icon={<Search size={18} />}
                            />
                        </div>

                        {/* Services Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs text-neo-text-secondary">Serviços</label>
                                <button
                                    onClick={() => {/* TODO: Nova Comanda */ }}
                                    className="text-xs text-neo-accent font-medium px-3 py-1 rounded-neo shadow-neo-out"
                                >
                                    Nova Comanda
                                </button>
                            </div>

                            {data.services.map(service => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-3 bg-neo-bg rounded-neo shadow-neo-out mb-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neo-text">{service.name}</span>
                                        <Search size={14} className="text-neo-text-secondary" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-neo-text">{formatCurrency(service.price)}</span>
                                        <button
                                            onClick={() => handleRemoveService(service.id)}
                                            className="p-1 text-neo-danger"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setShowServiceSelector(true)}
                                className="flex items-center gap-2 text-neo-success text-sm font-medium py-2"
                            >
                                <Plus size={16} />
                                Adicionar Item
                            </button>

                            {/* Total */}
                            <div className="flex justify-end mt-2">
                                <span className="text-sm text-neo-text-secondary mr-2">Total:</span>
                                <span className="font-bold text-neo-text">{formatCurrency(data.totalAmount + data.discount)}</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <NeoSelect
                                label="Duração (Valor padrão baseado no serviço)"
                                value={data.duration}
                                onChange={e => setData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                options={[
                                    { value: '30', label: '30 min' },
                                    { value: '60', label: '1h' },
                                    { value: '90', label: '1h30' },
                                    { value: '120', label: '2h' },
                                    { value: '150', label: '2h30' },
                                    { value: '180', label: '3h' },
                                ]}
                            />
                        </div>

                        {/* More Fields Toggle */}
                        <button
                            onClick={() => setShowMoreFields(!showMoreFields)}
                            className="text-neo-accent text-sm font-medium"
                        >
                            {showMoreFields ? 'Menos campos' : 'Mais campos (Observação, outros...)'}
                        </button>

                        <AnimatePresence>
                            {showMoreFields && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    <div>
                                        <div>
                                            <NeoInput
                                                label="Telefone"
                                                type="tel"
                                                value={data.clientPhone}
                                                onChange={e => setData(prev => ({ ...prev, clientPhone: e.target.value }))}
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <NeoTextarea
                                                label="Observações"
                                                value={data.notes}
                                                onChange={e => setData(prev => ({ ...prev, notes: e.target.value }))}
                                                placeholder="Observações sobre o atendimento..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Discount */}
                        <button
                            onClick={() => setShowDiscountInput(!showDiscountInput)}
                            className="text-neo-accent text-sm font-medium"
                        >
                            Aplicar desconto
                        </button>

                        <AnimatePresence>
                            {showDiscountInput && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-3">
                                        <NeoInput
                                            type="number"
                                            value={data.discount}
                                            onChange={e => setData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                            placeholder="Valor do desconto"
                                            className="flex-1"
                                        />
                                        <span className="text-neo-success font-medium">
                                            Total: {formatCurrency(data.totalAmount)}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-neo-text-secondary/10">
                        <NeoButton
                            variant="gradient"
                            className="w-full"
                            onClick={handleSave}
                        >
                            <Save size={18} />
                            Salvar
                        </NeoButton>
                    </div>
                </motion.div>
            </motion.div>

            {/* Service Selector */}
            <AnimatePresence>
                {showServiceSelector && (
                    <ServiceSelector
                        isOpen={showServiceSelector}
                        onClose={() => setShowServiceSelector(false)}
                        onSelect={handleAddService}
                        selectedIds={data.services.map(s => s.id)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AppointmentEditor;
