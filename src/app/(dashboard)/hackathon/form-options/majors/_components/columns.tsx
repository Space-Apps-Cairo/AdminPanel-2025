"use client";
import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMajorMutation,
  useUpdateMajorMutation,
} from "@/service/Api/hackathon/form-options/majors";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Major, MajorRequest } from "@/types/hackthon/form-options/majors";
import { majorSchema } from "@/validations/hackthon/form-options/majors";

export const getMajorFields = (majorData?: Major): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Major Title",
    placeholder: "Enter major title",
    ...(majorData?.title && {
      defaultValue: majorData.title,
    }),
    step: 1,
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Field (optional)",
    placeholder: "Enter extra field",

    ...(majorData?.extra_field && {
      defaultValue: majorData.extra_field,
    }),
    step: 1,
  },
  {
    name: "description",
    type: "textArea",
    label: "Description",
    placeholder: "Enter major description",
    ...(majorData?.description && {
      defaultValue: majorData.description,
    }),
    step: 1,
  },
];

export const majorColumns: ColumnDef<Major>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 50,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 220,
    enableHiding: false,
  },
  {
    header: "Extra Field",
    accessorKey: "extra_field",
    size: 220,
    enableHiding: false,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 220,
    enableHiding: false,
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
    cell: ({ row }) => <MajorRowActions rowData={row.original} />,
  },
];

function MajorRowActions({ rowData }: { rowData: Major }) {
  const [updateMajor] = useUpdateMajorMutation();
  const [deleteMajor] = useDeleteMajorMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getMajorFields(rowData)}
      validationSchema={majorSchema}
      updateMutation={(data: MajorRequest) =>
        updateMajor({
          id: rowData.id,
          data,
        })
      }
      deleteMutation={deleteMajor}
      onUpdateSuccess={(result) => {
        console.log("Major updated successfully:", result);
        toast.success(result.message || "Major updated successfully!");
      }}
      onUpdateError={(error) => {
        console.error("Error updating major:", error);
        toast.error(
          error.data?.message || "Failed to update major. Please try again."
        );
      }}
      onDeleteSuccess={(result) => {
        console.log("Major deleted successfully:", result);
        toast.success(result.message || "Major deleted successfully!");
      }}
      onDeleteError={(error) => {
        console.error("Error deleting major:", error);
        toast.error(
          error.data?.message || "Failed to delete major. Please try again."
        );
      }}
    />
  );
}
