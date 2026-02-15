'use client';

import { useEndpoints } from '@/hooks/useEndpoints';
import { useAlerts } from '@/hooks/useAlerts';
import StatsCard from '@/components/dashboard/StatsCard';
import StatusGrid from '@/components/dashboard/StatusGrid';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import UptimeChart from '@/components/dashboard/UptimeChart';
import { Globe, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: endpoints, isLoading: endpointsLoading } = useEndpoints();
  const { data: alerts, isLoading: alertsLoading } = useAlerts({ acknowledged: false, limit: 5, offset: 1 });

  const totalEndpoints = endpoints?.length || 0;
  const activeEndpoints = endpoints?.filter(e => e.isActive).length || 0;
  const unacknowledgedAlerts = alerts?.length || 0;

  // Calculate average uptime (placeholder - would need real analytics data)
  const averageUptime = 99.5;

  if (endpointsLoading || alertsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2 bg-slate-800" />
          <Skeleton className="h-4 w-96 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Monitor your API endpoints in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Endpoints"
          value={totalEndpoints}
          icon={Globe}
          description="Monitored endpoints"
          gradient="gradient-primary"
        />
        <StatsCard
          title="Active Endpoints"
          value={activeEndpoints}
          icon={Activity}
          description="Currently monitoring"
          gradient="gradient-success"
        />
        <StatsCard
          title="Unacknowledged Alerts"
          value={unacknowledgedAlerts}
          icon={AlertTriangle}
          description="Requires attention"
          gradient="gradient-warning"
        />
        <StatsCard
          title="Average Uptime"
          value={`${averageUptime}%`}
          icon={TrendingUp}
          description="Last 24 hours"
          gradient="gradient-success"
        />
      </div>

      {/* Uptime Chart */}
      <UptimeChart />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Grid - 2 columns on large screens */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Live Status</h2>
          <StatusGrid endpoints={endpoints || []} />
        </div>

        {/* Recent Alerts - 1 column on large screens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
            {alerts && alerts.length > 0 && (
              <span className="text-sm text-slate-400">
                {unacknowledgedAlerts} unacknowledged
              </span>
            )}
          </div>
          <RecentAlerts alerts={alerts || []} />
        </div>
      </div>
    </div>
  );
}
