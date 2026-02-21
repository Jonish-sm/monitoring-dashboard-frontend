"use client";

import { useState } from "react";
import { useHealthLogs } from "@/hooks/useHealthLogs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { formatDate, formatResponseTime } from "@/lib/utils/format";
import { Search } from "lucide-react";
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data: logs, isLoading } = useHealthLogs({ limit, offset });

  const currentPage = Math.floor(offset / limit) + 1;
  const hasNextPage: any = logs && logs.length === limit;
  const hasPrevPage = offset > 0;

  const handleNextPage = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  const filteredLogs = logs?.filter((log) => {
    if (!search.trim()) return true;
    const errorText = log.errorMessage?.toLowerCase() || "";
    const query = search.toLowerCase().trim();
    return errorText.includes(query);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <Skeleton className="h-96 bg-slate-800" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Health Logs</h1>
        <p className="text-slate-400">View all endpoint health check logs</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input
            placeholder="Search by error message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
          />
        </div>

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

      <Card className="p-6 glass border-slate-800/50">
        {filteredLogs && filteredLogs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      Endpoint ID
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
                      Error Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-slate-300">
                        {formatDate(log.checkedAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400 font-mono">
                        {log.endpointId.substring(0, 8)}...
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
                        {log.errorMessage || "No Error Message"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              offset={offset}
              limit={limit}
              totalDisplayed={filteredLogs.length}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </>
        ) : (
          <p className="text-center text-slate-500 py-12">No logs found</p>
        )}
      </Card>
    </motion.div>
  );
}