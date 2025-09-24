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

// Helper function to convert HTML to array of strings
const htmlToDescriptionArray = (htmlString: string): string[] => {
  if (!htmlString || typeof htmlString !== 'string') return [];
  
  // Extract text content from <li> tags
  const liRegex = /<li[^>]*>(.*?)<\/li>/g;
  const matches = [];
  let match;
  
  while ((match = liRegex.exec(htmlString)) !== null) {
    // Remove HTML entities and decode them
    const text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    matches.push(text);
  }
  
  return matches;
};

// Helper function to convert array of strings to HTML
const descriptionArrayToHtml = (descriptionArray: string[]): string => {
  if (!Array.isArray(descriptionArray) || descriptionArray.length === 0) {
    return '';
  }
  
  const listItems = descriptionArray
    .filter(item => item && item.trim())
    .map(item => {
      // Escape HTML entities
      const escapedItem = item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return `<li style="margin-bottom:8px;">${escapedItem}</li>`;
    })
    .join('');
  
  return `<ul style="margin:10px 0 10px 20px;padding:0;font-size:15px;color:#333;line-height:1.6;">${listItems}</ul>`;
};

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
    type: "dynamicArrayField",
    label: "Description Points",
    ...(workshop?.description && { 
      defaultValue: htmlToDescriptionArray(workshop.description) 
    }),
    step: 2,
    dynamicArrayFieldsConfig: {
      isSimpleArray: true,
      addButtonLabel: "Add Description Point",
      itemName: "Description Point",
      minItem: 1,
    },
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
      steps={[1, 2]}
      fields={getWorkshopsFields(rowData)}
      validationSchema={workshopValidationSchema}
      updateMutation={(data) =>
        updateWorkshop({
          id: rowData.id.toString(),
          data: {
            ...data,
            description: descriptionArrayToHtml(data.description),
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
