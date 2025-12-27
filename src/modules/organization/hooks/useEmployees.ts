import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrgEmployees, updateUserPermissions, updateUserCommission, removeEmployee } from '../services/organizationService';
import { UserProfile, UserPermissions } from '../../../shared/types/types';
import { toast } from 'sonner';

export const useEmployees = (orgId: string | undefined) => {
    return useQuery<UserProfile[]>({
        queryKey: ['employees', orgId],
        queryFn: () => (orgId ? getOrgEmployees(orgId) : Promise.resolve([])),
        enabled: !!orgId,
    });
};

export const useEmployeeMutations = (orgId: string | undefined) => {
    const queryClient = useQueryClient();

    const updatePermissionsMutation = useMutation({
        mutationFn: ({ userId, permissions }: { userId: string; permissions: Partial<UserPermissions> }) =>
            updateUserPermissions(userId, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', orgId] });
            toast.success('Permissões atualizadas');
        },
        onError: () => toast.error('Erro ao atualizar permissões'),
    });

    const updateCommissionMutation = useMutation({
        mutationFn: ({ userId, rate }: { userId: string; rate: number }) =>
            updateUserCommission(userId, rate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', orgId] });
            toast.success('Comissão atualizada');
        },
        onError: () => toast.error('Erro ao atualizar comissão'),
    });

    const removeEmployeeMutation = useMutation({
        mutationFn: (userId: string) => removeEmployee(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', orgId] });
            toast.success('Colaborador removido');
        },
        onError: () => toast.error('Erro ao remover colaborador'),
    });

    return {
        updatePermissions: updatePermissionsMutation.mutate,
        updateCommission: updateCommissionMutation.mutate,
        removeEmployee: removeEmployeeMutation.mutate,
        isUpdating: updatePermissionsMutation.isPending || updateCommissionMutation.isPending,
        isRemoving: removeEmployeeMutation.isPending,
    };
};
