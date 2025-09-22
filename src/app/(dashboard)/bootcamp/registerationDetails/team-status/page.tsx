"use client";

import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import {
  useAddTeamStatusMutation,
  useGetAllTeamStatusesQuery,
  useDeleteTeamStatusMutation,
} from "@/service/Api/registration";
import { TeamStatus, CreateTeamStatusRequest } from "@/types/registration";
import { ActionConfig, StatusConfig, SearchConfig } from "@/types/table";
import { teamStatusValidationSchema } from "@/validations/teamStatus";
import { getTeamStatusFields, teamStatusColumns } from "./_components/columns";

export default function TeamStatusPage() {
  const {
    data: teamStatusesData,
    isLoading: isLoadingTeamStatuses,
    error: teamStatusesError,
  } = useGetAllTeamStatusesQuery();

  const [teamStatuses, setTeamStatuses] = useState<TeamStatus[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteTeamStatus] = useDeleteTeamStatusMutation();

  useEffect(() => {
    if (teamStatusesData && !isLoadingTeamStatuses && !teamStatusesError) {
      setTeamStatuses(teamStatusesData.data);
    }
  }, [teamStatusesData, isLoadingTeamStatuses, teamStatusesError]);

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name or key",
    searchKeys: ["name", "key"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Team Status",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const [addTeamStatus] = useAddTeamStatusMutation();

  const handleAddTeamStatusSubmit = async (data: FieldValues) => {
    try {
      const result = await addTeamStatus(
        data as CreateTeamStatusRequest
      ).unwrap();
      toast.success(result.message || "Team status added successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add team status.");
      throw error;
    }
  };

  if (isLoadingTeamStatuses) return <Loading />;

  if (teamStatusesError) {
    return (
      <div className="mx-auto py-6">
        <div className="text-red-500">Error loading team statuses</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
        //   title="Add Team Status"
          fields={getTeamStatusFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={teamStatusValidationSchema}
          onSubmit={handleAddTeamStatusSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Team Statuses</h1>

        <DataTable<TeamStatus>
          data={teamStatuses}
          columns={teamStatusColumns}
          actionConfig={actionConfig}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          bulkDeleteMutation={deleteTeamStatus as any}
        />
      </div>
    </React.Fragment>
  );
}