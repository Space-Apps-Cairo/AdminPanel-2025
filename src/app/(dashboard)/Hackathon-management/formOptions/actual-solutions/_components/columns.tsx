
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActualSolution } from "@/types/hackathon/actualSolutions";
import RowsActions from "@/components/table/rows-actions";

export const actualSolutionsColumns: ColumnDef<ActualSolution>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "created_at", header: "Created At" },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowsActions
        rowData={row.original}
        steps={[1]}
        fields={[]} // هيجى من fields.ts
        validationSchema={undefined as any}
        updateMutation={() => {}}
        deleteMutation={() => {}}
      />
    ),
  },
];
