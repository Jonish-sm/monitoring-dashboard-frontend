'use client';

import { useEndpoints } from '@/hooks/useEndpoints';
import { Endpoint } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import CreateEndpointDialog from '@/components/endpoints/CreateEndpointDialog';
import EndpointActions from '@/components/endpoints/EndpointActions';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/utils/format';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns: ColumnDef<Endpoint>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-slate-700/50"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                <div className="font-medium text-white">{row.getValue('name')}</div>
                <div className="text-xs text-slate-500 truncate max-w-md" title={row.original.url}>
                    {row.original.url}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'method',
        header: 'Method',
        cell: ({ row }) => (
            <Badge variant="outline" className="border-slate-700 text-slate-300">
                {row.getValue('method')}
            </Badge>
        ),
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean;
            return (
                <Badge
                    className={
                        isActive
                            ? 'bg-emerald-500/10 text-emerald-500 border-0'
                            : 'bg-slate-500/10 text-slate-500 border-0'
                    }
                >
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'checkInterval',
        header: 'Check Interval',
        cell: ({ row }) => (
            <span className="text-slate-300">
                {formatDuration(row.getValue('checkInterval'))}
            </span>
        ),
    },
    {
        accessorKey: 'expectedStatus',
        header: 'Expected Status',
        cell: ({ row }) => (
            <span className="text-slate-300">{row.getValue('expectedStatus')}</span>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <EndpointActions endpoint={row.original} />,
    },
];

export default function EndpointsPage() {
    const { data: endpoints, isLoading } = useEndpoints();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48 bg-slate-800" />
                    <Skeleton className="h-10 w-32 bg-slate-800" />
                </div>
                <Skeleton className="h-96 bg-slate-800" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Endpoints</h1>
                    <p className="text-slate-400">
                        Manage and monitor your API endpoints
                    </p>
                </div>
                <CreateEndpointDialog />
            </div>

            {/* Endpoints Table */}
            <DataTable columns={columns} data={endpoints || []} />
        </div>
    );
}
