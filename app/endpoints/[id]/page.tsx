'use client';

import { useEndpoint } from '@/hooks/useEndpoints';
import { useEndpointAnalytics, useEndpointHealthLogs } from '@/hooks/useHealthLogs';
import { useEndpointAlerts } from '@/hooks/useAlerts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCard from '@/components/dashboard/StatsCard';
import { Activity, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatDate, formatResponseTime, formatUptime } from '@/lib/utils/format';
import { useState } from 'react';
import { TIME_RANGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: {
        id: string;
    };
}

export default function EndpointDetailPage({ params }: PageProps) {
    const [timeRange, setTimeRange] = useState(24);
    const { data: endpoint, isLoading: endpointLoading } = useEndpoint(params.id);
    const { data: analytics, isLoading: analyticsLoading } = useEndpointAnalytics(
        params.id,
        timeRange
    );
    const { data: healthLogs } = useEndpointHealthLogs(params.id, 50);
    const { data: alerts } = useEndpointAlerts(params.id, 10);

    if (endpointLoading || analyticsLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64 bg-slate-800" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 bg-slate-800" />
                    ))}
                </div>
            </div>
        );
    }

    if (!endpoint) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Endpoint not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/endpoints">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Endpoints
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{endpoint.name}</h1>
                    <p className="text-slate-400">{endpoint.url}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                            {endpoint.method}
                        </Badge>
                        <Badge
                            className={
                                endpoint.isActive
                                    ? 'bg-emerald-500/10 text-emerald-500 border-0'
                                    : 'bg-slate-500/10 text-slate-500 border-0'
                            }
                        >
                            {endpoint.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 mr-2">Time Range:</span>
                {TIME_RANGES.map((range) => (
                    <Button
                        key={range.value}
                        size="sm"
                        variant={timeRange === range.value ? 'default' : 'outline'}
                        onClick={() => setTimeRange(range.value)}
                        className={
                            timeRange === range.value
                                ? 'gradient-primary border-0'
                                : 'border-slate-700 text-slate-400'
                        }
                    >
                        {range.label}
                    </Button>
                ))}
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Checks"
                        value={analytics.totalChecks}
                        icon={Activity}
                        description={analytics.timeRange}
                        gradient="gradient-primary"
                    />
                    <StatsCard
                        title="Uptime"
                        value={formatUptime(analytics.uptimePercentage)}
                        icon={TrendingUp}
                        description={`${analytics.successfulChecks} successful`}
                        gradient="gradient-success"
                    />
                    <StatsCard
                        title="Avg Response Time"
                        value={formatResponseTime(analytics.averageResponseTime)}
                        icon={Clock}
                        description="Average latency"
                        gradient="gradient-warning"
                    />
                    <StatsCard
                        title="Last Check"
                        value={analytics.lastCheckStatus || 'N/A'}
                        icon={CheckCircle2}
                        description={analytics.failedChecks > 0 ? `${analytics.failedChecks} failures` : 'All healthy'}
                        gradient={analytics.lastCheckStatus === 'UP' ? 'gradient-success' : 'gradient-error'}
                    />
                </div>
            )}

            {/* Recent Health Logs */}
            <Card className="p-6 glass border-slate-800/50">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Health Logs</h2>
                {healthLogs && healthLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                                        Time
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
                                        Error
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {healthLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-slate-300">
                                            {formatDate(log.checkedAt)}
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
                    <p className="text-center text-slate-500 py-8">No health logs available</p>
                )}
            </Card>

            {/* Alerts for this endpoint */}
            {alerts && alerts.length > 0 && (
                <Card className="p-6 glass border-slate-800/50">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts</h2>
                    <div className="space-y-2">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                            className={
                                                alert.severity === 'HIGH'
                                                    ? 'bg-red-500/10 text-red-500 border-0'
                                                    : alert.severity === 'MEDIUM'
                                                        ? 'bg-orange-500/10 text-orange-500 border-0'
                                                        : 'bg-amber-500/10 text-amber-500 border-0'
                                            }
                                        >
                                            {alert.severity}
                                        </Badge>
                                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                                            {alert.alertType}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-300">{alert.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">{formatDate(alert.createdAt)}</p>
                                </div>
                                {alert.isAcknowledged && (
                                    <Badge variant="outline" className="border-emerald-700 text-emerald-500">
                                        Acknowledged
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
