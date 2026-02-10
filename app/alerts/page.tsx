'use client';

import { useState } from 'react';
import { useAlerts, useAcknowledgeAlert } from '@/hooks/useAlerts';
import { Alert } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils/format';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AlertsPage() {
    const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
    const { data: allAlerts } = useAlerts();
    const { data: unacknowledgedAlerts } = useAlerts({ acknowledged: false });
    const { data: acknowledgedAlerts } = useAlerts({ acknowledged: true });
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

    const alerts = getAlertsForFilter();

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

            {/* Tabs */}
            <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
                <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                        All Alerts
                    </TabsTrigger>
                    <TabsTrigger value="unacknowledged" className="data-[state=active]:bg-blue-600">
                        Unacknowledged
                        {unacknowledgedAlerts && unacknowledgedAlerts.length > 0 && (
                            <Badge className="ml-2 bg-red-500/20 text-red-400 border-0">
                                {unacknowledgedAlerts.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="acknowledged" className="data-[state=active]:bg-blue-600">
                        Acknowledged
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6 space-y-3">
                    {alerts.length === 0 ? (
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
                        alerts.map((alert) => (
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
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
