"use client";

// import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useGetAllTeamsQuery, useDeleteTeamMutation } from '@/service/Api/teams';
import { Team } from '@/types/teams';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useState, useCallback } from 'react';
import { teamColumns } from './_components/columns';

export default function TeamsPage() {
    // State for pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Build query string
    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams();
        
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        params.append('limit', pageSize.toString());
        params.append('page', currentPage.toString());

        return params.toString() ? `?${params.toString()}` : '';
    }, [searchTerm, pageSize, currentPage]);

    const {
        data: teamsData,
        isLoading: isLoadingTeams,
        error: teamsError,
    } = useGetAllTeamsQuery(buildQueryString());

    // Delete mutation for bulk operations
    const [deleteTeam] = useDeleteTeamMutation();

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by team name, team leader name, uuid",
        searchKeys: ["team_name", "team_leader.name", "uuid"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: false, // Since teams are created by participants, not admins
        showDelete: true,
        addButtonText: "Add Team",
    };

    // Backend pagination configuration
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
        loading: isLoadingTeams,
    };

    console.log(teamsData?.data);

  // ====== status ====== //

    // if (isLoadingTeams) return <Loading />;

  if (teamsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading teams</div>
      </div>
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
                backendPagination={backendPagination}
            />
        </div>
    </React.Fragment>
  );
}
