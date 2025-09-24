"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import {
  useGetAllTeamsQuery,
  useDeleteTeamMutation,
} from "@/service/Api/teams";
import { Team } from "@/types/teams";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React from "react";
import { teamColumns } from "./_components/columns";

export default function TeamsPage() {
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useGetAllTeamsQuery();

<<<<<<< HEAD
  // Delete mutation for bulk operations
  const [deleteTeam] = useDeleteTeamMutation();
=======
>>>>>>> 492fee678e45aa3e012c42d39c6d053b361af28f

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by team name, team leader name, uuid",
    searchKeys: ["team_name", "team_leader.name", "uuid"],
  };

<<<<<<< HEAD
  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false, // Since teams are created by participants, not admins
    showDelete: true,
    addButtonText: "Add Team",
  };
=======
    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by team name, team leader name, uuid",
        searchKeys: ["team_name", "team_leader.name", "uuid"],
    };
>>>>>>> 492fee678e45aa3e012c42d39c6d053b361af28f

  // ====== status ====== //

  if (isLoadingTeams) return <Loading />;

  if (teamsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading teams</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container mx-auto py-6 px-7">
        <h1 className="text-2xl font-bold mb-6">Hackathon Teams</h1>

<<<<<<< HEAD
        <DataTable<Team>
          data={teamsData?.data}
          columns={teamColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteTeam}
        />
      </div>
=======
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
>>>>>>> 492fee678e45aa3e012c42d39c6d053b361af28f
    </React.Fragment>
  );
}
