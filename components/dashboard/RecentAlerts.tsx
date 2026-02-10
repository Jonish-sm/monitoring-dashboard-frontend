'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils/format';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAcknowledgeAlert } from '@/hooks/useAlerts';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface RecentAlertsProps {
    alerts: Alert[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
    const acknowledgeAlert = useAcknowledgeAlert();

    const handleAcknowledge = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
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
                return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'MEDIUM':
                return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'LOW':
                return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default:
                return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
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

    if (alerts.length === 0) {
        return (
            <Card className="p-8 text-center glass border-slate-800/50">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">No Active Alerts</h3>
                <p className="text-sm text-slate-500">All systems are running smoothly</p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {alerts.slice(0, 10).map((alert, index) => (
                <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                    <Card className="p-4 glass border-slate-800/50 hover:border-orange-500/50 transition-all duration-300">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{getAlertIcon(alert.alertType)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className={`${getSeverityColor(alert.severity)} border`}>
                                        {alert.severity}
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                                        {alert.alertType}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-300 mb-1">{alert.message}</p>
                                <p className="text-xs text-slate-500">
                                    {formatRelativeTime(alert.createdAt)}
                                </p>
                            </div>
                            {!alert.isAcknowledged && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => handleAcknowledge(alert.id, e)}
                                    disabled={acknowledgeAlert.isPending}
                                    className="shrink-0 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                                >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                    Acknowledge
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
