/**
 * BRIDE COLLECTION PAGE
 * "Coleção Noiva" - Package & Add-on Selection with Live Price Calculator
 * Style: Neomorphism with Glassmorphic accents
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Crown,
    Sparkles,
    Check,
    ShoppingBag,
    Plus
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { Card, Button, Badge } from '../../../shared/components/ui/NeoComponents';
import { db } from '../../../shared/lib/firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useBranding } from '../../organization/context/BrandingContext';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = ROSE;
const GOLD_LIGHT = '#F5CED8';

// Types
interface BridalPackageOption {
    id: string;
    name: string;
    description: string;
    features: string[];
    price: number;
    popular?: boolean;
}

interface BridalAddon {
    id: string;
    name: string;
    price: number;
}

// Mock Data (Replace with Firestore fetch)
const MOCK_PACKAGES: BridalPackageOption[] = [
    {
        id: 'classic',
        name: 'Pacote Classic',
        description: 'O essencial para o seu grande dia',
        features: ['Maquiagem Noiva', 'Penteado Noiva', 'Prova de Cabelo e Make'],
        price: 1200,
    },
    {
        id: 'premium',
        name: 'Pacote Premium',
        description: 'A experiência completa para noivas exigentes',
        features: ['Maquiagem Noiva HD', 'Penteado Noiva', 'Prova de Cabelo e Make', 'Kit de Retoque', 'Spa Day Relaxante'],
        price: 2200,
        popular: true,
    },
    {
        id: 'exclusive',
        name: 'Pacote Exclusive',
        description: 'O máximo de exclusividade e cuidado',
        features: ['Maquiagem Noiva VIP', 'Penteado Noiva Arquitetônico', 'Duas Provas Completas', 'Kit de Retoque Premium', 'Spa Day Deluxe', 'Ensaio Pré-Wedding'],
        price: 3500,
    },
];

const MOCK_ADDONS: BridalAddon[] = [
    { id: 'spa-day', name: 'Spa Day Relaxante', price: 350 },
    { id: 'retoque-festa', name: 'Retoque de Festa', price: 200 },
    { id: 'madrinha-extra', name: 'Make/Penteado Madrinha Extra', price: 280 },
    { id: 'mae-noivo', name: 'Mãe do Noivo (Make + Penteado)', price: 350 },
    { id: 'ensaio-prewedding', name: 'Ensaio Pré-Wedding', price: 450 },
    { id: 'kit-emergencia', name: 'Kit Emergência de Beleza', price: 150 },
];

// Package Card Component
const PackageCard: React.FC<{
    pkg: BridalPackageOption;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ pkg, isSelected, onSelect }) => (
    <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className={cn(
            "p-5 rounded-neo cursor-pointer transition-all duration-300 relative overflow-hidden",
            isSelected
                ? "shadow-neo-pressed border-2"
                : "shadow-neo-out border-2 border-transparent hover:shadow-neo-out-lg"
        )}
        style={{ borderColor: isSelected ? GOLD : 'transparent' }}
    >
        {/* Popular Badge */}
        {pkg.popular && (
            <Badge variant="warning" className="absolute top-3 right-3 text-[10px]">
                <Sparkles size={10} className="mr-1" /> Mais Popular
            </Badge>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
            <div
                className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-neo-accent border-neo-accent" : "border-neo-text-secondary/30"
                )}
                style={{ backgroundColor: isSelected ? GOLD : undefined, borderColor: isSelected ? GOLD : undefined }}
            >
                {isSelected && <Check size={14} className="text-white" />}
            </div>
            <div>
                <h3 className="font-semibold text-neo-text">{pkg.name}</h3>
                <p className="text-xs text-neo-text-secondary">{pkg.description}</p>
            </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-4 pl-1">
            {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-neo-text-secondary">
                    <Check size={12} style={{ color: GOLD }} />
                    {feature}
                </li>
            ))}
        </ul>

        {/* Price */}
        <div className="text-right">
            <span className="text-2xl font-bold text-neo-text">{formatCurrency(pkg.price)}</span>
        </div>
    </motion.div>
);

// Addon Pill Component
const AddonPill: React.FC<{
    addon: BridalAddon;
    isSelected: boolean;
    onToggle: () => void;
}> = ({ addon, isSelected, onToggle }) => (
    <button
        onClick={onToggle}
        className={cn(
            "flex items-center justify-between w-full p-3 rounded-neo transition-all duration-200",
            isSelected
                ? "shadow-neo-pressed border-2"
                : "shadow-neo-out border-2 border-transparent"
        )}
        style={{ borderColor: isSelected ? GOLD : 'transparent' }}
    >
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    isSelected ? "border-neo-accent" : "border-neo-text-secondary/30"
                )}
                style={{ backgroundColor: isSelected ? GOLD : undefined, borderColor: isSelected ? GOLD : undefined }}
            >
                {isSelected && <Check size={12} className="text-white" />}
            </div>
            <span className="text-sm text-neo-text font-medium">{addon.name}</span>
        </div>
        <span className="text-sm font-semibold text-neo-text-secondary">+ {formatCurrency(addon.price)}</span>
    </button>
);

// Main Component
export const BrideCollectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { organization } = useBranding();

    const [packages, setPackages] = useState<BridalPackageOption[]>(MOCK_PACKAGES);
    const [addons, setAddons] = useState<BridalAddon[]>(MOCK_ADDONS);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataRefreshed, setDataRefreshed] = useState(false);

    // Fetch real data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch bridal packages (category === 'package')
                const pkgSnap = await getDocs(collection(db, 'bridal_services'));
                const pkgData = pkgSnap.docs
                    .filter(d => d.data().category === 'package' && d.data().isActive !== false)
                    .map(d => ({
                        id: d.id,
                        name: d.data().name,
                        description: d.data().description || '',
                        features: d.data().customFields?.map((f: any) => f.label) || [],
                        price: d.data().price || 0,
                        popular: d.data().popular || false
                    } as BridalPackageOption));

                // Fetch add-ons (category !== 'package')
                const addonData = pkgSnap.docs
                    .filter(d => d.data().category !== 'package' && d.data().isActive !== false)
                    .map(d => ({
                        id: d.id,
                        name: d.data().name,
                        price: d.data().price || 0
                    } as BridalAddon));

                // Only update if we have data, otherwise keep mock
                if (pkgData.length > 0) setPackages(pkgData);
                if (addonData.length > 0) setAddons(addonData);

                // Trigger pulse animation on data refresh
                setDataRefreshed(true);
                setTimeout(() => setDataRefreshed(false), 600);
            } catch (error) {
                console.warn('Using mock data - Firestore not configured:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculations
    const selectedPackage = useMemo(() => packages.find(p => p.id === selectedPackageId), [packages, selectedPackageId]);
    const totalAddonsPrice = useMemo(() =>
        addons.filter(a => selectedAddonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
        [addons, selectedAddonIds]
    );
    const totalPrice = (selectedPackage?.price || 0) + totalAddonsPrice;
    const depositAmount = totalPrice * 0.3;

    const handleToggleAddon = (addonId: string) => {
        setSelectedAddonIds(prev =>
            prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
        );
    };

    const handleConfirmSelection = async () => {
        if (!selectedPackageId) {
            alert('Por favor, selecione um pacote.');
            return;
        }
        setIsSubmitting(true);
        try {
            // TODO: Save to Firestore `bride_journeys` collection
            // await updateDoc(doc(db, 'bride_journeys', currentJourneyId), {
            //     selectedPackageId,
            //     selectedAddonIds,
            //     totalPrice,
            //     depositAmount,
            //     servicesConfirmedAt: Timestamp.now()
            // });
            console.log('Selection Confirmed:', { selectedPackageId, selectedAddonIds, totalPrice, depositAmount });
            alert('Seleção confirmada com sucesso!');
            navigate('/noiva'); // Navigate back to portal
        } catch (error) {
            console.error('Error saving selection:', error);
            alert('Erro ao salvar a seleção.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg pb-32">
            <div className="w-full max-w-[480px] mx-auto">
                {/* Header */}
                <header className="p-4 sticky top-0 bg-neo-bg z-10 shadow-neo-out rounded-b-neo">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-neo-bg rounded-neo shadow-neo-out flex items-center justify-center active:shadow-neo-pressed"
                        >
                            <ArrowLeft size={20} className="text-neo-text-secondary" />
                        </button>
                        <div>
                            <h1 className="font-display font-semibold text-neo-text flex items-center gap-2">
                                <Crown size={20} style={{ color: GOLD }} />
                                Coleção Noiva
                            </h1>
                            <p className="text-xs text-neo-text-secondary">Escolha seu pacote e adicionais</p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="px-4 pt-4 space-y-8">
                    {/* Packages Section */}
                    <section>
                        <h2 className="text-subtitle flex items-center gap-2 mb-4">
                            <ShoppingBag size={18} style={{ color: GOLD }} />
                            Pacotes Principais
                        </h2>
                        <div className="space-y-4">
                            {packages.map(pkg => (
                                <PackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    isSelected={selectedPackageId === pkg.id}
                                    onSelect={() => setSelectedPackageId(pkg.id)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Addons Section */}
                    <section>
                        <h2 className="text-subtitle flex items-center gap-2 mb-4">
                            <Plus size={18} style={{ color: GOLD }} />
                            Serviços Extras (Adicionais)
                        </h2>
                        <div className="space-y-2">
                            {addons.map(addon => (
                                <AddonPill
                                    key={addon.id}
                                    addon={addon}
                                    isSelected={selectedAddonIds.includes(addon.id)}
                                    onToggle={() => handleToggleAddon(addon.id)}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                {/* Sticky Price Calculator Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-neo-bg shadow-[0_-4px_16px_rgba(0,0,0,0.1)] border-t border-neo-text/5 z-20">
                    <div className="w-full max-w-[480px] mx-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-neo-text-secondary">Valor Total:</span>
                            <span className="text-2xl font-bold text-neo-text">{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-neo-text-secondary">Sinal para Reserva (30%):</span>
                            <span className="text-lg font-semibold" style={{ color: GOLD }}>{formatCurrency(depositAmount)}</span>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full h-14 text-base font-semibold"
                            onClick={handleConfirmSelection}
                            disabled={!selectedPackageId || isSubmitting}
                        >
                            {isSubmitting ? 'Confirmando...' : 'Confirmar Seleção'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrideCollectionPage;
