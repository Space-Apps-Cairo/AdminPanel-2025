"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteParticipationStatusMutation,
  useUpdateParticipationStatusMutation,
} from "@/service/Api/registration";
import {
  CreateParticipationStatusRequest,
  ParticipationStatus,
} from "@/types/registration";
import { participationStatusValidationSchema } from "@/validations/participationStatus";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getParticipationStatusFields = (
  participationStatusData?: ParticipationStatus
): Field[] => [
  {
    name: "label",
    type: "text",
    label: "Label",
    ...(participationStatusData?.name && {
      defaultValue: participationStatusData.name,
    }),
  },
  {
    name: "key",
    type: "text",
    label: "Key",
    ...(participationStatusData?.key && {
      defaultValue: participationStatusData.key,
    }),
  },
];

export const participationStatusColumns: ColumnDef<ParticipationStatus>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableHiding: false,
  },
  {
    header: "Key",
    accessorKey: "key",
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <ParticipationStatusRowActions rowData={row.original} />
    ),
    enableHiding: false,
    size: 100,
  },
];

function ParticipationStatusRowActions({
  rowData,
}: {
  rowData: ParticipationStatus;
}) {
  const [updateParticipationStatus] = useUpdateParticipationStatusMutation();
  const [deleteParticipationStatus] = useDeleteParticipationStatusMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      fields={getParticipationStatusFields(rowData)}
      validationSchema={participationStatusValidationSchema}
      updateMutation={(data: CreateParticipationStatusRequest) =>
        updateParticipationStatus({ id: rowData.id, data })
      }
      deleteMutation={() => deleteParticipationStatus(rowData.id)}
      onUpdateSuccess={(result) => {
        toast.success(
          result.message || "Participation status updated successfully!"
        );
      }}
      onUpdateError={(error: any) => {
        toast.error(
          error.data?.message || "Failed to update participation status."
        );
      }}
      onDeleteSuccess={(result) => {
        toast.success(
          result.message || "Participation status deleted successfully!"
        );
      }}
      onDeleteError={(error: any) => {
        toast.error(
          error.data?.message || "Failed to delete participation status."
        );
      }}
    />
  );
}
