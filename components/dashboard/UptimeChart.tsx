'use client';

import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Placeholder data - in real app, this would come from API
const generateMockData = () => {
    const data = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
        data.push({
            time: new Date(now - i * 60 * 60 * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            uptime: 95 + Math.random() * 5,
        });
    }
    return data;
};

export default function UptimeChart() {
    const data = generateMockData();

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
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Uptime']}
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
