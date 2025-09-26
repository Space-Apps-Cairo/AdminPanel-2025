"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteActualSolutionMutation,
  useUpdateActualSolutionMutation,
} from "@/service/Api/hackathon/form-options/actualSolutions";
import { ActualSolution } from "@/types/hackthon/form-options/actualSolution";
import { actualSolutionValidationSchema } from "@/validations/hackthon/form-options/actualSolution";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getActualSolutionFields = (solution?: ActualSolution): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter solution title",
    ...(solution?.title && { defaultValue: solution.title }),
    step: 1,
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    placeholder: "Enter solution description",
    ...(solution?.description && { defaultValue: solution.description }),
  },
  {
    name: "teamId",
    type: "number",
    label: "Team ID",
    placeholder: "Enter team ID",
    ...(solution?.teamId && { defaultValue: solution.teamId }),
    step: 1,
  },
];

export const actualSolutionColumns: ColumnDef<ActualSolution>[] = [
  { header: "ID", accessorKey: "id", size: 60, enableHiding: false },
  { header: "Title", accessorKey: "title", size: 200 },
  { header: "Description", accessorKey: "description", size: 300 },
  { header: "Team ID", accessorKey: "teamId", size: 100 },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <ActualSolutionRowActions rowData={row.original} />,
  },
];

function ActualSolutionRowActions({ rowData }: { rowData: ActualSolution }) {
  const [updateSolution] = useUpdateActualSolutionMutation();
  const [deleteSolution] = useDeleteActualSolutionMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete
      isUpdate
      fields={getActualSolutionFields(rowData)}
      validationSchema={actualSolutionValidationSchema}
      updateMutation={(data: Partial<ActualSolution>) =>
        updateSolution({ id: rowData.id, data })
      }
      deleteMutation={deleteSolution}
      onUpdateSuccess={() => toast.success("Solution updated successfully")}
      onUpdateError={() => toast.error("Failed to update solution")}
      onDeleteSuccess={() => toast.success("Solution deleted successfully")}
      onDeleteError={() => toast.error("Failed to delete solution")}
    />
  );
}
