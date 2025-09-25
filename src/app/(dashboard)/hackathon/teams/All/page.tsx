"use client"

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useGetAllTeamsQuery, useDeleteTeamMutation } from '@/service/Api/teams';
import { Team } from '@/types/teams';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useEffect, useState } from 'react';
import { teamColumns } from './_components/columns';

export default function TeamsPage() {
    const {
        data: teamsData,
        isLoading: isLoadingTeams,
        error: teamsError,
    } = useGetAllTeamsQuery();


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
        showAdd:false, // Since teams are created by participants, not admins
        showDelete: true,
        // addButtonText: "Add Team",
        showExport: true
    };

    // ====== status ====== //

    if (isLoadingTeams) return <Loading />;

    if (teamsError) {
        return (
            <div className="mx-auto py-6">
                <div className="text-red-500">
                    Error loading teams
                </div>
            </div>
        );
    }

    return <React.Fragment>
        <div className="mx-auto py-6 px-7">
            <h1 className="text-2xl font-bold mb-6">Hackathon Teams</h1>

            <DataTable<Team>
                data={teamsData?.data || []}
                columns={teamColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                bulkDeleteMutation={deleteTeam}
            />
        </div>
    </React.Fragment>
}
