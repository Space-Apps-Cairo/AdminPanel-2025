"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteNationalityMutation,
  useUpdateNationalityMutation,
} from "@/service/Api/registration";
import { CreateNationalityRequest, Nationality } from "@/types/registration";
import { nationalityValidationSchema } from "@/validations/nationality";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getNationalityFields = (nationalityData?: Nationality): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Nationality Name",
    ...(nationalityData?.name && { defaultValue: nationalityData.name }),
    step: 1,
  },
];

export const nationalityColumns: ColumnDef<Nationality>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableHiding: false,
    size: 100,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <NationalityRowActions rowData={row.original} />,
    enableHiding: false,
    size: 100,
  },
];

function NationalityRowActions({ rowData }: { rowData: Nationality }) {
  const [updateNationality] = useUpdateNationalityMutation();
  const [deleteNationality] = useDeleteNationalityMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      fields={getNationalityFields(rowData)}
      validationSchema={nationalityValidationSchema}
      updateMutation={(data: CreateNationalityRequest) =>
        updateNationality({ id: rowData.id, data })
      }
      deleteMutation={deleteNationality}
      onUpdateSuccess={(result) => {
        toast.success(result.message || "Nationality updated successfully!");
      }}
      onUpdateError={(error: any) => {
        toast.error(
          error.data?.message || "Failed to update nationality."
        );
      }}
      onDeleteSuccess={(result) => {
        toast.success(result.message || "Nationality deleted successfully!");
      }}
      onDeleteError={(error: any) => {
        toast.error(
          error.data?.message || "Failed to delete nationality."
        );
      }}
    />
  );
}
