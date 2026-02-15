'use client';

import { Endpoint } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreVertical, Trash2, Power } from 'lucide-react';
import Link from 'next/link';
import { useDeleteEndpoint, useUpdateEndpoint } from '@/hooks/useEndpoints';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEndpointFormData, createEndpointSchema } from '@/lib/utils/validation';
import { HTTP_METHODS } from '@/lib/constants';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';

interface EndpointActionsProps {
    endpoint: Endpoint;
}

export default function EndpointActions({ endpoint }: EndpointActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const deleteEndpoint = useDeleteEndpoint();
    const updateEndpoint = useUpdateEndpoint();

    const form = useForm({
        resolver: zodResolver(createEndpointSchema),
        defaultValues: {
            name: endpoint.name,
            url: endpoint.url,
            method: endpoint.method,
            expectedStatus: endpoint.expectedStatus,
            checkInterval: endpoint.checkInterval,
            headers: endpoint.headers || undefined,
        },
    });

    const handleEdit = async (data: CreateEndpointFormData) => {
        try {
            const submitData = {
                ...data,
                headers: data.headers ? Object.fromEntries(
                    Object.entries(data.headers).map(([key, value]) => [key, String(value)])
                ) : undefined,
            };
            await updateEndpoint.mutateAsync({
                id: endpoint.id,
                dto: submitData,
            });
            toast.success('Endpoint updated successfully');
            setShowEditDialog(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update endpoint');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEndpoint.mutateAsync(endpoint.id);
            toast.success('Endpoint deleted successfully');
            setShowDeleteDialog(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to delete endpoint');
        }
    };

    const handleToggleActive = async () => {
        try {
            await updateEndpoint.mutateAsync({
                id: endpoint.id,
                dto: { isActive: !endpoint.isActive },
            });
            toast.success(
                `Endpoint ${endpoint.isActive ? 'deactivated' : 'activated'} successfully`
            );
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update endpoint');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-700 focus:text-white">
                        <Link href={`/endpoints/${endpoint.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowEditDialog(true)}
                        className="text-slate-300 focus:bg-slate-700 focus:text-white"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleToggleActive}
                        className="text-slate-300 focus:bg-slate-700 focus:text-white"
                    >
                        <Power className="mr-2 h-4 w-4" />
                        {endpoint.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Endpoint</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete "{endpoint.name}"? This action cannot be undone.
                            All associated health logs and alerts will also be removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteEndpoint.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteEndpoint.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-125 bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Endpoint</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update the endpoint details
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="My API Endpoint"
                                                {...field}
                                                className="bg-slate-800 border-slate-700 text-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* URL */}
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://api.example.com/health"
                                                {...field}
                                                className="bg-slate-800 border-slate-700 text-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Method & Expected Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Method</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                        <SelectValue placeholder="Select method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    {HTTP_METHODS.map((method) => (
                                                        <SelectItem key={method} value={method} className="text-white">
                                                            {method}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="expectedStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Expected Status</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="200"
                                                    {...field}
                                                    onChange={(e) => field.onChange(+e.target.value)}
                                                    className="bg-slate-800 border-slate-700 text-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Check Interval */}
                            <FormField
                                control={form.control}
                                name="checkInterval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Check Interval (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="5"
                                                {...field}
                                                onChange={(e) => field.onChange(+e.target.value)}
                                                className="bg-slate-800 border-slate-700 text-white"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-slate-500 text-xs">
                                            How often to check this endpoint
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditDialog(false)}
                                    className="border-slate-700 text-slate-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateEndpoint.isPending}
                                    className="gradient-primary border-0"
                                >
                                    {updateEndpoint.isPending ? 'Updating...' : 'Update Endpoint'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
