"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteTShirtMutation,
  useUpdateTShirtSizeMutation,
} from "@/service/Api/hackthon/form-options/tshirt";
import { TShirtSize } from "@/types/hackthon/form-options/tshritSize";
import { tshirtValidationSchema } from "@/validations/hackthon/form-options/tshirtSize";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { toast } from "sonner";


export const getTShirtFields = (tshirt?: TShirtSize): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter T-shirt size title",
    ...(tshirt?.title && { defaultValue: tshirt.title }),
    step: 1,
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Field",
    placeholder: "Enter extra field (e.g., Size 4XL)",
    ...(tshirt?.extra_field && { defaultValue: tshirt.extra_field }),
    step: 1,
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    placeholder: "Enter description",
    ...(tshirt?.description && { defaultValue: tshirt.description }),
    
  },
];

export const tshirtColumns: ColumnDef<TShirtSize>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 60,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 100,
    enableHiding: false,
  },
  {
    header: "Extra Field",
    accessorKey: "extra_field",
    size: 150,
    enableHiding: false,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 500,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <TShirtRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function TShirtRowActions({ rowData }: { rowData: TShirtSize }) {
  const [updateTShirt] = useUpdateTShirtSizeMutation();
  const [deleteTShirt] = useDeleteTShirtMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getTShirtFields(rowData)}
      validationSchema={tshirtValidationSchema}
      updateMutation={(data: Partial<TShirtSize>) =>
        updateTShirt({ id: rowData.id, data })
      }
      deleteMutation={deleteTShirt}
      onUpdateSuccess={() => toast.success("T-Shirt updated successfully")}
      onUpdateError={() => toast.error("Failed to update T-Shirt")}
      onDeleteSuccess={() => toast.success("T-Shirt deleted successfully")}
      onDeleteError={() => toast.error("Failed to delete T-Shirt")}
    />
  );
}