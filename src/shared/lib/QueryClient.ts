import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10, // 10 minutes for better performance
            gcTime: 1000 * 60 * 120, // 2 hours
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        },
    },
});
