import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBridalPackage, getBridalPackagesByOrg, updateBridalPackage, createBridalPackage, getTimeline, getMoodboard, updateTimelineMilestone, uploadMoodboardPhoto, deleteMoodboardPhoto } from '../services/brideService';
import { BridalPackage, TimelineMilestone, MoodboardPhoto } from '../types/brideTypes';
import { toast } from 'sonner';

export const useBridePackage = (packageId: string | undefined) => {
    return useQuery<BridalPackage | null>({
        queryKey: ['bridePackage', packageId],
        queryFn: () => (packageId ? getBridalPackage(packageId) : Promise.resolve(null)),
        enabled: !!packageId,
    });
};

export const useBridePackages = (orgId: string | undefined) => {
    return useQuery<BridalPackage[]>({
        queryKey: ['bridePackages', orgId],
        queryFn: () => (orgId ? getBridalPackagesByOrg(orgId) : Promise.resolve([])),
        enabled: !!orgId,
    });
};

export const useBrideTimeline = (packageId: string | undefined) => {
    return useQuery<TimelineMilestone[]>({
        queryKey: ['brideTimeline', packageId],
        queryFn: () => (packageId ? getTimeline(packageId) : Promise.resolve([])),
        enabled: !!packageId,
    });
};

export const useBrideMoodboard = (packageId: string | undefined) => {
    return useQuery<MoodboardPhoto[]>({
        queryKey: ['brideMoodboard', packageId],
        queryFn: () => (packageId ? getMoodboard(packageId) : Promise.resolve([])),
        enabled: !!packageId,
    });
};

export const useBrideMutations = (packageId?: string, orgId?: string) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<BridalPackage> }) => updateBridalPackage(id, updates),
        onSuccess: () => {
            if (packageId) queryClient.invalidateQueries({ queryKey: ['bridePackage', packageId] });
            if (orgId) queryClient.invalidateQueries({ queryKey: ['bridePackages', orgId] });
            toast.success('Dados da noiva atualizados!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar dados.');
            console.error(error);
        }
    });

    const createMutation = useMutation({
        mutationFn: (newPackage: Omit<BridalPackage, 'id'>) => createBridalPackage(newPackage),
        onSuccess: () => {
            if (orgId) queryClient.invalidateQueries({ queryKey: ['bridePackages', orgId] });
            toast.success('Pacote de noiva criado!');
        },
        onError: (error) => {
            toast.error('Erro ao criar pacote.');
            console.error(error);
        }
    });

    const updateTimeline = useMutation({
        mutationFn: ({ milestoneId, updates }: { milestoneId: string; updates: Partial<TimelineMilestone> }) =>
            updateTimelineMilestone(packageId!, milestoneId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brideTimeline', packageId] });
            toast.success('Cronograma atualizado');
        },
    });

    const uploadPhoto = useMutation({
        mutationFn: ({ file, category, notes }: { file: File; category: MoodboardPhoto['category']; notes?: string }) =>
            uploadMoodboardPhoto(packageId!, file, category, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brideMoodboard', packageId] });
            toast.success('Foto adicionada ao Moodboard');
        },
    });

    const deletePhoto = useMutation({
        mutationFn: (photoId: string) => deleteMoodboardPhoto(packageId!, photoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brideMoodboard', packageId] });
            toast.success('Foto removida');
        },
    });

    return {
        updatePackage: updateMutation.mutate,
        createPackage: createMutation.mutate,
        updateTimeline: updateTimeline.mutate,
        uploadPhoto: uploadPhoto.mutate,
        deletePhoto: deletePhoto.mutate,
        isUpdatingPackage: updateMutation.isPending,
        isCreatingPackage: createMutation.isPending,
        isUpdatingTimeline: updateTimeline.isPending,
        isUploadingPhoto: uploadPhoto.isPending,
        isDeletingPhoto: deletePhoto.isPending,
    };
};
