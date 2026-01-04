import React from 'react';
import { Typography, NeoCard, NeoButton } from '../../../shared/components/ui';
import { useAuth } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 p-4">
            <header>
                <Typography variant="h2" className="text-neo-text font-display font-bold">
                    Meu Perfil
                </Typography>
                <Typography variant="body" className="text-neo-text-secondary">
                    Seus dados pessoais e preferências.
                </Typography>
            </header>

            <NeoCard className="p-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <Typography variant="caption" className="text-neo-text-secondary">Nome</Typography>
                        <Typography variant="body" className="font-semibold">{profile?.displayName || user?.displayName || 'Usuário'}</Typography>
                    </div>
                    <div>
                        <Typography variant="caption" className="text-neo-text-secondary">Email</Typography>
                        <Typography variant="body" className="font-semibold">{user?.email}</Typography>
                    </div>

                    <div className="pt-4 border-t border-neo-text/5">
                        <NeoButton
                            variant="outline"
                            className="text-neo-danger border-neo-danger w-full justify-center"
                            onClick={() => {
                                // Add logout logic here if needed or navigate to logout
                                navigate('/login');
                            }}
                            icon={<LogOut size={18} />}
                        >
                            Sair
                        </NeoButton>
                    </div>
                </div>
            </NeoCard>
        </div>
    );
};

export default ProfilePage;
