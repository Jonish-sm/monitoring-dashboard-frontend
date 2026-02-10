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

interface EndpointActionsProps {
    endpoint: Endpoint;
}

export default function EndpointActions({ endpoint }: EndpointActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const deleteEndpoint = useDeleteEndpoint();
    const updateEndpoint = useUpdateEndpoint();

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
                    <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white">
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
        </>
    );
}
