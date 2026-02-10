'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Endpoint, EndpointWithStatus } from '@/lib/types';
import { formatRelativeTime, formatResponseTime } from '@/lib/utils/format';
import { Activity, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StatusGridProps {
    endpoints: Endpoint[];
}

export default function StatusGrid({ endpoints }: StatusGridProps) {
    const getStatusColor = (isActive: boolean) => {
        if (!isActive) return 'text-slate-500 bg-slate-500/10';
        // We would need real-time data to show actual status
        // For now, assuming active endpoints are "UP"
        return 'text-emerald-500 bg-emerald-500/10';
    };

    const getStatusLabel = (isActive: boolean) => {
        return isActive ? 'UP' : 'INACTIVE';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endpoints.length === 0 ? (
                <Card className="col-span-full p-12 text-center glass border-slate-800/50">
                    <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">
                        No Endpoints Yet
                    </h3>
                    <p className="text-sm text-slate-500">
                        Create your first endpoint to start monitoring
                    </p>
                </Card>
            ) : (
                endpoints.map((endpoint, index) => (
                    <motion.div
                        key={endpoint.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <Link href={`/endpoints/${endpoint.id}`}>
                            <Card className="p-5 glass border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                            {endpoint.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate mt-1" title={endpoint.url}>
                                            {endpoint.url}
                                        </p>
                                    </div>
                                    <Badge className={`ml-2 ${getStatusColor(endpoint.isActive)} border-0`}>
                                        {getStatusLabel(endpoint.isActive)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>{endpoint.method}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Every {endpoint.checkInterval}m</span>
                                    </div>
                                </div>

                                {endpoint.isActive && (
                                    <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Last Check</span>
                                        <span className="text-xs text-slate-400">{formatRelativeTime(endpoint.updatedAt)}</span>
                                    </div>
                                )}
                            </Card>
                        </Link>
                    </motion.div>
                ))
            )}
        </div>
    );
}
