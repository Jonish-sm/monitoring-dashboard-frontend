'use client';

import { useEndpoints } from '@/hooks/useEndpoints';
import { Endpoint } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import CreateEndpointDialog from '@/components/endpoints/CreateEndpointDialog';
import EndpointActions from '@/components/endpoints/EndpointActions';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { formatDuration } from '@/lib/utils/format';
import { ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';

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
    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedSearch = useDebounce(searchInput, 500);

    const { data: endpoints, isLoading } = useEndpoints({
        limit,
        offset,
        endpointName: debouncedSearch || ""
    });


    // Pagination handlers
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = endpoints && endpoints.length === limit;
    const hasPrevPage = offset > 0;

    const handleNextPage = useCallback(() => {
        setOffset((prev) => prev + limit);
    }, [limit]);

    const handlePrevPage = useCallback(() => {
        setOffset((prev) => Math.max(0, prev - limit));
    }, [limit]);

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setOffset(0);
    }, []);

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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
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

            {/* Search & Controls */}
            <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <Input
                        placeholder="Search endpoints by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                    />
                </div>

                {/* Per Page Selector */}
                <Select
                    value={String(limit)}
                    onValueChange={(value) => handleLimitChange(Number(value))}
                >
                    <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                        <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Endpoints Table */}
            <DataTable
                columns={columns}
                data={endpoints || []}
                currentPage={currentPage}
                offset={offset}
                limit={limit}
                totalDisplayed={endpoints?.length || 0}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
            />
        </motion.div>
    );
}