'use client';

import { useState } from 'react';
import { useAlerts, useAcknowledgeAlert } from '@/hooks/useAlerts';
import { Alert } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils/format';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AlertsPage() {
    const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
    const [limit, setLimit] = useState(25);
    const [offset, setOffset] = useState(0);

    // Fetch data with pagination
    const { data: allAlerts, isLoading: loadingAll } = useAlerts({ limit, offset });
    const { data: unacknowledgedAlerts, isLoading: loadingUnack } = useAlerts({ 
        acknowledged: false, 
        limit, 
        offset 
    });
    const { data: acknowledgedAlerts, isLoading: loadingAck } = useAlerts({ 
        acknowledged: true, 
        limit, 
        offset 
    });
    const acknowledgeAlert = useAcknowledgeAlert();

    const getAlertsForFilter = () => {
        switch (filter) {
            case 'unacknowledged':
                return unacknowledgedAlerts || [];
            case 'acknowledged':
                return acknowledgedAlerts || [];
            default:
                return allAlerts || [];
        }
    };

    const isLoading = () => {
        switch (filter) {
            case 'unacknowledged':
                return loadingUnack;
            case 'acknowledged':
                return loadingAck;
            default:
                return loadingAll;
        }
    };

    const alerts = getAlertsForFilter();
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = alerts && alerts.length === limit;
    const hasPrevPage = offset > 0;

    const handleNextPage = () => {
        setOffset((prev) => prev + limit);
    };

    const handlePrevPage = () => {
        setOffset((prev) => Math.max(0, prev - limit));
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setOffset(0); // Reset to first page
    };

    const handleFilterChange = (value: string) => {
        setFilter(value as any);
        setOffset(0); // Reset pagination when changing filter
    };

    const handleAcknowledge = async (id: string) => {
        try {
            await acknowledgeAlert.mutateAsync(id);
            toast.success('Alert acknowledged successfully');
        } catch (error) {
            toast.error('Failed to acknowledge alert');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'HIGH':
                return 'bg-red-500/10 text-red-500 border-0';
            case 'MEDIUM':
                return 'bg-orange-500/10 text-orange-500 border-0';
            case 'LOW':
                return 'bg-amber-500/10 text-amber-500 border-0';
            default:
                return 'bg-slate-500/10 text-slate-500 border-0';
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'DOWN':
                return '🔴';
            case 'SLOW':
                return '🟡';
            case 'ERROR':
                return '⚠️';
            default:
                return '⚠️';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Alerts</h1>
                <p className="text-slate-400">Manage and acknowledge system alerts</p>
            </div>

            {/* Tabs & Controls */}
            <div className="flex items-center justify-between gap-4">
                <Tabs defaultValue="all" value={filter} onValueChange={handleFilterChange} className="flex-1">
                    <TabsList className="bg-white/50 border border-slate-700">
                        <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 cursor-pointer">
                            All Alerts
                        </TabsTrigger>
                        <TabsTrigger value="unacknowledged" className="data-[state=active]:bg-blue-600 cursor-pointer">
                            Unacknowledged
                            {unacknowledgedAlerts && unacknowledgedAlerts.length > 0 && (
                                <Badge className="ml-2 bg-black/20 text-red-400 border-0">
                                    {unacknowledgedAlerts.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="acknowledged" className="data-[state=active]:bg-blue-600 cursor-pointer">
                            Acknowledged
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

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
                    </SelectContent>
                </Select>
            </div>

            {/* Alerts Content */}
            {isLoading() ? (
                <div className="space-y-3">
                    <Skeleton className="h-32 bg-slate-800" />
                    <Skeleton className="h-32 bg-slate-800" />
                    <Skeleton className="h-32 bg-slate-800" />
                </div>
            ) : alerts.length === 0 ? (
                <Card className="p-12 text-center glass border-slate-800/50">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">
                        No {filter === 'unacknowledged' ? 'Unacknowledged ' : filter === 'acknowledged' ? 'Acknowledged ' : ''}Alerts
                    </h3>
                    <p className="text-sm text-slate-500">
                        {filter === 'unacknowledged' ? 'All alerts have been acknowledged' : 'No alerts found'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <Card
                            key={alert.id}
                            className="p-5 glass border-slate-800/50 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{getAlertIcon(alert.alertType)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={getSeverityColor(alert.severity)}>
                                            {alert.severity}
                                        </Badge>
                                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                                            {alert.alertType}
                                        </Badge>
                                        {alert.isAcknowledged && (
                                            <Badge variant="outline" className="border-emerald-700 text-emerald-500">
                                                Acknowledged
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {alert.message}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>Created: {formatDate(alert.createdAt)}</span>
                                        {alert.acknowledgedAt && (
                                            <span>Acknowledged: {formatDate(alert.acknowledgedAt)}</span>
                                        )}
                                    </div>
                                </div>
                                {!alert.isAcknowledged && (
                                    <Button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        disabled={acknowledgeAlert.isPending}
                                        className="gradient-success border-0"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Acknowledge
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}

                    {/* Pagination */}
                    <Card className="p-4 glass border-slate-800/50">
                        <Pagination
                            currentPage={currentPage}
                            offset={offset}
                            limit={limit}
                            totalDisplayed={alerts.length}
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
}