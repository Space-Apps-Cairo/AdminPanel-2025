"use client";
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import { MentorShipNeeded} from "@/types/hackthon/form-options/mentorShipNeeded";
import { mentorshipValidationSchema } from "@/validations/hackthon/form-options/mentorship";
import {
  useDeleteMentorShipMutation,useUpdateMentorShipMutation
} from "@/service/Api/hackthon/form-options/mentorShipNeeded";
import { toast } from "sonner";
import { Field } from "@/app/interface";

export const getMentorshipFields = (mentorship?: MentorShipNeeded): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter mentorship title",
    ...(mentorship?.title && { defaultValue: mentorship.title }),
   
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Info",
    placeholder: "Enter extra info (e.g., Mentorship description)",
    ...(mentorship?.extra_field && { defaultValue: mentorship.extra_field }),
   
  },
];

export const mentorshipColumns: ColumnDef<MentorShipNeeded>[] = [
  {
    header: "Title",
    accessorKey: "title",
    size: 200,
 
  },
  {
    header: "Extra Info",
    accessorKey: "extra_field",
    size: 400,
  },
  {
  header: "How Many Teams Need",
  accessorKey: "how_many_teams_need",
  
},
  {
    id: "actions",
    header: () => <span>Actions</span>,
    size: 150,
    enableHiding: false,
    cell: ({ row }) => <MentorshipRowActions rowData={row.original} />,
  },
];

function MentorshipRowActions({ rowData }: { rowData: MentorShipNeeded}) {
  const [updateMentorship] = useUpdateMentorShipMutation();
  const [deleteMentorship] = useDeleteMentorShipMutation();

  return (
    <div className="flex items-center gap-2">
      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={true}
        fields={getMentorshipFields(rowData)}
        validationSchema={mentorshipValidationSchema}
        updateMutation={(data: MentorShipNeeded) =>
          updateMentorship({ id: rowData.id, data })
        }
        deleteMutation={deleteMentorship}
        onUpdateSuccess={(result) => {
          toast.success(result.message || "Mentorship updated successfully!");
        }}
        onUpdateError={(error) => {
          toast.error(
            error.data?.message || "Failed to update Mentorship. Please try again."
          );
        }}
        onDeleteSuccess={(result) => {
          toast.success(result.message || "Mentorship deleted successfully!");
        }}
        onDeleteError={(error) => {
          toast.error(
            error.data?.message || "Failed to delete Mentorship. Please try again."
          );
        }}
      />
    </div>
  );
}



