"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteTeamStatusMutation,
  useUpdateTeamStatusMutation,
} from "@/service/Api/registration";
import { CreateTeamStatusRequest, TeamStatus } from "@/types/registration";
import { teamStatusValidationSchema } from "@/validations/teamStatus";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getTeamStatusFields = (teamStatusData?: TeamStatus): Field[] => [
  {
    name: "label",
    type: "text",
    label: "Label",
    ...(teamStatusData?.name && { defaultValue: teamStatusData.name }),
  },
  {
    name: "key",
    type: "text",
    label: "Key",
    ...(teamStatusData?.key && { defaultValue: teamStatusData.key }),
  },
];

export const teamStatusColumns: ColumnDef<TeamStatus>[] = [
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
    cell: ({ row }) => <TeamStatusRowActions rowData={row.original} />,
    enableHiding: false,
    size: 100,
  },
];

function TeamStatusRowActions({ rowData }: { rowData: TeamStatus }) {
  const [updateTeamStatus] = useUpdateTeamStatusMutation();
  const [deleteTeamStatus] = useDeleteTeamStatusMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      fields={getTeamStatusFields(rowData)}
      validationSchema={teamStatusValidationSchema}
      updateMutation={(data: CreateTeamStatusRequest) =>
        updateTeamStatus({ id: rowData.id, data })
      }
      deleteMutation={() => deleteTeamStatus(rowData.id)}
      onUpdateSuccess={(result) => {
        toast.success(result.message || "Team status updated successfully!");
      }}
      onUpdateError={(error: any) => {
        toast.error(error.data?.message || "Failed to update team status.");
      }}
      onDeleteSuccess={(result) => {
        toast.success(result.message || "Team status deleted successfully!");
      }}
      onDeleteError={(error: any) => {
        toast.error(error.data?.message || "Failed to delete team status.");
      }}
    />
  );
}