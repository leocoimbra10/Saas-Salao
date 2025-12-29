/**
 * DYNAMIC BRANDING CONTEXT
 * Injects brand colors from Firestore into CSS variables
 * Enables real-time theme updates across the entire app
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BrandColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    gold: string;
    goldLight: string;
    purple: string;
}

interface BrandingContextType {
    colors: BrandColors;
    updateColors: (colors: Partial<BrandColors>) => Promise<void>;
    loading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const DEFAULT_COLORS: BrandColors = {
    primary: '#E8A0B8',
    primaryLight: '#F5CED8',
    primaryDark: '#C67A94',
    gold: '#D4AF37',
    goldLight: '#F5E6C8',
    purple: '#8A2BE2'
};

export const BrandingProvider: React.FC<{ children: React.ReactNode; orgId?: string }> = ({
    children,
    orgId = 'default'
}) => {
    const [colors, setColors] = useState<BrandColors>(DEFAULT_COLORS);
    const [loading, setLoading] = useState(true);

    // Inject colors into CSS variables
    const injectCSSVariables = (brandColors: BrandColors) => {
        const root = document.documentElement;

        // Brand colors
        root.style.setProperty('--color-brand-primary', brandColors.primary);
        root.style.setProperty('--color-brand-primary-light', brandColors.primaryLight);
        root.style.setProperty('--color-brand-primary-dark', brandColors.primaryDark);
        root.style.setProperty('--color-brand-gold', brandColors.gold);
        root.style.setProperty('--color-brand-gold-light', brandColors.goldLight);
        root.style.setProperty('--color-brand-purple', brandColors.purple);

        // Update gradients
        const gradientBrand = `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.gold} 100%)`;
        const gradientReverse = `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.primary} 100%)`;
        const gradientVertical = `linear-gradient(180deg, ${brandColors.primary} 0%, ${brandColors.gold} 100%)`;

        root.style.setProperty('--gradient-brand', gradientBrand);
        root.style.setProperty('--gradient-reverse', gradientReverse);
        root.style.setProperty('--gradient-vertical', gradientVertical);
    };

    // Fetch branding from Firestore
    useEffect(() => {
        const fetchBranding = async () => {
            try {
                setLoading(true);
                const orgDoc = await getDoc(doc(db, 'organizations', orgId));

                if (orgDoc.exists()) {
                    const data = orgDoc.data();
                    if (data?.brandColors) {
                        const newColors = {
                            ...DEFAULT_COLORS,
                            ...data.brandColors
                        };
                        setColors(newColors);
                        injectCSSVariables(newColors);
                    } else {
                        // No custom colors, use defaults
                        injectCSSVariables(DEFAULT_COLORS);
                    }
                } else {
                    // Organization doesn't exist, use defaults
                    injectCSSVariables(DEFAULT_COLORS);
                }
            } catch (error) {
                console.error('Error fetching branding:', error);
                // On error, use defaults
                injectCSSVariables(DEFAULT_COLORS);
            } finally {
                setLoading(false);
            }
        };

        fetchBranding();

        // Real-time updates
        const unsubscribe = onSnapshot(
            doc(db, 'organizations', orgId),
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    if (data?.brandColors) {
                        const newColors = {
                            ...DEFAULT_COLORS,
                            ...data.brandColors
                        };
                        setColors(newColors);
                        injectCSSVariables(newColors);
                    }
                }
            }
        );

        return () => unsubscribe();
    }, [orgId]);

    const updateColors = async (newColors: Partial<BrandColors>) => {
        const updatedColors = { ...colors, ...newColors };
        setColors(updatedColors);
        injectCSSVariables(updatedColors);

        // TODO: Update Firestore (requires admin permissions)
        // await updateDoc(doc(db, 'organizations', orgId), {
        //   brandColors: updatedColors
        // });
    };

    return (
        <BrandingContext.Provider value={{ colors, updateColors, loading }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
