"use client";

import { attendedMembersColumns } from "./columns";
import { Member } from "@/types/hackthon/member";
import DataTable from "@/components/table/data-table";
import { useGetMembersQuery } from "@/service/Api/hackathon/attending";
import Loading from "@/components/loading/loading";
import Error from "@/components/Error/page";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";

export default function AttendedMembersPage() {
  const router = useRouter();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query string for backend pagination and search
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage]);

  // Fetch members with query string
  const { data, isLoading, isError } = useGetMembersQuery(buildQueryString());

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Search by name or email",
    searchKeys: ["name", "email", "national"],
  };

  const statusConfig: StatusConfig = { enabled: false };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false,
    showDelete: false,
    showExport: true,
  };

  // Backend pagination config for DataTable
  const backendPagination = {
    enabled: true,
    currentPage: data?.current_page || 1,
    totalPages: data?.total_pages || 1,
    pageSize: pageSize,
    totalCount: data?.count || 0,
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when page size changes
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
    },
    loading: isLoading,
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div className=" mx-auto py-7 px-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Attended Members</h1>

      <DataTable<Member>
        data={data?.data ?? []}
        columns={attendedMembersColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
        backendPagination={backendPagination}
      />
    </div>
  );
}
