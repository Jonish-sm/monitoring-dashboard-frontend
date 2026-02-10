'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils/format';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient?: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    gradient = 'gradient-primary',
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden glass border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 group">
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <div className="relative p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                            <motion.h3
                                className="text-3xl font-bold text-white"
                                key={value.toString()}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {typeof value === 'number' ? formatNumber(value) : value}
                            </motion.h3>
                            {description && (
                                <p className="text-xs text-slate-500 mt-1">{description}</p>
                            )}
                            {trend && (
                                <div className="flex items-center gap-1 mt-2">
                                    <span
                                        className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'
                                            }`}
                                    >
                                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                    </span>
                                    <span className="text-xs text-slate-500">vs last period</span>
                                </div>
                            )}
                        </div>

                        {/* Icon */}
                        <div className={`p-3 rounded-lg ${gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
