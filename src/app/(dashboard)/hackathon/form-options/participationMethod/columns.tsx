import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteParticipationMethodMutation,
  useUpdateParticipationMethodMutation,
} from "@/service/Api/hackthon/form-options/participationMethod";
import { ParticipationMethod } from "@/types/hackthon/form-options/participationMethod";
import { participationMethodValidationSchema } from "@/validations/hackthon/form-options/participationMethod";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { toast } from "sonner";

export const getParticipationMethodFields = (
  method?: ParticipationMethod
): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter participation method title",
    ...(method?.title && { defaultValue: method.title }),
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Field",
    placeholder: "Enter extra field (optional)",
    ...(method?.extra_field && { defaultValue: method.extra_field }),
  },
];


export const participationMethodColumns: ColumnDef<ParticipationMethod>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 60,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 150,
    enableHiding: false,
  },
  {
    header: "Extra Field",
    accessorKey: "extra_field",
    size: 200,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <ParticipationMethodRowActions rowData={row.original} />,
    size: 150,
   
  },
];

function ParticipationMethodRowActions({ rowData }: { rowData: ParticipationMethod }) {
  const [updateMethod] = useUpdateParticipationMethodMutation();
  const [deleteMethod] = useDeleteParticipationMethodMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getParticipationMethodFields(rowData)}
      validationSchema={participationMethodValidationSchema}
      updateMutation={(data: Partial<ParticipationMethod>) =>
        updateMethod({ id: rowData.id, data })
      }
      deleteMutation={deleteMethod}
      onUpdateSuccess={() => toast.success("Participation method updated successfully")}
      onUpdateError={() => toast.error("Failed to update participation method")}
      onDeleteSuccess={() => toast.success("Participation method deleted successfully")}
      onDeleteError={() => toast.error("Failed to delete participation method")}
    />
  );
}
