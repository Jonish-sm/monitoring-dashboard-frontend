import { apiClient } from './client';
import { HealthLog, Analytics } from '@/lib/types';

interface GetHealthLogsParams {
    limit?: number;
    offset?: number;
}

interface GetEndpointLogsParams {
    endpointId: string;
    limit?: number;
    offset?: number;
}

interface GetAnalyticsParams {
    endpointId: string;
    hours?: number;
}

export const healthLogsApi = {
    /**
     * Get all health logs
     */
    getAll: async (params?: GetHealthLogsParams): Promise<HealthLog[]> => {
        const { data } = await apiClient.get<HealthLog[]>('/health-logs', { params });
        return data;
    },

    /**
     * Get health logs for a specific endpoint
     */
    getByEndpoint: async ({ endpointId, limit, offset }: GetEndpointLogsParams): Promise<HealthLog[]> => {
        const { data } = await apiClient.get<HealthLog[]>(
            `/health-logs/endpoint/${endpointId}`,
            { params: { limit, offset } }
        );
        return data;
    },

    /**
     * Get analytics for a specific endpoint
     */
    getAnalytics: async ({ endpointId, hours = 24 }: GetAnalyticsParams): Promise<Analytics> => {
        const { data } = await apiClient.get<Analytics>(
            `/health-logs/analytics/${endpointId}`,
            { params: { hours } }
        );
        return data;
    },
};
