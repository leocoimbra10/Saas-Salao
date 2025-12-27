import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import { Staff } from '../../../shared/types/types';
import { toast } from 'sonner';

export const useStaff = (orgId: string | undefined) => {
    return useQuery<Staff[]>({
        queryKey: ['staff', orgId],
        queryFn: () => (orgId ? getStaff(orgId) : Promise.resolve([])),
        enabled: !!orgId,
    });
};

export const useStaffMutations = (orgId: string | undefined) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff', orgId] });
            toast.success('Profissional adicionado!');
        },
        onError: (error) => {
            toast.error('Erro ao adicionar profissional.');
            console.error(error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Staff> }) => updateStaff(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff', orgId] });
            toast.success('Dados atualizados!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar dados.');
            console.error(error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff', orgId] });
            toast.success('Profissional removido.');
        },
        onError: (error) => {
            toast.error('Erro ao remover profissional.');
            console.error(error);
        }
    });

    return {
        createStaff: createMutation.mutate,
        updateStaff: updateMutation.mutate,
        deleteStaff: deleteMutation.mutate,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    };
};
