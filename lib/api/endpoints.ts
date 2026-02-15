import { apiClient } from './client';
import { Endpoint, CreateEndpointDto, UpdateEndpointDto } from '@/lib/types';

interface GetAllParams {
    limit?: number;
    offset?: number;
    endpointName?: string;
}

export const endpointsApi = {
    /**
     * Get all endpoints with optional pagination and name filter
     */
    getAll: async (params?: GetAllParams): Promise<Endpoint[]> => {
        const { data } = await apiClient.get<Endpoint[]>('/endpoints', {
            params: {
                limit: params?.limit,
                offset: params?.offset,
                endpointName: params?.endpointName,
            },
        });
        return data;
    },

    /**
     * Get a specific endpoint by ID
     */
    getById: async (id: string): Promise<Endpoint> => {
        const { data } = await apiClient.get<Endpoint>(`/endpoints/${id}`);
        return data;
    },

    /**
     * Create a new endpoint
     */
    create: async (dto: CreateEndpointDto): Promise<Endpoint> => {
        const { data } = await apiClient.post<Endpoint>('/endpoints', dto);
        return data;
    },

    /**
     * Update an existing endpoint
     */
    update: async (id: string, dto: UpdateEndpointDto): Promise<Endpoint> => {
        const { data } = await apiClient.put<Endpoint>(`/endpoints/${id}`, dto);
        return data;
    },

    /**
     * Delete an endpoint
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/endpoints/${id}`);
    },
};
