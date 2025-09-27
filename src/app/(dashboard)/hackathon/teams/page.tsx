"use client";

// import Loading from '@/components/loading/loading';
import DataTable from "@/components/table/data-table";
import {
  useGetAllTeamsQuery,
  useDeleteTeamMutation,
} from "@/service/Api/teams";
import { Team } from "@/types/teams";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useState, useCallback } from "react";
import { teamColumns } from "./_components/columns";
import Error from "@/components/Error/page";

export default function TeamsPage() {
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  // NEW: Add state for filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );

  // Build query string - updated to include filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    // Add filter parameters
    Object.entries(activeFilters).forEach(([key, values]) => {
      console.log("key", key);
      console.log("values", values);
      if (values.length > 0) {
        // If multiple values, add each one separately
        values.forEach((value) => {
          params.append(key, value);
        });
      }
    });

    params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage, activeFilters]); // Add activeFilters to dependencies

  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useGetAllTeamsQuery(buildQueryString());

  // Delete mutation for bulk operations
  const [deleteTeam] = useDeleteTeamMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by team name, uuid",
    // searchKeys: ["team_name", "uuid"],
  };

  const statusConfig: StatusConfig = {
    enabled: true,
    filterOptions: [
      {
        // columnKey: "participation_method.title",
        queryKey: "participation_method_id", //any thing
        title: "Participation Method",
        options: [
          { id: 1, label: "onsite" },
          { id: 2, label: "virtual" },
        ],
      },
    ],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false, // Since teams are created by participants, not admins
    showDelete: true,
    showExport:true,
    addButtonText: "Add Team",
  };

  // Backend pagination configuration - updated to include onFilterChange
  const backendPagination = {
    enabled: true,
    currentPage: teamsData?.current_page || 1,
    totalPages: teamsData?.total_pages || 1,
    pageSize: Number(teamsData?.per_page) || 10,
    totalCount: teamsData?.count || 0,
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
    // NEW: Add filter change handler
    onFilterChange: (filters: Record<string, unknown>) => {
      setActiveFilters(filters as Record<string, string[]>);
      setCurrentPage(1); // Reset to first page when filtering
    },
    loading: isLoadingTeams,
  }; // Debug log

  // ====== status ====== //

  // if (isLoadingTeams) return <Loading />;

  if (teamsError) {
    return (
      <Error />
    );
  }

  return (
    <React.Fragment>
      <div className="mx-auto py-6 px-7">
        <h1 className="text-2xl font-bold mb-6">Hackathon Teams</h1>

        <DataTable<Team>
          data={teamsData?.data || []}
          columns={teamColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteTeam}
          enableBulkEmail={true}
          backendPagination={backendPagination}
        />
      </div>
    </React.Fragment>
  );
}
