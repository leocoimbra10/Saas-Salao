/**
 * MARCELA AI - Service Layer
 * Simulates AI-driven insights, service suggestions, and churn analysis.
 */

export interface AISuggestion {
    id: string;
    title: string;
    description: string;
    serviceId: string;
    impact: string; // "Upsell", "Retention", "Experience"
    reason: string;
}

export const getSmartUpsell = (currentServices: string[]): AISuggestion | null => {
    // Logic: If user picks Makeup, suggest Lashes or Skin Prep.
    // If user picks Bridal, suggest Groom package or Bridesmaids bundle.

    const services = currentServices.map(s => s.toLowerCase());

    if (services.some(s => s.includes('maquiagem') || s.includes('makeup'))) {
        return {
            id: 'lashes-upsell',
            title: 'Cílios de Luxo',
            description: 'Marcela AI percebeu que você ama maquiagem. Que tal cílios 3D para um olhar fatal?',
            serviceId: 'lashes-3d',
            impact: 'Upsell',
            reason: 'Baseado no seu histórico de maquiagem glam'
        };
    }

    if (services.some(s => s.includes('noiva') || s.includes('bride'))) {
        return {
            id: 'skin-prep-upsell',
            title: 'Protocolo Glow 24h',
            description: 'Para sua pele brilhar no altar, recomendamos nosso Prepare Skin com 20% OFF.',
            serviceId: 'skin-prep',
            impact: 'Experience',
            reason: 'Especial para noivas com datas próximas'
        };
    }

    return null;
};

export const getChurnAlerts = () => {
    return [
        {
            clientName: 'Juliana Paiva',
            risk: 'High',
            lastVisit: '45 days ago',
            action: 'Enviar cupom de "Saudades"'
        },
        {
            clientName: 'Fernanda Lima',
            risk: 'Medium',
            lastVisit: '30 days ago',
            action: 'Sugestão de revitalização'
        }
    ];
};
