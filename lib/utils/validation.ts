import { z } from 'zod';

/**
 * Schema for creating a new endpoint
 */
export const createEndpointSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Invalid URL format'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional().default('GET'),
    expectedStatus: z.number().min(100).max(599).optional().default(200),
    checkInterval: z.number().min(1).optional().default(5),
    headers: z.record(z.string()).optional(),
});

export type CreateEndpointFormData = z.infer<typeof createEndpointSchema>;

/**
 * Schema for updating an endpoint
 */
export const updateEndpointSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    url: z.string().url('Invalid URL format').optional(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
    expectedStatus: z.number().min(100).max(599).optional(),
    checkInterval: z.number().min(1).optional(),
    headers: z.record(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export type UpdateEndpointFormData = z.infer<typeof updateEndpointSchema>;
