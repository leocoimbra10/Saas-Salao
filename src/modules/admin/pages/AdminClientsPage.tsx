import React from 'react';
import { Typography, NeoCard } from '../../../shared/components/ui';

export const AdminClientsPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <Typography variant="h2" className="text-neo-text font-display font-bold">
                    Clientes
                </Typography>
                <Typography variant="body" className="text-neo-text-secondary">
                    Gerencie sua base de clientes.
                </Typography>
            </header>

            <NeoCard className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Typography variant="h3" className="text-neo-text/50 font-bold mb-2">
                        Em Construção
                    </Typography>
                    <Typography variant="body" className="text-neo-text-secondary/50">
                        O módulo de clientes estará disponível em breve.
                    </Typography>
                </div>
            </NeoCard>
        </div>
    );
};

export default AdminClientsPage;
