import React from 'react';
import { Typography, NeoCard } from '../../../shared/components/ui';

export const AdminCalendarPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <Typography variant="h2" className="text-neo-text font-display font-bold">
                    Calendário
                </Typography>
                <Typography variant="body" className="text-neo-text-secondary">
                    Gerencie seus agendamentos.
                </Typography>
            </header>

            <NeoCard className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center w-full flex flex-col items-center justify-center h-full">
                    <Typography variant="h3" className="text-neo-text-secondary font-bold mb-2">
                        🚧 Em Construção
                    </Typography>
                    <Typography variant="body" className="text-neo-text-secondary/70">
                        O módulo de calendário estará disponível em breve.
                    </Typography>
                </div>
            </NeoCard>
        </div>
    );
};

export default AdminCalendarPage;
