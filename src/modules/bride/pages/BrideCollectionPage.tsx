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
    Plus,
    X
} from 'lucide-react';
import { cn, formatCurrency } from '../../../shared/lib/utils';
import { NeoCard, NeoButton, Badge } from '../../../shared/components/ui/NeoComponents';
import { useBranding } from '../../../shared/context/BrandingContext';
import { getBridalServices, BridalServiceData as BridalPackageOption } from '../../bride/services/brideService';

// Brand Colors
const ROSE = 'var(--color-brand-primary)';
const GOLD = ROSE;

// Local Type Alias for readability in this component
type BridalAddon = BridalPackageOption;

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
        {/* Popular Badge (using customFields or hardcoded logic if needed) */}
        {/* We could add a 'popular' flag to the service data structure later */}

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

        {/* Features from Custom Fields */}
        {pkg.customFields && pkg.customFields.length > 0 && (
            <ul className="space-y-1.5 mb-4 pl-1">
                {pkg.customFields.map((field: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-neo-text-secondary">
                        <Check size={12} style={{ color: GOLD }} />
                        {field.label}: {field.value}
                    </li>
                ))}
            </ul>
        )}

        {/* Price */}
        <div className="text-right">
            {pkg.hasDiscount ? (
                <div className="flex flex-col items-end">
                    <span className="text-sm text-neo-text-secondary line-through">{formatCurrency(pkg.price)}</span>
                    <span className="text-2xl font-bold text-neo-text">
                        {formatCurrency(pkg.price * (1 - pkg.discountPercentage / 100))}
                    </span>
                </div>
            ) : (
                <span className="text-2xl font-bold text-neo-text">{formatCurrency(pkg.price)}</span>
            )}
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

    const [packages, setPackages] = useState<BridalPackageOption[]>([]);
    const [addons, setAddons] = useState<BridalAddon[]>([]);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            if (!organization?.id) return;
            try {
                const services = await getBridalServices(organization.id);

                // Filter active services
                const activeServices = services.filter(s => s.isActive);

                // Separate packages and addons
                const fetchedPackages = activeServices.filter(s => s.category === 'package');
                const fetchedAddons = activeServices.filter(s => s.category !== 'package'); // All other services can be addons

                setPackages(fetchedPackages);
                setAddons(fetchedAddons);
            } catch (error) {
                console.error('Error fetching bridal services:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [organization?.id]);

    // Calculations
    const selectedPackage = useMemo(() => packages.find(p => p.id === selectedPackageId), [packages, selectedPackageId]);

    // Calculate effective price (handling discounts)
    const getEffectivePrice = (service: BridalPackageOption) => {
        return service.hasDiscount
            ? service.price * (1 - service.discountPercentage / 100)
            : service.price;
    };

    const totalAddonsPrice = useMemo(() =>
        addons
            .filter(a => selectedAddonIds.includes(a.id!))
            .reduce((sum, a) => sum + getEffectivePrice(a), 0),
        [addons, selectedAddonIds]
    );

    const packagePrice = selectedPackage ? getEffectivePrice(selectedPackage) : 0;
    const totalPrice = packagePrice + totalAddonsPrice;
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
            // Placeholder: In a real flow, this would update the bride's journey/cart
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neo-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-neo-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                        {packages.length === 0 ? (
                            <div className="p-6 text-center text-neo-text-secondary bg-neo-bg rounded-neo shadow-neo-in">
                                Nenhum pacote disponível no momento.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {packages.map(pkg => (
                                    <PackageCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        isSelected={selectedPackageId === pkg.id}
                                        onSelect={() => setSelectedPackageId(pkg.id!)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Addons Section */}
                    <section>
                        <h2 className="text-subtitle flex items-center gap-2 mb-4">
                            <Plus size={18} style={{ color: GOLD }} />
                            Serviços Extras (Adicionais)
                        </h2>
                        {addons.length === 0 ? (
                            <div className="p-6 text-center text-neo-text-secondary bg-neo-bg rounded-neo shadow-neo-in">
                                Nenhum serviço adicional disponível.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {addons.map(addon => (
                                    <AddonPill
                                        key={addon.id}
                                        addon={addon}
                                        isSelected={selectedAddonIds.includes(addon.id!)}
                                        onToggle={() => handleToggleAddon(addon.id!)}
                                    />
                                ))}
                            </div>
                        )}
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
                        <NeoButton
                            variant="gradient"
                            className="w-full h-14 text-base font-semibold"
                            onClick={handleConfirmSelection}
                            disabled={!selectedPackageId || isSubmitting}
                        >
                            {isSubmitting ? 'Confirmando...' : 'Confirmar Seleção'}
                        </NeoButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrideCollectionPage;
