import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/lib/api/alerts';
import { POLLING_INTERVALS } from '@/lib/constants';

/**
 * Hook to fetch all alerts with optional filtering
 */
export const useAlerts = (params?: { 
    acknowledged?: boolean; 
    limit?: number; 
    offset?: number;
}) => {
    return useQuery({
        queryKey: ['alerts', params],
        queryFn: () => alertsApi.getAll(params),
        refetchInterval: POLLING_INTERVALS.ALERTS,
        refetchIntervalInBackground: true,
    });
};

/**
 * Hook to fetch alerts for a specific endpoint
 */
export const useEndpointAlerts = (endpointId: string, limit?: number) => {
    return useQuery({
        queryKey: ['alerts', 'endpoint', endpointId, limit],
        queryFn: () => alertsApi.getByEndpoint({ endpointId, limit }),
        enabled: !!endpointId,
    });
};

/**
 * Hook to acknowledge an alert
 */
export const useAcknowledgeAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => alertsApi.acknowledge(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
    });
};
