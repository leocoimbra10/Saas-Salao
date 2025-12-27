/**
 * TEAM MANAGEMENT PAGE - Staff Permissions & Commissions
 * Neomorphic Design with Gold Accents
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UserPermissions } from '../../../shared/types/types';
import {
    subscribeToOrgEmployees,
    updateUserPermissions,
    updateUserCommission,
    removeEmployee
} from '../../organization/services/organizationService';
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
const NeoToggle: React.FC<{
    enabled: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-neo-out'
                : 'bg-neo-bg shadow-neo-in'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <motion.div
                animate={{ x: enabled ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${enabled ? 'bg-white' : 'bg-neo-bg shadow-neo-out'
                    }`}
            />
        </button>
    );
};

// Employee Card Component
const EmployeeCard: React.FC<{
    employee: UserProfile;
    onSelect: () => void;
    isSelected: boolean;
}> = ({ employee, onSelect, isSelected }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`w-full p-4 rounded-neo transition-all duration-300 text-left ${isSelected
                ? 'shadow-neo-in border-2 border-amber-400'
                : 'shadow-neo-out hover:shadow-neo-out-lg'
                }`}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center">
                    {employee.photoURL ? (
                        <img src={employee.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neo-accent">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="font-semibold text-neo-text">{employee.displayName || 'Sem nome'}</h3>
                    <p className="text-xs text-neo-text-secondary">{employee.specialty || 'Profissional'}</p>
                </div>

                {/* Role Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.role === 'owner'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                    }`}>
                    {employee.role === 'owner' ? 'Proprietário' : 'Funcionário'}
                </span>
            </div>
        </motion.button>
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
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-neo-bg rounded-t-3xl shadow-neo-out-lg p-6 pb-8 max-h-[85vh] overflow-y-auto"
                >
                    {/* Handle */}
                    <div className="w-12 h-1 bg-neo-text-secondary/30 rounded-full mx-auto mb-6" />

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-neo-bg shadow-neo-out active:shadow-neo-pressed transition-all"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-neo-text">{employee.displayName}</h2>
                            <p className="text-sm text-neo-text-secondary">Editar permissões</p>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="mb-6 p-4 rounded-neo bg-amber-50 border border-amber-200">
                            <p className="text-sm text-amber-700">
                                <strong>Proprietário</strong> - Possui todas as permissões automaticamente.
                            </p>
                        </div>
                    )}

                    {/* Commission Rate */}
                    <div className="mb-6 p-4 rounded-neo shadow-neo-out">
                        <label className="block text-sm font-medium text-neo-text mb-2">
                            Taxa de Comissão
                        </label>
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
                                    background: `linear-gradient(to right, #D4AF37 ${commission}%, #e8e8ed ${commission}%)`
                                }}
                            />
                            <span className="w-16 text-center font-semibold text-neo-accent">
                                {commission}%
                            </span>
                        </div>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-neo-text-secondary uppercase tracking-wide">
                            Acessos & Permissões
                        </h3>

                        {PERMISSION_LABELS.map((perm) => (
                            <div key={perm.key} className="flex items-center justify-between p-4 rounded-neo shadow-neo-out">
                                <div className="flex-1 mr-4">
                                    <p className="font-medium text-neo-text">{perm.label}</p>
                                    <p className="text-xs text-neo-text-secondary">{perm.description}</p>
                                </div>
                                <NeoToggle
                                    enabled={isOwner || permissions[perm.key]}
                                    onChange={(value) => handleToggle(perm.key, value)}
                                    disabled={isOwner || saving}
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
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
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-neo-bg rounded-neo-lg shadow-neo-out-lg p-6"
            >
                <h2 className="text-xl font-semibold text-neo-text mb-6">Novo Profissional</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Nome *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full neo-input"
                            placeholder="Nome completo"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">E-mail *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full neo-input"
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Senha *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full neo-input"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">Especialidade</label>
                        <input
                            type="text"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full neo-input"
                            placeholder="Ex: Maquiadora, Cabeleireiro"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-neo bg-neo-bg shadow-neo-out active:shadow-neo-pressed font-medium text-neo-text-secondary transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-neo bg-gradient-to-r from-amber-400 to-amber-500 shadow-neo-out active:shadow-neo-pressed font-semibold text-white transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Main Page Component
export const TeamManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<UserProfile[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthChange(async (user) => {
            if (!user) {
                setLoading(false);
                navigate('/login');
                return;
            }

            const profile = await getUserProfile(user.uid);
            if (!profile || !profile.orgId) {
                setLoading(false);
                navigate('/login');
                return;
            }

            setCurrentUser(profile);

            // Subscribe to employees
            const unsubscribe = subscribeToOrgEmployees(profile.orgId, (emps) => {
                setEmployees(emps);
                setLoading(false);
            });

            // Store unsubscribe in a ref or cleanup
            return () => unsubscribe?.();
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    const handleUpdatePermissions = async (permissions: Partial<UserPermissions>) => {
        if (!selectedEmployee) return;
        await updateUserPermissions(selectedEmployee.uid, permissions);
    };

    const handleUpdateCommission = async (rate: number) => {
        if (!selectedEmployee) return;
        await updateUserCommission(selectedEmployee.uid, rate);
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
                <button
                    onClick={() => navigate('/admin')}
                    className="p-3 rounded-full bg-neo-bg shadow-neo-out active:shadow-neo-pressed transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-display font-bold text-neo-text">Equipe</h1>
                    <p className="text-sm text-neo-text-secondary">Profissionais & Comissões</p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-neo shadow-neo-out text-center">
                    <p className="text-2xl font-bold text-neo-accent">{employees.length}</p>
                    <p className="text-xs text-neo-text-secondary">Profissionais</p>
                </div>
                <div className="p-4 rounded-neo shadow-neo-out text-center">
                    <p className="text-2xl font-bold text-neo-success">{employees.filter(e => e.role === 'owner').length}</p>
                    <p className="text-xs text-neo-text-secondary">Proprietários</p>
                </div>
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
                <button
                    onClick={() => setShowAddModal(true)}
                    className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-neo-out-lg flex items-center justify-center text-white active:shadow-neo-pressed transition-all z-40"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </button>
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
