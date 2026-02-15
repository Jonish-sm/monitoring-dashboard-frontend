"use client";

import { useEndpoint } from "@/hooks/useEndpoints";
import {
  useEndpointAnalytics,
  useEndpointHealthLogs,
} from "@/hooks/useHealthLogs";
import { useEndpointAlerts } from "@/hooks/useAlerts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import StatsCard from "@/components/dashboard/StatsCard";
import { Activity, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import {
  formatDate,
  formatResponseTime,
  formatUptime,
} from "@/lib/utils/format";
import { useState } from "react";
import { TIME_RANGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EndpointDetailPage({ params }: PageProps) {
  const paramsData = useParams();
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const id =
    typeof paramsData.id === "string"
      ? paramsData.id
      : Array.isArray(paramsData.id)
        ? paramsData.id[0]
        : "";
  const [timeRange, setTimeRange] = useState(24);

  const { data: endpoint, isLoading: endpointLoading } = useEndpoint(id);
  const { data: analytics, isLoading: analyticsLoading } = useEndpointAnalytics(
    id,
    timeRange,
  );
  const { data: healthLogs, isLoading: logsLoading } = useEndpointHealthLogs(
    id,
    limit,
    offset,
  );
  const { data: alerts } = useEndpointAlerts(id, 5);

  // Pagination handlers
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNextPage: any = healthLogs && healthLogs.length === limit;
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {endpoint.name}
          </h1>
          <p className="text-slate-400">{endpoint.url}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              {endpoint.method}
            </Badge>
            <Badge
              className={
                endpoint.isActive
                  ? "bg-emerald-500/10 text-emerald-500 border-0"
                  : "bg-slate-500/10 text-slate-500 border-0"
              }
            >
              {endpoint.isActive ? "Active" : "Inactive"}
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
            variant={timeRange === range.value ? "default" : "outline"}
            onClick={() => setTimeRange(range.value)}
            className={`
    cursor-pointer transition-colors
    ${
      timeRange === range.value
        ? "gradient-primary border-0 text-white hover:opacity-90"
        : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
    }
  `}
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
            value={analytics.lastCheckStatus || "N/A"}
            icon={CheckCircle2}
            description={
              analytics.failedChecks > 0
                ? `${analytics.failedChecks} failures`
                : "All healthy"
            }
            gradient={
              analytics.lastCheckStatus === "UP"
                ? "gradient-success"
                : "gradient-error"
            }
          />
        </div>
      )}

      {/* Recent Health Logs */}
      <Card className="p-6 glass border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Recent Health Logs
          </h2>

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
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {logsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 bg-slate-800" />
            <Skeleton className="h-12 bg-slate-800" />
            <Skeleton className="h-12 bg-slate-800" />
          </div>
        ) : healthLogs && healthLogs.length > 0 ? (
          <>
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
                          <Badge
                            variant="outline"
                            className="border-slate-700 text-slate-300"
                          >
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
                              ? "bg-emerald-500/10 text-emerald-500 border-0"
                              : "bg-red-500/10 text-red-500 border-0"
                          }
                        >
                          {log.success ? "Success" : "Failed"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400 max-w-xs truncate">
                        {log.errorMessage || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              offset={offset}
              limit={limit}
              totalDisplayed={healthLogs.length}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </>
        ) : (
          <p className="text-center text-slate-500 py-8">
            No health logs available
          </p>
        )}
      </Card>

      {/* Alerts for this endpoint */}
      {alerts && alerts.length > 0 && (
        <Card className="p-6 glass border-slate-800/50">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Alerts
          </h2>
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
                        alert.severity === "HIGH"
                          ? "bg-red-500/10 text-red-500 border-0"
                          : alert.severity === "MEDIUM"
                            ? "bg-orange-500/10 text-orange-500 border-0"
                            : "bg-amber-500/10 text-amber-500 border-0"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-slate-400"
                    >
                      {alert.alertType}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(alert.createdAt)}
                  </p>
                </div>
                {alert.isAcknowledged && (
                  <Badge
                    variant="outline"
                    className="border-emerald-700 text-emerald-500"
                  >
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
