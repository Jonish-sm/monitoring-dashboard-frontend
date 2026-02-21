'use client';

import { Card } from '@/components/ui/card';
import { HealthLog } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface UptimeChartProps {
    healthLogs?: HealthLog[];
}

function computeUptimeByHour(logs: HealthLog[]) {
    // Group logs by hour
    const hourMap = new Map<string, { total: number; success: number }>();

    for (const log of logs) {
        const hourKey = format(new Date(log.checkedAt), 'HH:mm');
        const entry = hourMap.get(hourKey) || { total: 0, success: 0 };
        entry.total++;
        if (log.success) entry.success++;
        hourMap.set(hourKey, entry);
    }

    // Convert to chart data sorted by time
    return Array.from(hourMap.entries())
        .map(([time, { total, success }]) => ({
            time,
            uptime: total > 0 ? (success / total) * 100 : 100,
        }));
}

export default function UptimeChart({ healthLogs }: UptimeChartProps) {
    const hasRealData = healthLogs && healthLogs.length > 0;
    const data = hasRealData ? computeUptimeByHour(healthLogs) : [];

    if (data.length === 0) {
        return (
            <Card className="p-6 glass border-slate-800/50">
                <h3 className="text-lg font-semibold text-white mb-4">Overall Uptime (24h)</h3>
                <div className="flex items-center justify-center h-[200px] text-slate-500">
                    No uptime data available yet
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 glass border-slate-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">Overall Uptime (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis
                        dataKey="time"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        domain={[90, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(2)}%`, 'Uptime'] : ['N/A', 'Uptime']}
                    />
                    <Area
                        type="monotone"
                        dataKey="uptime"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#uptimeGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
