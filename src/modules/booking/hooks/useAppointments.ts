import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { Appointment } from '../../../shared/types/types';
import { toast } from 'sonner';

export const useAppointments = (orgId: string | undefined) => {
    return useQuery<Appointment[]>({
        queryKey: ['appointments', orgId],
        queryFn: () => (orgId ? getAppointments(orgId) : Promise.resolve([])),
        enabled: !!orgId,
    });
};

export const useAppointmentMutations = (orgId: string | undefined) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', orgId] });
            toast.success('Agendamento criado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao criar agendamento.');
            console.error(error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Appointment> }) => updateAppointment(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', orgId] });
            toast.success('Agendamento atualizado!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar agendamento.');
            console.error(error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', orgId] });
            toast.success('Agendamento removido.');
        },
        onError: (error) => {
            toast.error('Erro ao remover agendamento.');
            console.error(error);
        }
    });

    return {
        createAppointment: createMutation.mutate,
        updateAppointment: updateMutation.mutate,
        deleteAppointment: deleteMutation.mutate,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    };
};
