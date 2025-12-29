/**
 * DYNAMIC BRANDING CONTEXT
 * Injects brand colors from Firestore into CSS variables
 * Enables real-time theme updates across the entire app
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Organization } from '../types/types';

interface BrandColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    gold: string;
    goldLight: string;
    purple: string;
}

interface BrandingContextType {
    organization: Organization | null;
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
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [colors, setColors] = useState<BrandColors>(DEFAULT_COLORS);
    const [loading, setLoading] = useState(true);

    // Inject colors and other branding into CSS variables/body
    const injectStyles = (brandColors: BrandColors, settings?: any) => {
        const root = document.documentElement;

        // 1. Inject Brand Colors
        root.style.setProperty('--color-brand-primary', brandColors.primary);
        root.style.setProperty('--color-brand-primary-light', brandColors.primaryLight);
        root.style.setProperty('--color-brand-primary-dark', brandColors.primaryDark);
        root.style.setProperty('--color-brand-gold', brandColors.gold);
        root.style.setProperty('--color-brand-gold-light', brandColors.goldLight);
        root.style.setProperty('--color-brand-purple', brandColors.purple);

        // Ensure --neo-accent is synced with primary brand color (legacy support)
        root.style.setProperty('--neo-accent', brandColors.primary);

        // 2. Update Gradients
        const gradientBrand = `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.gold} 100%)`;
        const gradientReverse = `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.primary} 100%)`;
        const gradientVertical = `linear-gradient(180deg, ${brandColors.primary} 0%, ${brandColors.gold} 100%)`;

        root.style.setProperty('--gradient-brand', gradientBrand);
        root.style.setProperty('--gradient-reverse', gradientReverse);
        root.style.setProperty('--gradient-vertical', gradientVertical);

        // 3. Inject Legacy Settings (Background, etc.)
        if (settings?.backgroundUrl) {
            document.body.style.backgroundImage = `url('${settings.backgroundUrl}')`;
            root.style.setProperty('--bg-image', `url('${settings.backgroundUrl}')`);
        } else {
            document.body.style.backgroundImage = 'none';
        }
    };

    // Helper to extract brand colors from organization data
    const getBrandColorsFromData = (data: any): BrandColors => {
        if (data?.brandColors) {
            return { ...DEFAULT_COLORS, ...data.brandColors };
        }

        // Fallback to legacy primaryColor if brandColors is missing
        if (data?.settings?.primaryColor) {
            return {
                ...DEFAULT_COLORS,
                primary: data.settings.primaryColor
            };
        }

        return DEFAULT_COLORS;
    };

    // Fetch branding from Firestore
    useEffect(() => {
        const fetchBranding = async () => {
            try {
                setLoading(true);
                const orgDoc = await getDoc(doc(db, 'organizations', orgId));

                if (orgDoc.exists()) {
                    const data = orgDoc.data();
                    const orgWithId = { id: orgDoc.id, ...data } as Organization;
                    setOrganization(orgWithId);

                    const newColors = getBrandColorsFromData(data);
                    setColors(newColors);
                    injectStyles(newColors, data.settings);
                } else {
                    // Organization doesn't exist, use defaults
                    injectStyles(DEFAULT_COLORS);
                }
            } catch (error) {
                console.error('Error fetching branding:', error);
                // On error, use defaults
                injectStyles(DEFAULT_COLORS);
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
                    const orgWithId = { id: snapshot.id, ...data } as Organization;
                    setOrganization(orgWithId);

                    const newColors = getBrandColorsFromData(data);
                    setColors(newColors);
                    injectStyles(newColors, data.settings);
                }
            }
        );

        return () => unsubscribe();
    }, [orgId]);

    const updateColors = async (newColors: Partial<BrandColors>) => {
        const updatedColors = { ...colors, ...newColors };
        setColors(updatedColors);
        injectStyles(updatedColors);

        // TODO: Update Firestore (requires admin permissions)
        // await updateDoc(doc(db, 'organizations', orgId), {
        //   brandColors: updatedColors
        // });
    };

    return (
        <BrandingContext.Provider value={{ organization, colors, updateColors, loading }}>
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
