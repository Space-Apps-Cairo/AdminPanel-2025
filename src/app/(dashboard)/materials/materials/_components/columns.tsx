"use client";
import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMaterialMutation,
  useUpdateMaterialMutation,
} from "@/service/Api/materials";
import { Material } from "@/types/materials";
import { materialValidationSchema } from "@/validations/material";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getMaterialFields = (
  materialData?: Material,
): Field[] => [
  {
    name: "material_name",
    type: "text",
    label: "Material Name",
    ...(materialData?.material_name && {
      defaultValue: materialData.material_name,
    }),
    step: 1,
  },

  {
    name: "total_quantity",
    type: "number",
    label: "Total Quantity",
    ...(materialData?.total_quantity && {
      defaultValue: materialData.total_quantity,
    }),
    step: 1,
  },
];

export const materialColumns: ColumnDef<Material>[] = [
  {
    header: "Name",
    accessorKey: "material_name",
    size: 220,
    enableHiding: false,
  },

  {
    header: "Total Quantity",
    accessorKey: "total_quantity",
    size: 180,
    enableHiding: false,
  },

  {
    header: "Used Quantity",
    accessorKey: "used_quantity",
    size: 180,
    enableHiding: false,
  },

  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <MaterialRowActions rowData={row.original} />,
    size: 100,
    enableHiding: false,
  },
];

function MaterialRowActions({ rowData }: { rowData: Material }) {
  const [updateMaterial] = useUpdateMaterialMutation();
  const [deleteMaterial] = useDeleteMaterialMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getMaterialFields(rowData)}
      validationSchema={materialValidationSchema}
      updateMutation={(data: Material) =>
        updateMaterial({ id: rowData.id, data })
      }
      deleteMutation={deleteMaterial}
      onUpdateSuccess={(result) => {
        console.log("Material updated successfully:", result);
        toast.success(result.msg || "Material updated successfully!");
      }}
      onUpdateError={(error) => {
        console.error("Error updating material:", error);
        toast.error(
          error.data?.msg || "Failed to update material. Please try again."
        );
      }}
      onDeleteSuccess={(result) => {
        console.log("Material deleted successfully:", result);
        toast.success(result.msg || "Material deleted successfully!");
      }}
      onDeleteError={(error) => {
        console.error("Error deleting material:", error);
        toast.error(
          error.data?.msg || "Failed to delete material. Please try again."
        );
      }}
    />
  );
}
