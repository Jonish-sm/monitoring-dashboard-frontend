'use client';

import { Card } from '@/components/ui/card';
import { HealthLog } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ResponseTimeChartProps {
    healthLogs: HealthLog[];
    title?: string;
    height?: number;
}

export default function ResponseTimeChart({
    healthLogs,
    title = 'Response Time Trend',
    height = 250,
}: ResponseTimeChartProps) {
    // Transform health logs into chart data (sorted by time ascending)
    const chartData = [...healthLogs]
        .sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime())
        .map((log) => ({
            time: format(new Date(log.checkedAt), 'HH:mm'),
            responseTime: log.responseTimeMs ?? 0,
            success: log.success,
        }));

    if (chartData.length === 0) {
        return (
            <Card className="p-6 glass border-slate-800/50">
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                <div className="flex items-center justify-center h-[200px] text-slate-500">
                    No response time data available
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 glass border-slate-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
                        tickFormatter={(value) => `${value}ms`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(0)}ms`, 'Response Time'] : ['N/A', 'Response Time']}
                    />
                    <Area
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#responseTimeGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
