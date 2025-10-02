"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import Loading from "@/components/loading/loading";
import Error from "@/components/Error/page";
import DataTable from "@/components/table/data-table";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { DataTableSkeleton } from "@/components/skeletons/datatable";

interface AttendeeTablePageProps<T> {
  title: string;
  columns: any;
  useQuery: (
    query: string,
    options?: { skip?: boolean }
  ) => {
    data?: any;
    isLoading: boolean;
    isError: boolean;
  };
  searchPlaceholder?: string;
  activeTab: string;
  value: string;
}

export default function AttendeeTablePage<T>({
  title,
  columns,
  useQuery,
  searchPlaceholder = "Search for attendee",
  activeTab,
  value,
}: AttendeeTablePageProps<T>) {
  const router = useRouter();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());
    return `?${params.toString()}`;
  }, [searchTerm, pageSize, currentPage]);

  // Fetch data via passed hook
  const { data, isLoading, isError } = useQuery(buildQueryString(), {
    skip: activeTab !== value, // only fetch when this tab is active
  });

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: searchPlaceholder,
    searchKeys: ["name", "email", "national"],
  };

  const statusConfig: StatusConfig = { enabled: false };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false,
    showDelete: false,
    showExport: true,
  };

  const backendPagination = {
    enabled: true,
    currentPage: data?.current_page || 1,
    totalPages: data?.total_pages || 1,
    pageSize,
    totalCount: data?.count || 0,
    onPageChange: (page: number) => setCurrentPage(page),
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1);
    },
    loading: isLoading,
  };

  // if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div className="mx-auto py-7">
      {/* <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button> */}
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {isLoading ? (
        <DataTableSkeleton rows={10} columns={5} />
      ) : (
        <DataTable<T>
          data={data?.data ?? []}
          columns={columns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          backendPagination={backendPagination}
        />
      )}
    </div>
  );
}
