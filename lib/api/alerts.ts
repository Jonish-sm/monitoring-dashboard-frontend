import { apiClient } from './client';
import { Alert } from '@/lib/types';

interface GetAlertsParams {
    acknowledged?: boolean;
    limit?: number;
}

interface GetEndpointAlertsParams {
    endpointId: string;
    limit?: number;
}

export const alertsApi = {
    /**
     * Get all alerts
     */
    getAll: async (params?: GetAlertsParams): Promise<Alert[]> => {
        const { data } = await apiClient.get<Alert[]>('/alerts', { params });
        return data;
    },

    /**
     * Get alerts for a specific endpoint
     */
    getByEndpoint: async ({ endpointId, limit }: GetEndpointAlertsParams): Promise<Alert[]> => {
        const { data } = await apiClient.get<Alert[]>(
            `/alerts/endpoint/${endpointId}`,
            { params: { limit } }
        );
        return data;
    },

    /**
     * Acknowledge an alert
     */
    acknowledge: async (id: string): Promise<Alert> => {
        const { data } = await apiClient.put<Alert>(`/alerts/${id}/acknowledge`);
        return data;
    },
};
