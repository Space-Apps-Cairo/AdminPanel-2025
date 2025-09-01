"use client"
import { ColumnDef } from "@tanstack/react-table";
import { BootcampType } from "@/types/bootcamp";
import RowsActions from "@/components/table/rows-actions";
import { Field } from "@/app/interface";
import { BootcampSchema } from "@/validations/bootcamp";
import {
  useDeleteBootcampMutation,
  useUpdateBootcampMutation,
} from "@/service/Api/bootcamp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { any } from "zod";
export const getBootcampFields = (bootcampData?: BootcampType): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter bootcamp name",
    ...(bootcampData?.name && { defaultValue: bootcampData.name }),
    // step: 1,
  },
  {
    name: "date",
    type: "date",
    label: "Date",
    placeholder: "Pick up a date",
    ...(bootcampData?.date && { defaultValue: bootcampData.date }),
    // step: 1,
  },
  
];

export const EmailColumns: ColumnDef<BootcampType>[] = [
    { header: "ID", accessorKey: "id", size: 80, enableHiding: false },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    header: "Template",
    accessorKey: "template",
    cell: ({ row }) => <div>{row.getValue("template")}</div>,
  },
 
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <EmailRowActions rowData={row.original} />,
  },
];

function EmailRowActions({ rowData }: { rowData: BootcampType }) {
    const router=useRouter();
  
  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getBootcampFields(rowData)}
      validationSchema={any}
      isPreview={false}
      customEditHandler={(row) => router.push(`/bootcamp/email-templates/${row.id}`)}
      onUpdateSuccess={(result) =>
        toast.success("email updated successfully")
      }
      onUpdateError={(error) =>
        toast.error("Falid to update email:", error?.data?.message)
      }
      onDeleteSuccess={(result) =>
        toast.success("email deleted successfully")
      }
      onDeleteError={(error) =>
        toast.error("Falid to delete email:", error?.data?.message)
      }
    />
  );
}
