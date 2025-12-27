import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '../services/serviceService';
import { Service } from '../../../shared/types/types';
import { toast } from 'sonner';

export const useServices = (orgId: string | undefined) => {
    return useQuery<Service[]>({
        queryKey: ['services', orgId],
        queryFn: () => (orgId ? getServices(orgId) : Promise.resolve([])),
        enabled: !!orgId,
    });
};

export const useServiceMutations = (orgId: string | undefined) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services', orgId] });
            toast.success('Serviço adicionado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao adicionar serviço.');
            console.error(error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Service> }) => updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services', orgId] });
            toast.success('Serviço atualizado!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar serviço.');
            console.error(error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services', orgId] });
            toast.success('Serviço removido.');
        },
        onError: (error) => {
            toast.error('Erro ao remover serviço.');
            console.error(error);
        }
    });

    return {
        createService: createMutation.mutate,
        updateService: updateMutation.mutate,
        deleteService: deleteMutation.mutate,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    };
};
