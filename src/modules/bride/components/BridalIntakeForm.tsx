/**
 * BRIDAL INTAKE FORM (Digital Questionnaire)
 * Captures skin type, hair preferences, allergies, and style details for the bride.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Scissors,
    Palette,
    AlertCircle,
    Camera,
    Heart,
    Save,
    Check
} from 'lucide-react';
import { NeoCard, NeoButton, NeoInput, NeoSelect, Checkbox } from '../../../shared/components/ui/NeoComponents';
import { cn } from '../../../shared/lib/utils';

export const BridalIntakeForm: React.FC<{ brideId: string; onClose: () => void }> = ({ brideId, onClose }) => {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        skinType: 'normal',
        allergies: '',
        hairText: '',
        styleVibe: '',
        makeupIntensity: 'natural', // natural, glam, dramatic
        hairType: 'solto', // solto, preso, semi-preso
        preferredColors: '',
        specialRequests: ''
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(onClose, 1500);
        }, 2000);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h3 className="text-xl font-display font-bold text-neo-text flex items-center gap-2">
                            <Palette size={20} className="text-neo-accent" />
                            Pele e Maquiagem
                        </h3>

                        <NeoSelect
                            label="Seu tipo de pele"
                            options={[
                                { value: 'normal', label: 'Normal' },
                                { value: 'oleosa', label: 'Oleosa' },
                                { value: 'seca', label: 'Seca' },
                                { value: 'mista', label: 'Mista / T-Zone' }
                            ]}
                            value={formData.skinType}
                            onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                        />

                        <NeoInput
                            label="Alergias ou Sensibilidades"
                            placeholder="Ex: Níquel, látex, fragrâncias..."
                            icon={<AlertCircle size={18} />}
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neo-text-secondary">Intensidade da Maquiagem</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Natural', 'Glam', 'Dramática'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setFormData({ ...formData, makeupIntensity: opt.toLowerCase() })}
                                        className={cn(
                                            "py-3 rounded-neo text-xs font-semibold transition-all",
                                            formData.makeupIntensity === opt.toLowerCase()
                                                ? "bg-neo-accent text-white shadow-neo-out"
                                                : "bg-neo-bg text-neo-text-secondary shadow-neo-in"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h3 className="text-xl font-display font-bold text-neo-text flex items-center gap-2">
                            <Scissors size={20} className="text-neo-accent" />
                            Cabelo e Penteado
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neo-text-secondary">Estilo de Penteado</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'solto', label: 'Solto' },
                                    { id: 'preso', label: 'Preso / Coque' },
                                    { id: 'semi', label: 'Semi-preso' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, hairType: opt.id })}
                                        className={cn(
                                            "py-3 rounded-neo text-xs font-semibold transition-all",
                                            formData.hairType === opt.id
                                                ? "bg-neo-accent text-white shadow-neo-out"
                                                : "bg-neo-bg text-neo-text-secondary shadow-neo-in"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <NeoInput
                            label="Descrição do Cabelo"
                            placeholder="Ex: Longo, fino, com luzes..."
                            value={formData.hairText}
                            onChange={(e) => setFormData({ ...formData, hairText: e.target.value })}
                        />

                        <NeoInput
                            label="Vibe do Casamento"
                            placeholder="Ex: Boho, Clássico, Minimalista..."
                            icon={<Heart size={18} />}
                            value={formData.styleVibe}
                            onChange={(e) => setFormData({ ...formData, styleVibe: e.target.value })}
                        />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md"
            >
                <NeoCard className="p-8 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-neo-text">Ficha de Noiva</h2>
                            <p className="text-xs text-neo-text-secondary uppercase tracking-widest mt-1">Sua digital intake</p>
                        </div>
                        <div className="flex gap-1">
                            <div className={cn("w-2 h-2 rounded-full", step === 1 ? "bg-neo-accent" : "bg-neo-text-secondary/20")} />
                            <div className={cn("w-2 h-2 rounded-full", step === 2 ? "bg-neo-accent" : "bg-neo-text-secondary/20")} />
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="min-h-[300px]">
                        {renderStep()}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 mt-8">
                        {step === 2 ? (
                            <>
                                <NeoButton
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="flex-1"
                                >
                                    Voltar
                                </NeoButton>
                                <NeoButton
                                    variant="gradient"
                                    onClick={handleSave}
                                    className="flex-[2]"
                                    loading={isSaving}
                                    disabled={isSaved}
                                >
                                    {isSaved ? <Check size={20} /> : <><Save size={18} /> Salvar Ficha</>}
                                </NeoButton>
                            </>
                        ) : (
                            <NeoButton
                                variant="gradient"
                                onClick={() => setStep(2)}
                                className="w-full"
                            >
                                Continuar
                            </NeoButton>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-neo-text-secondary hover:text-neo-text"
                    >
                        Fechar
                    </button>
                </NeoCard>
            </motion.div>
        </div>
    );
};
