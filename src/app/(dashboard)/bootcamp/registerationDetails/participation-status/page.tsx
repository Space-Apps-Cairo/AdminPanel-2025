"use client";

import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import {
  useAddParticipationStatusMutation,
  useGetAllParticipationStatusesQuery,
  useDeleteParticipationStatusMutation,
} from "@/service/Api/registration";
import {
  ParticipationStatus,
  CreateParticipationStatusRequest,
} from "@/types/registration";
import { ActionConfig, StatusConfig, SearchConfig } from "@/types/table";
import { participationStatusValidationSchema } from "@/validations/participationStatus";
import {
  getParticipationStatusFields,
  participationStatusColumns,
} from "./_components/columns";

export default function ParticipationStatusPage() {
  const {
    data: participationStatusesData,
    isLoading: isLoadingParticipationStatuses,
    error: participationStatusesError,
  } = useGetAllParticipationStatusesQuery();

  const [participationStatuses, setParticipationStatuses] = useState<
    ParticipationStatus[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteParticipationStatus] = useDeleteParticipationStatusMutation();

  useEffect(() => {
    if (
      participationStatusesData &&
      !isLoadingParticipationStatuses &&
      !participationStatusesError
    ) {
      setParticipationStatuses(participationStatusesData.data);
    }
  }, [
    participationStatusesData,
    isLoadingParticipationStatuses,
    participationStatusesError,
  ]);

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
    addButtonText: "Add Participation Status",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const [addParticipationStatus] = useAddParticipationStatusMutation();

  const handleAddParticipationStatusSubmit = async (data: FieldValues) => {
    try {
      const result = await addParticipationStatus(
        data as CreateParticipationStatusRequest
      ).unwrap();
      toast.success(
        result.message || "Participation status added successfully!"
      );
    } catch (error: any) {
      toast.error(
        error.data?.message || "Failed to add participation status."
      );
      throw error;
    }
  };

  if (isLoadingParticipationStatuses) return <Loading />;

  if (participationStatusesError) {
    return (
      <div className="mx-auto py-6">
        <div className="text-red-500">Error loading participation statuses</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getParticipationStatusFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={participationStatusValidationSchema}
          onSubmit={handleAddParticipationStatusSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Participation Statuses</h1>

        <DataTable<ParticipationStatus>
          data={participationStatuses}
          columns={participationStatusColumns}
          actionConfig={actionConfig}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          bulkDeleteMutation={deleteParticipationStatus as any}
        />
      </div>
    </React.Fragment>
  );
}
