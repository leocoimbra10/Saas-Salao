/**
 * useBrideTimeline Hook
 * Manages the granular timeline data for a specific bride package
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTimeline, updateTimelineMilestone } from '../services/brideService';
import { TimelineMilestone } from '../types/brideTypes';
import { toast } from 'sonner';

export const useBrideTimeline = (packageId: string | undefined) => {
    const queryClient = useQueryClient();

    const { data: timeline, isLoading, error } = useQuery({
        queryKey: ['bride_timeline', packageId],
        queryFn: () => (packageId ? getTimeline(packageId) : Promise.resolve([])),
        enabled: !!packageId,
    });

    const updateMilestoneMutation = useMutation({
        mutationFn: ({ milestoneId, updates }: { milestoneId: string; updates: Partial<TimelineMilestone> }) =>
            updateTimelineMilestone(packageId!, milestoneId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bride_timeline', packageId] });
            toast.success('Cronograma atualizado');
        },
        onError: () => {
            toast.error('Erro ao atualizar cronograma');
        }
    });

    return {
        timeline,
        isLoading,
        error,
        updateMilestone: updateMilestoneMutation.mutate,
        isUpdating: updateMilestoneMutation.isPending
    };
};
