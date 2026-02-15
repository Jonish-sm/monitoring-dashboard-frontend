// components/ui/pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  offset: number;
  limit: number;
  totalDisplayed: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function Pagination({
  currentPage,
  offset,
  limit,
  totalDisplayed,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
      <p className="text-sm text-slate-400">
        Page {currentPage} • Showing {offset + 1}-{offset + totalDisplayed}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className="border-slate-700 text-white disabled:opacity-50 hover:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="border-slate-700 text-white disabled:opacity-50 hover:text-slate-300"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}