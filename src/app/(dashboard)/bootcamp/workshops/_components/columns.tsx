"use client";

import { Field } from "@/app/interface";
import RowsActions from "../../../../../components/table/rows-actions";
import { Button } from "../../../../../components/ui/button";
import {
  useDeleteWorkshopMutation,
  useUpdateWorkshopMutation,
} from "@/service/Api/workshops";
import { Workshop } from "@/types/workshop";
import { workshopValidationSchema } from "@/validations/workshop";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const getWorkshopsFields = (workshop?: Workshop): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    ...(workshop?.title && { defaultValue: workshop.title }),
    step: 1,
    placeholder: "Enter workshop name",
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    ...(workshop?.description && { defaultValue: workshop.description }),
    step: 1,
    placeholder: "Enter workshop description",
  },
  {
    name: "workshop_details",
    type: "textArea",
    label: "Workshop Instructions",
    ...(workshop?.workshop_details && {
      defaultValue: workshop.workshop_details,
    }),
    step: 1,
    placeholder: "Enter Workshop Instructions",
  },

  {
    name: "start_date",
    type: "date",
    label: "Start Date",
    placeholder: "Workshop start date",
    ...(workshop?.start_date && { defaultValue: workshop.start_date }),
    step: 1,
  },
  {
    name: "end_date",
    type: "date",
    label: "End Date",
    placeholder: "Workshop end date",
    ...(workshop?.end_date && { defaultValue: workshop.end_date }),
    step: 1,
  },
];

export const workshopColumns: ColumnDef<Workshop>[] = [
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
    size: 180,
    enableHiding: false,
  },
  // {
  //   header: "Description",
  //   accessorKey: "description",
  //   size: 220,
  // },
  {
    header: "Instructions",
    accessorKey: "workshop_details",
    size: 220,
  },

  {
    header: "Start Date",
    accessorKey: "start_date",
    size: 180,
  },
  {
    header: "End Date",
    accessorKey: "end_date",
    size: 180,
  },
  {
    header: "Schedules",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        <Link href={`workshops/${row.original.id}#schedules`}>Schedules</Link>
        <ChevronRight />
      </Button>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <WorkshopRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function WorkshopRowActions({ rowData }: { rowData: Workshop }) {
  const [updateWorkshop] = useUpdateWorkshopMutation();
  const [deleteWorkshop] = useDeleteWorkshopMutation();
  const customPreviewHandler = () => {
    if (typeof window !== "undefined") {
      window.location.href = `/bootcamp/workshops/${rowData.id}`;
    }
  };
  // helper to format ISO string -> YYYY-MM-DD
  const formatDate = (isoDate: string) => {
    if (!isoDate) return isoDate;
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getWorkshopsFields(rowData)}
      validationSchema={workshopValidationSchema}
      updateMutation={(data) =>
        updateWorkshop({
          id: rowData.id.toString(),
          data: {
            ...data,
            start_date: formatDate(data.start_date),
            end_date: formatDate(data.end_date),
          },
        })
      }
      deleteMutation={deleteWorkshop}
      customPreviewHandler={customPreviewHandler}
      onUpdateSuccess={() => {
        toast.success("Workshop updated successfully:");
      }}
      onUpdateError={(error) => {
        toast.error("Error updating workshop:", error?.data?.message);
      }}
      onDeleteSuccess={() => {
        toast.success("Workshop deleted successfully:");
      }}
      onDeleteError={(error) => {
        toast.error("Error deleting workshop:", error?.data?.message);
      }}
    />
  );
}
