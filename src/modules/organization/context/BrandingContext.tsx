/**
 * BEAUTY SALON NEOMORPHIC APP - Branding Context
 * Manages global salon identity (Logo, Colors, Background)
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, getDocs, collection, limit, query } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Organization } from '@/shared/types/types';

interface BrandingContextType {
    organization: Organization | null;
    loading: boolean;
    updateBranding: (updates: Partial<Organization['settings']>) => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType>({
    organization: null,
    loading: true,
    updateBranding: async () => { },
});

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial load - Fetch the first organization found (for single-tenant simulation)
    useEffect(() => {
        const fetchOrg = async () => {
            try {
                // For this demo, we'll grab the first organization or a default ID
                // In a real multi-tenant app, this would come from the logged-in user's claims or subdomain
                const q = query(collection(db, 'organizations'), limit(1));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const orgDoc = snapshot.docs[0];
                    subscribeToOrg(orgDoc.id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching organization:", error);
                setLoading(false);
            }
        };

        fetchOrg();
    }, []);

    const subscribeToOrg = (orgId: string) => {
        const unsub = onSnapshot(doc(db, 'organizations', orgId), (doc) => {
            if (doc.exists()) {
                const orgData = { id: doc.id, ...doc.data() } as Organization;
                setOrganization(orgData);
                applyGlobalStyles(orgData);
            }
            setLoading(false);
        });

        return () => unsub();
    };

    const applyGlobalStyles = (org: Organization) => {
        // 1. Apply Global Background
        if (org.settings.backgroundUrl) {
            document.body.style.backgroundImage = `url('${org.settings.backgroundUrl}')`;
            document.documentElement.style.setProperty('--bg-image', `url('${org.settings.backgroundUrl}')`);
        }

        // 2. Apply Accent Color (Primary)
        if (org.settings.primaryColor) {
            document.documentElement.style.setProperty('--neo-accent', org.settings.primaryColor);

            // Also update related RGB vars if needed for opacity capability (tailwind usually handles this if defined correctly)
            // For now, we assume simple hex replacement works with our CSS variables setup
        }
    };

    const updateBranding = async (updates: Partial<Organization['settings']>) => {
        // This will be handled by the Settings Page connecting directly to Firestore 
        // or via the service, but the Context listener will pick up changes automatically.
        return;
    };

    return (
        <BrandingContext.Provider value={{ organization, loading, updateBranding }}>
            {children}
        </BrandingContext.Provider>
    );
};
