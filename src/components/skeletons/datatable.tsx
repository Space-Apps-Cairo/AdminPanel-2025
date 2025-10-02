"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function DataTableSkeleton({
  rows = 5,
  columns = 5,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      {/* Table header */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="p-3 border-b bg-muted/50">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid border-b last:border-0"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="p-3">
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
