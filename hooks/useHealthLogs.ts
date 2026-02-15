import { useQuery } from '@tanstack/react-query';
import { healthLogsApi } from '@/lib/api/health-logs';
import { POLLING_INTERVALS } from '@/lib/constants';

/**
 * Hook to fetch all health logs
 */
export const useHealthLogs = (params?: { limit?: number; offset?: number }) => {
    return useQuery({
        queryKey: ['health-logs', params],
        queryFn: () => healthLogsApi.getAll(params),
        refetchInterval: POLLING_INTERVALS.HEALTH_LOGS,
    });
};

/**
 * Hook to fetch health logs for a specific endpoint
 */
export const useEndpointHealthLogs = (endpointId: string, limit?: number, offset?: number) => {
    return useQuery({
        queryKey: ['health-logs', 'endpoint', endpointId, limit, offset],
        queryFn: () => healthLogsApi.getByEndpoint({ endpointId, limit, offset }),
        enabled: !!endpointId,
    });
};

/**
 * Hook to fetch analytics for a specific endpoint
 */
export const useEndpointAnalytics = (endpointId: string, hours: number = 24) => {
    return useQuery({
        queryKey: ['analytics', endpointId, hours],
        queryFn: () => healthLogsApi.getAnalytics({ endpointId, hours }),
        enabled: !!endpointId,
    });
};
