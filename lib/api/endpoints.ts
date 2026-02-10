import { apiClient } from './client';
import { Endpoint, CreateEndpointDto, UpdateEndpointDto } from '@/lib/types';

export const endpointsApi = {
    /**
     * Get all endpoints
     */
    getAll: async (): Promise<Endpoint[]> => {
        const { data } = await apiClient.get<Endpoint[]>('/endpoints');
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
