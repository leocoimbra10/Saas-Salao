import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../services/organizationService';
import { Organization } from '../../../shared/types/types';

export const useOrganization = (orgId: string | undefined) => {
    return useQuery<Organization | null>({
        queryKey: ['organization', orgId],
        queryFn: () => (orgId ? getOrganization(orgId) : Promise.resolve(null)),
        enabled: !!orgId,
        staleTime: 1000 * 60 * 30, // Branding change rarely, keep for 30m
    });
};
