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
        values.forEach((value) => {
          params.append(key, value);
        });
      }
    });

    // Handle "all" case - use -1 to represent "all"
    if (pageSize === -1) {
      params.append("limit", "all");
    } else {
      params.append("limit", pageSize.toString());
    }
    
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage, activeFilters]);

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
          { id: 1, label: "Onsite" },
          { id: 2, label: "Virtual" },
        ],
      },
      {
        // columnKey: "participation_method.title",
        queryKey: "status", //any thing
        title: "Status",
        options: [
          { id: 'accepted', label: "Accepted" },
          { id: 'rejected', label: "Rejected" },
          // { id: 3, label: "pending" },
        ],
      },
    ],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false, // Since teams are created by participants, not admins
    showDelete: true,
    showExport: true,
    addButtonText: "Add Team",
  };

  // Backend pagination configuration - updated to handle "all" case
  const backendPagination = {
    enabled: true,
    currentPage: teamsData?.current_page || 1,
    totalPages: teamsData?.total_pages || 1,
    pageSize: pageSize, // ← تأكد أن ده بيشير لـ state الـ pageSize
    totalCount: teamsData?.count || 0,
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      if (size === -1) {
        setPageSize(-1); // ← هنا بيتغير الـ state
      } else {
        setPageSize(size); // ← وهنا كمان
      }
      setCurrentPage(1);
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
  };

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