/**
 * BRIDAL ANAMNESIS FORM
 * Digital questionnaire for bridal clients - skin analysis, health, preferences
 * Style: Light Neomorphism with Glassmorphism accents
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Droplets,
    Eye,
    Heart,
    Sparkles,
    Shield,
    Save,
    X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { NeoCard, NeoButton, Badge, Progress } from '../ui/NeoComponents';

// Types
export interface AnamnesisData {
    // Skin Analysis
    skinType: 'dry' | 'oily' | 'combination' | 'sensitive' | '';
    skinConcerns: string[];
    currentRoutine: string;
    recentTreatments: string[];

    // Health & Safety
    allergies: {
        latex: boolean;
        makeupBrands: string;
        others: string;
    };
    eyeSensitivity: boolean;
    usesContacts: boolean;
    skinConditions: string[];

    // Style Preferences
    preferredFinish: 'matte' | 'glow' | 'natural' | '';
    focalPoint: 'eyes' | 'lips' | 'balanced' | '';
    dailyMakeupHabits: string;
    inspirationNotes: string;

    // Trial Notes (Pro Only)
    trialNotes: string;
    productsUsed: string;
    foundationShade: string;

    // Meta
    completedAt?: Date;
    lastUpdated?: Date;
}

const INITIAL_DATA: AnamnesisData = {
    skinType: '',
    skinConcerns: [],
    currentRoutine: '',
    recentTreatments: [],
    allergies: { latex: false, makeupBrands: '', others: '' },
    eyeSensitivity: false,
    usesContacts: false,
    skinConditions: [],
    preferredFinish: '',
    focalPoint: '',
    dailyMakeupHabits: '',
    inspirationNotes: '',
    trialNotes: '',
    productsUsed: '',
    foundationShade: '',
};

const SKIN_TYPES = [
    { id: 'dry', label: 'Seca', icon: '💧' },
    { id: 'oily', label: 'Oleosa', icon: '✨' },
    { id: 'combination', label: 'Mista', icon: '🔄' },
    { id: 'sensitive', label: 'Sensível', icon: '🌸' },
];

const SKIN_CONCERNS = [
    'Manchas', 'Acne', 'Rugas', 'Poros Dilatados',
    'Olheiras', 'Rosácea', 'Melasma', 'Ressecamento'
];

const RECENT_TREATMENTS = [
    'Ácidos', 'Peeling', 'Laser', 'Botox',
    'Preenchimento', 'Microagulhamento', 'Limpeza de Pele'
];

const SKIN_CONDITIONS = [
    'Rosácea', 'Acne Ativa', 'Dermatite', 'Psoríase',
    'Herpes Labial', 'Eczema', 'Vitiligo'
];

// Selection Pill Component
const SelectionPill: React.FC<{
    label: string;
    icon?: string;
    isSelected: boolean;
    onClick: () => void;
    warning?: boolean;
}> = ({ label, icon, isSelected, onClick, warning }) => (
    <button
        onClick={onClick}
        className={cn(
            'px-4 py-2 rounded-neo text-sm font-medium transition-all flex items-center gap-2',
            isSelected
                ? warning
                    ? 'shadow-neo-pressed bg-red-100 text-red-600'
                    : 'shadow-neo-pressed text-neo-accent'
                : 'shadow-neo-out text-neo-text-secondary hover:text-neo-text'
        )}
    >
        {icon && <span>{icon}</span>}
        {label}
    </button>
);

// Text Input with Neomorphic Style
const NeoInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
}> = ({ label, value, onChange, placeholder, multiline }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-neo-text-secondary mb-2">
            {label}
        </label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-neo-bg rounded-neo shadow-neo-in text-neo-text resize-none"
                rows={3}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-neo-bg rounded-neo shadow-neo-in text-neo-text"
            />
        )}
    </div>
);

// Toggle Switch
const NeoToggle: React.FC<{
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    warning?: boolean;
}> = ({ label, description, checked, onChange, warning }) => (
    <button
        onClick={() => onChange(!checked)}
        className="w-full p-4 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-between active:shadow-neo-pressed transition-all mb-3"
    >
        <div>
            <p className={cn('font-medium', warning && checked ? 'text-red-600' : 'text-neo-text')}>
                {warning && checked && <AlertTriangle size={14} className="inline mr-2" />}
                {label}
            </p>
            {description && <p className="text-xs text-neo-text-secondary">{description}</p>}
        </div>
        <div className={cn(
            'w-12 h-6 rounded-full p-1 transition-colors',
            checked
                ? warning ? 'bg-red-500' : 'bg-neo-accent'
                : 'bg-neo-bg shadow-neo-in'
        )}>
            <motion.div
                animate={{ x: checked ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-white shadow-md"
            />
        </div>
    </button>
);

// Step Components
const Step1SkinAnalysis: React.FC<{
    data: AnamnesisData;
    updateData: (updates: Partial<AnamnesisData>) => void;
}> = ({ data, updateData }) => (
    <div>
        <div className="flex items-center gap-2 mb-6">
            <Droplets size={20} className="text-neo-accent" />
            <h2 className="text-xl font-semibold text-neo-text">Análise de Pele</h2>
        </div>

        <p className="text-sm text-neo-text-secondary mb-4">Qual é o seu tipo de pele?</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
            {SKIN_TYPES.map(type => (
                <SelectionPill
                    key={type.id}
                    label={type.label}
                    icon={type.icon}
                    isSelected={data.skinType === type.id}
                    onClick={() => updateData({ skinType: type.id as AnamnesisData['skinType'] })}
                />
            ))}
        </div>

        <p className="text-sm text-neo-text-secondary mb-4">Quais são suas preocupações? (selecione todas)</p>
        <div className="flex flex-wrap gap-2 mb-6">
            {SKIN_CONCERNS.map(concern => (
                <SelectionPill
                    key={concern}
                    label={concern}
                    isSelected={data.skinConcerns.includes(concern)}
                    onClick={() => {
                        const newConcerns = data.skinConcerns.includes(concern)
                            ? data.skinConcerns.filter(c => c !== concern)
                            : [...data.skinConcerns, concern];
                        updateData({ skinConcerns: newConcerns });
                    }}
                />
            ))}
        </div>

        <NeoInput
            label="Qual sua rotina atual de skincare?"
            value={data.currentRoutine}
            onChange={(value) => updateData({ currentRoutine: value })}
            placeholder="Ex: Sabonete, tônico, hidratante..."
            multiline
        />

        <p className="text-sm text-neo-text-secondary mb-4">Tratamentos recentes (últimos 30 dias)</p>
        <div className="flex flex-wrap gap-2">
            {RECENT_TREATMENTS.map(treatment => (
                <SelectionPill
                    key={treatment}
                    label={treatment}
                    isSelected={data.recentTreatments.includes(treatment)}
                    onClick={() => {
                        const newTreatments = data.recentTreatments.includes(treatment)
                            ? data.recentTreatments.filter(t => t !== treatment)
                            : [...data.recentTreatments, treatment];
                        updateData({ recentTreatments: newTreatments });
                    }}
                />
            ))}
        </div>
    </div>
);

const Step2HealthSafety: React.FC<{
    data: AnamnesisData;
    updateData: (updates: Partial<AnamnesisData>) => void;
}> = ({ data, updateData }) => (
    <div>
        <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-neo-accent" />
            <h2 className="text-xl font-semibold text-neo-text">Saúde & Segurança</h2>
        </div>

        <NeoCard className="p-4 mb-6 border-2 border-red-200 bg-red-50/50">
            <p className="text-sm text-red-700 font-medium mb-4">
                <AlertTriangle size={16} className="inline mr-2" />
                Alergias e Sensibilidades
            </p>

            <NeoToggle
                label="Alergia a Látex"
                description="Luvas e alguns pincéis contêm látex"
                checked={data.allergies.latex}
                onChange={(checked) => updateData({
                    allergies: { ...data.allergies, latex: checked }
                })}
                warning
            />

            <NeoInput
                label="Alergia a marcas de maquiagem?"
                value={data.allergies.makeupBrands}
                onChange={(value) => updateData({
                    allergies: { ...data.allergies, makeupBrands: value }
                })}
                placeholder="Ex: MAC, Ruby Rose..."
            />

            <NeoInput
                label="Outras alergias"
                value={data.allergies.others}
                onChange={(value) => updateData({
                    allergies: { ...data.allergies, others: value }
                })}
                placeholder="Fragrâncias, nickel, etc..."
            />
        </NeoCard>

        <NeoToggle
            label="Sensibilidade nos Olhos"
            description="Tendência a lacrimejamento ou irritação"
            checked={data.eyeSensitivity}
            onChange={(checked) => updateData({ eyeSensitivity: checked })}
        />

        <NeoToggle
            label="Usa Lentes de Contato"
            description="Importante para aplicação de maquiagem nos olhos"
            checked={data.usesContacts}
            onChange={(checked) => updateData({ usesContacts: checked })}
        />

        <p className="text-sm text-neo-text-secondary mb-4 mt-6">Condições de pele ativas</p>
        <div className="flex flex-wrap gap-2">
            {SKIN_CONDITIONS.map(condition => (
                <SelectionPill
                    key={condition}
                    label={condition}
                    isSelected={data.skinConditions.includes(condition)}
                    onClick={() => {
                        const newConditions = data.skinConditions.includes(condition)
                            ? data.skinConditions.filter(c => c !== condition)
                            : [...data.skinConditions, condition];
                        updateData({ skinConditions: newConditions });
                    }}
                    warning={data.skinConditions.includes(condition)}
                />
            ))}
        </div>
    </div>
);

const Step3StylePreferences: React.FC<{
    data: AnamnesisData;
    updateData: (updates: Partial<AnamnesisData>) => void;
}> = ({ data, updateData }) => (
    <div>
        <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-neo-accent" />
            <h2 className="text-xl font-semibold text-neo-text">Preferências de Estilo</h2>
        </div>

        <p className="text-sm text-neo-text-secondary mb-4">Acabamento preferido</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
            {[
                { id: 'matte', label: 'Matte', icon: '🪨' },
                { id: 'glow', label: 'Glow', icon: '✨' },
                { id: 'natural', label: 'Natural', icon: '🌿' },
            ].map(finish => (
                <SelectionPill
                    key={finish.id}
                    label={finish.label}
                    icon={finish.icon}
                    isSelected={data.preferredFinish === finish.id}
                    onClick={() => updateData({ preferredFinish: finish.id as AnamnesisData['preferredFinish'] })}
                />
            ))}
        </div>

        <p className="text-sm text-neo-text-secondary mb-4">Ponto focal do look</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
            {[
                { id: 'eyes', label: 'Olhos', icon: <Eye size={16} /> },
                { id: 'lips', label: 'Lábios', icon: <Heart size={16} /> },
                { id: 'balanced', label: 'Equilibrado', icon: <Sparkles size={16} /> },
            ].map(focal => (
                <button
                    key={focal.id}
                    onClick={() => updateData({ focalPoint: focal.id as AnamnesisData['focalPoint'] })}
                    className={cn(
                        'p-4 rounded-neo flex flex-col items-center gap-2 transition-all',
                        data.focalPoint === focal.id
                            ? 'shadow-neo-pressed text-neo-accent'
                            : 'shadow-neo-out text-neo-text-secondary'
                    )}
                >
                    {focal.icon}
                    <span className="text-sm font-medium">{focal.label}</span>
                </button>
            ))}
        </div>

        <NeoInput
            label="Como é sua rotina de maquiagem no dia a dia?"
            value={data.dailyMakeupHabits}
            onChange={(value) => updateData({ dailyMakeupHabits: value })}
            placeholder="Ex: Uso pouca maquiagem, apenas batom..."
            multiline
        />

        <NeoInput
            label="Inspirações ou referências"
            value={data.inspirationNotes}
            onChange={(value) => updateData({ inspirationNotes: value })}
            placeholder="Celebridades, estilos ou looks que admira..."
            multiline
        />
    </div>
);

// Main Anamnesis Form Component
export const AnamnesisForm: React.FC<{
    initialData?: AnamnesisData;
    onSave: (data: AnamnesisData) => void;
    onClose: () => void;
}> = ({ initialData = INITIAL_DATA, onSave, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<AnamnesisData>(initialData);

    const steps = [
        { title: 'Pele', icon: <Droplets size={16} /> },
        { title: 'Saúde', icon: <Shield size={16} /> },
        { title: 'Estilo', icon: <Sparkles size={16} /> },
    ];

    const updateData = (updates: Partial<AnamnesisData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const handleSave = () => {
        onSave({
            ...data,
            completedAt: data.completedAt || new Date(),
            lastUpdated: new Date(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-neo-bg rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-neo-text-secondary/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileText size={20} className="text-neo-accent" />
                            <h1 className="font-semibold text-neo-text">Ficha de Anamnese</h1>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-neo shadow-neo-out active:shadow-neo-pressed">
                            <X size={18} className="text-neo-text-secondary" />
                        </button>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex gap-2">
                        {steps.map((step, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={cn(
                                    'flex-1 py-2 rounded-neo text-xs font-medium flex items-center justify-center gap-1 transition-all',
                                    currentStep === idx
                                        ? 'shadow-neo-pressed text-neo-accent'
                                        : 'shadow-neo-out text-neo-text-secondary'
                                )}
                            >
                                {step.icon}
                                {step.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {currentStep === 0 && <Step1SkinAnalysis data={data} updateData={updateData} />}
                            {currentStep === 1 && <Step2HealthSafety data={data} updateData={updateData} />}
                            {currentStep === 2 && <Step3StylePreferences data={data} updateData={updateData} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-neo-text-secondary/10 flex gap-3">
                    {currentStep > 0 && (
                        <NeoButton
                            variant="ghost"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="flex-1"
                        >
                            <ChevronLeft size={18} />
                            Anterior
                        </NeoButton>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <NeoButton
                            variant="gradient"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="flex-1"
                        >
                            Próximo
                            <ChevronRight size={18} />
                        </NeoButton>
                    ) : (
                        <NeoButton
                            variant="gradient"
                            onClick={handleSave}
                            className="flex-1"
                        >
                            <Save size={18} />
                            Salvar Ficha
                        </NeoButton>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Admin View Modal - Glassmorphism Summary
export const AnamnesisViewModal: React.FC<{
    data: AnamnesisData;
    clientName: string;
    onClose: () => void;
}> = ({ data, clientName, onClose }) => {
    const hasAllergyWarning = data.allergies.latex || data.allergies.makeupBrands || data.allergies.others;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Glassmorphism Card */}
                <div
                    className="rounded-2xl p-6 backdrop-blur-xl overflow-y-auto"
                    style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-neo-text">{clientName}</h2>
                            <p className="text-sm text-neo-text-secondary">Ficha de Anamnese</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/50 hover:bg-white/80">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Allergy Warning */}
                    {hasAllergyWarning && (
                        <div className="p-4 bg-red-100 rounded-xl mb-4 flex items-start gap-3">
                            <AlertTriangle className="text-red-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-red-700">Alerta de Alergia!</p>
                                {data.allergies.latex && <p className="text-sm text-red-600">• Alergia a Látex</p>}
                                {data.allergies.makeupBrands && <p className="text-sm text-red-600">• {data.allergies.makeupBrands}</p>}
                                {data.allergies.others && <p className="text-sm text-red-600">• {data.allergies.others}</p>}
                            </div>
                        </div>
                    )}

                    {/* Summary Sections */}
                    <div className="space-y-4">
                        <SummarySection title="Tipo de Pele" value={SKIN_TYPES.find(t => t.id === data.skinType)?.label || 'N/A'} />
                        <SummarySection title="Preocupações" value={data.skinConcerns.join(', ') || 'Nenhuma'} />
                        <SummarySection title="Acabamento" value={data.preferredFinish || 'N/A'} />
                        <SummarySection title="Foco do Look" value={data.focalPoint || 'N/A'} />

                        {data.eyeSensitivity && (
                            <div className="flex items-center gap-2 text-amber-600">
                                <Eye size={16} />
                                <span className="text-sm">Sensibilidade nos olhos</span>
                            </div>
                        )}

                        {data.usesContacts && (
                            <div className="flex items-center gap-2 text-blue-600">
                                <Eye size={16} />
                                <span className="text-sm">Usa lentes de contato</span>
                            </div>
                        )}
                    </div>

                    {/* Pro Notes */}
                    {data.trialNotes && (
                        <div className="mt-6 p-4 bg-neo-bg rounded-xl shadow-neo-in">
                            <h4 className="font-semibold text-neo-text mb-2">Notas do Profissional</h4>
                            <p className="text-sm text-neo-text-secondary">{data.trialNotes}</p>
                            {data.foundationShade && (
                                <p className="text-sm text-neo-accent mt-2">Base: {data.foundationShade}</p>
                            )}
                        </div>
                    )}

                    <NeoButton variant="gradient" className="w-full mt-6" onClick={onClose}>
                        <CheckCircle size={18} />
                        Fechar
                    </NeoButton>
                </div>
            </motion.div>
        </div>
    );
};

// Helper Component
const SummarySection: React.FC<{ title: string; value: string }> = ({ title, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-neo-text-secondary/10">
        <span className="text-sm text-neo-text-secondary">{title}</span>
        <span className="text-sm font-medium text-neo-text">{value}</span>
    </div>
);

export default AnamnesisForm;
