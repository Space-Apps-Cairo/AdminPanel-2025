"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import {
  useGetMembersQuery,
  useDeleteMemberMutation,
} from "@/service/Api/hackathon/member";
import { Member } from "@/types/hackthon/member";
import {
  ActionConfig,
  ColumnVisibilityConfig,
  SearchConfig,
  StatusConfig,
} from "@/types/table";
import React, { useCallback, useState } from "react";
import { memberColumns } from "./_components/columns";
import { toast } from "sonner";
import Error from "@/components/Error/page";

export default function MembersPage() {
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage]);

  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useGetMembersQuery(buildQueryString());

  // Delete mutation for bulk operations
  const [deleteMember] = useDeleteMemberMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name, email, phone",
    searchKeys: ["uuid", "email", "national"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false, // allow admin to add members
    showDelete: true,
    showExport: true,
  };

  const columnVisibilityConfig: ColumnVisibilityConfig = {
    enableColumnVisibility: true,
    // invisibleColumns:["age","is_new","participation_type",""]
  };

  const backendPagination = {
    enabled: true,
    currentPage: membersData?.current_page || 1,
    totalPages: membersData?.total_pages || 1,
    pageSize: Number(membersData?.per_page) || 10,
    totalCount: membersData?.count || 0,
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
    },
    loading: isLoadingMembers,
  };
  if (isLoadingMembers) return <Loading />;

  if (membersError) {
    return (
      <Error />
    );
  }

  return (
    <div className=" py-6 px-7">
      <h1 className="text-2xl font-bold mb-6">Hackathon Members</h1>

      <DataTable<Member>
        data={membersData?.data ?? []}
        columns={memberColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
        columnVisibilityConfig={columnVisibilityConfig}
        backendPagination={backendPagination}
        // bulkDeleteMutation={(ids: number[]) =>
        //   Promise.all(ids.map((id) => deleteMember(id).unwrap()))
        //     .then(() => toast.success("Members deleted successfully!"))
        //     .catch(() => toast.error("Failed to delete selected members."))
        // }
      />
    </div>
  );
}
