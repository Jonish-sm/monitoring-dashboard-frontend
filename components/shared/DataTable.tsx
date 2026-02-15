'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    // Pagination props
    currentPage?: number;
    offset?: number;
    limit?: number;
    totalDisplayed?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
    onNextPage?: () => void;
    onPrevPage?: () => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    currentPage,
    offset,
    limit,
    totalDisplayed,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    const showPagination = currentPage !== undefined && 
                          offset !== undefined && 
                          limit !== undefined && 
                          totalDisplayed !== undefined;

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="rounded-lg border border-slate-800/50 overflow-hidden glass">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-slate-800/50 hover:bg-slate-800/30">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-slate-400 font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {showPagination && (
                    <div className="p-4 border-t border-slate-800/50">
                        <Pagination
                            currentPage={currentPage}
                            offset={offset}
                            limit={limit}
                            totalDisplayed={totalDisplayed}
                            hasNextPage={hasNextPage || false}
                            hasPrevPage={hasPrevPage || false}
                            onNextPage={onNextPage || (() => {})}
                            onPrevPage={onPrevPage || (() => {})}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}