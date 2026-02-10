'use client';

import { useState } from 'react';
import { useHealthLogs } from '@/hooks/useHealthLogs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatResponseTime } from '@/lib/utils/format';
import { Search } from 'lucide-react';

export default function LogsPage() {
    const [search, setSearch] = useState('');
    const [limit] = useState(100);
    const { data: logs, isLoading } = useHealthLogs({ limit });

    const filteredLogs = logs?.filter((log) => {
        if (!search) return true;
        // Filter would need endpoint data to search by endpoint name
        // For now, just show all logs
        return true;
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 bg-slate-800" />
                <Skeleton className="h-96 bg-slate-800" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Health Logs</h1>
                <p className="text-slate-400">View all endpoint health check logs</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                <Input
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
            </div>

            {/* Logs Table */}
            <Card className="p-6 glass border-slate-800/50">
                {filteredLogs && filteredLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Time
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Endpoint ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Status Code
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Response Time
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Result
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Error Message
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-slate-300">
                                            {formatDate(log.checkedAt)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-400 font-mono text-xs">
                                            {log.endpointId.substring(0, 8)}...
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {log.statusCode ? (
                                                <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                    {log.statusCode}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-500">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-300">
                                            {formatResponseTime(log.responseTimeMs)}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Badge
                                                className={
                                                    log.success
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-0'
                                                        : 'bg-red-500/10 text-red-500 border-0'
                                                }
                                            >
                                                {log.success ? 'Success' : 'Failed'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-400 max-w-xs truncate">
                                            {log.errorMessage || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-slate-500 py-12">No logs found</p>
                )}
            </Card>
        </div>
    );
}
