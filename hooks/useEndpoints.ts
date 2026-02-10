import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpointsApi } from '@/lib/api/endpoints';
import { CreateEndpointDto, UpdateEndpointDto } from '@/lib/types';
import { POLLING_INTERVALS } from '@/lib/constants';

/**
 * Hook to fetch all endpoints with automatic polling
 */
export const useEndpoints = () => {
    return useQuery({
        queryKey: ['endpoints'],
        queryFn: endpointsApi.getAll,
        refetchInterval: POLLING_INTERVALS.ENDPOINTS,
        refetchIntervalInBackground: true,
    });
};

/**
 * Hook to fetch a single endpoint by ID
 */
export const useEndpoint = (id: string) => {
    return useQuery({
        queryKey: ['endpoints', id],
        queryFn: () => endpointsApi.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new endpoint
 */
export const useCreateEndpoint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateEndpointDto) => endpointsApi.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['endpoints'] });
        },
    });
};

/**
 * Hook to update an existing endpoint
 */
export const useUpdateEndpoint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateEndpointDto }) =>
            endpointsApi.update(id, dto),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['endpoints'] });
            queryClient.invalidateQueries({ queryKey: ['endpoints', variables.id] });
        },
    });
};

/**
 * Hook to delete an endpoint
 */
export const useDeleteEndpoint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => endpointsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['endpoints'] });
        },
    });
};
