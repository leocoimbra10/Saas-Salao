/**
 * TEAM MANAGEMENT PAGE - Staff Permissions & Commissions
 * Neomorphic Design with Gold Accents
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { UserProfile, UserPermissions } from '../../../shared/types/types';
import { Skeleton, NeoButton, NeoCard, Toggle, Typography, NeoInput } from '../../../shared/components/ui/NeoComponents';
import { BottomSheet } from '../../../shared/components/ui/BottomSheet';
import { cn } from '../../../shared/lib/utils';
import { addEmployee, getUserProfile, onAuthChange } from '../../auth/services/authService';

// Permission labels in Portuguese
const PERMISSION_LABELS: { key: keyof UserPermissions; label: string; description: string }[] = [
    { key: 'canViewGlobalAgenda', label: 'Ver Agenda Global', description: 'Acesso à agenda de toda a equipe' },
    { key: 'canManagePayments', label: 'Gerenciar Cobranças', description: 'Acesso ao módulo de pagamentos' },
    { key: 'canViewFinancialReports', label: 'Ver Performance', description: 'Acesso aos relatórios financeiros' },
    { key: 'canEditServices', label: 'Editar Serviços', description: 'Modificar preços e serviços' },
    { key: 'canManageTeam', label: 'Gerenciar Equipe', description: 'Adicionar/remover membros' },
    { key: 'canViewClients', label: 'Ver Clientes', description: 'Acesso à lista de clientes' },
    { key: 'canManageAppointments', label: 'Gerenciar Agendamentos', description: 'Criar e editar agendamentos' },
];

// Neomorphic Toggle Component
// Replaced by imported Toggle

// Employee Card Component
const EmployeeCard: React.FC<{
    employee: UserProfile;
    onSelect: () => void;
    isSelected: boolean;
}> = ({ employee, onSelect, isSelected }) => {
    return (
        <NeoCard
            variant={isSelected ? 'inset' : 'raised'}
            className={cn("w-full transition-all duration-300 cursor-pointer hover:shadow-neo-out-lg text-left", isSelected && "border-2 border-brand-primary")}
            onClick={onSelect}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center overflow-hidden">
                    {employee.photoURL ? (
                        <img src={employee.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-neo-bg flex items-center justify-center">
                            <Typography variant="caption" className="text-xl">{employee.displayName?.charAt(0) || '?'}</Typography>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <Typography variant="h6" className="font-semibold text-neo-text">{employee.displayName || 'Sem nome'}</Typography>
                    <Typography variant="caption" className="text-xs text-neo-text-secondary">{employee.specialty || 'Profissional'}</Typography>
                </div>

                {/* Role Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.role === 'owner'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                    }`}>
                    {employee.role === 'owner' ? 'Proprietário' : 'Funcionário'}
                </span>
            </div>
        </NeoCard>
    );
};

// Permission Editor Bottom Sheet
const PermissionEditor: React.FC<{
    employee: UserProfile | null;
    onClose: () => void;
    onUpdate: (permissions: Partial<UserPermissions>) => Promise<void>;
    onUpdateCommission: (rate: number) => Promise<void>;
}> = ({ employee, onClose, onUpdate, onUpdateCommission }) => {
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [commission, setCommission] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (employee) {
            setPermissions(employee.permissions);
            setCommission(employee.commissionRate || 0);
        }
    }, [employee]);

    const handleToggle = async (key: keyof UserPermissions, value: boolean) => {
        if (!permissions || employee?.role === 'owner') return;

        setSaving(true);
        const updated = { ...permissions, [key]: value };
        setPermissions(updated);
        await onUpdate({ [key]: value });
        setSaving(false);
    };

    const handleCommissionChange = async (rate: number) => {
        if (employee?.role === 'owner') return;
        setCommission(rate);
        await onUpdateCommission(rate);
    };

    if (!employee || !permissions) return null;

    const isOwner = employee.role === 'owner';

    return (
        <BottomSheet
            isOpen={true}
            onClose={onClose}
            title={employee.displayName || 'Editar Permissões'}
        >
            <div className="space-y-6">
                {isOwner && (
                    <div className="p-4 rounded-neo bg-amber-50 border border-amber-200">
                        <Typography variant="caption" className="text-amber-700">
                            <strong>Proprietário</strong> - Possui todas as permissões automaticamente.
                        </Typography>
                    </div>
                )}

                {/* Commission Rate */}
                <NeoCard variant="inset" padding="sm" className="space-y-4">
                    <Typography variant="label">Taxa de Comissão</Typography>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={commission}
                            onChange={(e) => handleCommissionChange(Number(e.target.value))}
                            disabled={isOwner}
                            className="flex-1 h-2 bg-neo-bg rounded-full shadow-neo-in appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, var(--color-brand-gold) ${commission}%, #e8e8ed ${commission}%)`
                            }}
                        />
                        <span className="w-16 text-center font-semibold text-neo-accent">
                            {commission}%
                        </span>
                    </div>
                </NeoCard>

                {/* Permissions List */}
                <div className="space-y-3">
                    <Typography variant="label" className="uppercase tracking-wide text-neo-text-secondary">
                        Acessos & Permissões
                    </Typography>

                    {PERMISSION_LABELS.map((perm) => (
                        <NeoCard key={perm.key} variant="raised" padding="sm" className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                                <Typography variant="h6" className="font-medium text-base">{perm.label}</Typography>
                                <Typography variant="caption">{perm.description}</Typography>
                            </div>
                            <Toggle
                                checked={isOwner || !!permissions[perm.key]}
                                onChange={(value) => handleToggle(perm.key, value)}
                                disabled={isOwner || saving}
                            />
                        </NeoCard>
                    ))}
                </div>
            </div>
        </BottomSheet>
    );
};

// Add Employee Modal
const AddEmployeeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; email: string; password: string; specialty: string }) => Promise<void>;
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await onAdd({ name, email, password, specialty });
            setName('');
            setEmail('');
            setPassword('');
            setSpecialty('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao adicionar profissional.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
            >
                <NeoCard className="relative overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-neo-text-secondary hover:text-neo-text transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <div className="mb-6">
                        <Typography variant="h3" className="mb-1">Novo Profissional</Typography>
                        <Typography variant="caption">Adicione um novo membro à equipe</Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <NeoInput
                            label="Nome Completo *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Maria Silva"
                            required
                        />

                        <NeoInput
                            label="Email *"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            required
                        />

                        <NeoInput
                            label="Senha *"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                            required
                        />

                        <NeoInput
                            label="Especialidade"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            placeholder="Ex: Maquiadora, Cabeleireiro"
                        />

                        {error && (
                            <Typography variant="caption" className="text-neo-danger text-center">{error}</Typography>
                        )}

                        <div className="flex gap-3 pt-4">
                            <NeoButton variant="ghost" onClick={onClose} className="flex-1">
                                Cancelar
                            </NeoButton>
                            <NeoButton
                                type="submit"
                                variant="gradient"
                                loading={loading}
                                className="flex-1"
                            >
                                Adicionar
                            </NeoButton>
                        </div>
                    </form>
                </NeoCard>
            </motion.div>
        </motion.div>
    );
};

// Main Page Component
import { useEmployees, useEmployeeMutations } from '../../organization/hooks/useEmployees';

export const TeamManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthChange(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }

            const profile = await getUserProfile(user.uid);
            if (!profile || !profile.orgId) {
                navigate('/login');
                return;
            }

            setCurrentUser(profile);
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    const { data: employees = [], isLoading: loading } = useEmployees(currentUser?.orgId);
    const { updatePermissions, updateCommission } = useEmployeeMutations(currentUser?.orgId);

    const handleUpdatePermissions = async (permissions: Partial<UserPermissions>) => {
        if (!selectedEmployee) return;
        updatePermissions({ userId: selectedEmployee.uid, permissions });
    };

    const handleUpdateCommission = async (rate: number) => {
        if (!selectedEmployee) return;
        updateCommission({ userId: selectedEmployee.uid, rate });
    };

    const handleAddEmployee = async (data: { name: string; email: string; password: string; specialty: string }) => {
        if (!currentUser?.orgId) return;
        await addEmployee(data.email, data.password, currentUser.orgId, data.name, data.specialty);
    };

    const isOwner = currentUser?.role === 'owner';

    return (
        <div className="min-h-screen bg-neo-bg p-6 pb-24">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <NeoButton
                    onClick={() => navigate('/admin')}
                    className="w-12 h-12 rounded-full flex items-center justify-center p-0"
                    variant="neu"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </NeoButton>
                <div>
                    <Typography variant="h2" className="font-display font-bold text-neo-text">Equipe</Typography>
                    <Typography variant="caption" className="text-sm text-neo-text-secondary">Profissionais & Comissões</Typography>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <NeoCard className="p-4 text-center">
                    <Typography variant="h4" className="text-2xl font-bold text-neo-accent">{employees.length}</Typography>
                    <Typography variant="caption" className="text-xs text-neo-text-secondary">Profissionais</Typography>
                </NeoCard>
                <NeoCard className="p-4 text-center">
                    <Typography variant="h4" className="text-2xl font-bold text-neo-success">{employees.filter(e => e.role === 'owner').length}</Typography>
                    <Typography variant="caption" className="text-xs text-neo-text-secondary">Proprietários</Typography>
                </NeoCard>
            </div>

            {/* Employee List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-neo-accent border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-neo-text-secondary mt-4">Carregando equipe...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-12">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-neo-text-secondary">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <p className="text-neo-text-secondary mt-4">Nenhum profissional cadastrado</p>
                    </div>
                ) : (
                    employees.map((employee) => (
                        <EmployeeCard
                            key={employee.uid}
                            employee={employee}
                            onSelect={() => setSelectedEmployee(employee)}
                            isSelected={selectedEmployee?.uid === employee.uid}
                        />
                    ))
                )}
            </div>

            {/* Add Button (only for owners) */}
            {isOwner && (
                <NeoButton
                    variant="glow"
                    onClick={() => setShowAddModal(true)}
                    className={cn(
                        "fixed bottom-24 right-6 z-40",
                        "w-14 h-14 rounded-full p-0 flex items-center justify-center",
                        "border-2 border-white/30 backdrop-blur-md"
                    )}
                    title="Adicionar Membro"
                >
                    <Plus size={26} strokeWidth={2.5} />
                </NeoButton>
            )}

            {/* Permission Editor */}
            {selectedEmployee && (
                <PermissionEditor
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    onUpdate={handleUpdatePermissions}
                    onUpdateCommission={handleUpdateCommission}
                />
            )}

            {/* Add Modal */}
            <AddEmployeeModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddEmployee}
            />
        </div>
    );
};

export default TeamManagementPage;
