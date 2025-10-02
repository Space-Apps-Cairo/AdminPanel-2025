import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteJudgeMutation, useUpdateJudgeMutation } from "@/service/Api/crew/judge";
import { toast } from "sonner";
import { judgeValidationSchema } from "@/validations/crew/judge";

import { Field } from "@/app/interface";
import { Judge } from "@/types/crew/judge";

export function getJudgeFields(judge?: Judge): Field[] {
  return [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      defaultValue: judge?.name || "",
     step:1,
    },
    {
      name: "expertise",
      label: "Expertise",
      type: "text",
      placeholder: "Enter expertise",
      defaultValue: judge?.expertise || "",
     step:2,
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      defaultValue: judge?.title || "",
    step:1,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      defaultValue: judge?.email || "",
     step:1,
    },
    {
      name: "linkedIn",
      label: "LinkedIn",
      type: "text",
      placeholder: "Enter LinkedIn URL",
      defaultValue: judge?.linkedIn || "",
      step:1,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Enter phone number",
      defaultValue: judge?.phone || "",
      step:1,
    },
    {
      name: "judging_area",
      label: "Judging Area",
      type: "text",
      placeholder: "Enter judging area",
      defaultValue: judge?.judging_area || "",
    step:2,
    },
    {
      name: "reached_out_by_call",
      label: "Reached Out by Call",
      type: "checkbox",
      defaultValue: judge?.reached_out_by_call || false,
      step:2,
    },
    {
      name: "confirmed_status",
      label: "Confirmed Status",
      type: "checkbox",
      defaultValue: judge?.confirmed_status || false,
      step:2,
    },
    {
      name: "response_status",
      label: "Response Status",
      type: "select",
      options: [
        { label: "Responded via Call", value: "responded_via_call" },
        { label: "Responded via Email/LinkedIn", value: "responded_via_email_linkedin" },
        { label: "Did Not Respond", value: "did_not_respond" },
        { label: "Cancelled via Email/LinkedIn", value: "cancelled_via_email_linkedin" },
        { label: "Pending", value: "pending" },
      ],
      defaultValue: judge?.response_status || "pending",
      step:1,
    },
    {
      name: "jude_before_at",
      label: "Last Time Judged",
      type: "date",
      defaultValue: judge?.jude_before_at || "",
     step:2,
    },
  ];
}



export const judgeColumns: ColumnDef<Judge>[] = [
  {
    header: "Title",
    accessorKey: "title",
    size: 120,
  },
  {
    header: "Full Name",
    accessorKey: "name",
    size: 200,
  },
//   {
//     header: "Last Time Judged",
//     accessorKey: "jude_before_at",
//     size: 150,
//     cell: ({ row }) => {
//       const value = row.original.jude_before_at;
//       return value ? new Date(value).toLocaleDateString() : "-";
//     },
//   },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
  },
//   {
//     header: "LinkedIn",
//     accessorKey: "linkedIn",
//     size: 200,
//     cell: ({ row }) => {
//       const url = row.original.linkedIn;
//       return url ? (
//         <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
//           LinkedIn
//         </a>
//       ) : "-";
//     },
//   },
  {
    header: "Phone",
    accessorKey: "phone",
    size: 150,
  },
  {
    header: "Judging Area",
    accessorKey: "judging_area",
    size: 150,
  },
  {
    header: "Reached Out By Call",
    accessorKey: "reached_out_by_call",
    size: 150,
    cell: ({ row }) => {
  return row.original.reached_out_by_call ? (
    <Badge variant="secondary">Reached Out</Badge>
  ) : (
    <Badge variant="destructive">Not Reached</Badge>
  );
},
  },
  {
    header: "Response Status",
    accessorKey: "response_status",
    size: 200,
   cell: ({ row }) => {
  const status = row.original.response_status;
  let color: "default" | "secondary" | "destructive" = "default";

  switch (status) {
    case "responded_via_call":
    case "responded_via_email_linkedin":
      color = "secondary";
      break;
    case "did_not_respond":
    case "cancelled_via_email_linkedin":
      color = "destructive";
      break;
    default:
      color = "default";
  }

  return <Badge variant={color}>{status?.replaceAll("_", " ") || "-"}</Badge>;
},
  },
  {
    header: "Confirmed Status",
    accessorKey: "confirmed_status",
    size: 150,
    cell: ({ row }) => {
  return row.original.confirmed_status ? (
    <Badge variant="secondary">Will Attend</Badge>
  ) : (
    <Badge variant="destructive">Will Not Attend</Badge>
  );
},
  },
{
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <JudgeRowActions rowData={row.original} />
        ),
        size: 150,
        enableHiding: false,
    },

];
export function JudgeRowActions({ rowData }: { rowData: Judge }) {
  const [updateJudge] = useUpdateJudgeMutation();
  const [deleteJudge] = useDeleteJudgeMutation();

  return (
    <div className="flex items-center gap-2">

      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={false}
        fields={getJudgeFields(rowData)}
        validationSchema={judgeValidationSchema}
        updateMutation={(data: Judge) => updateJudge({ uuid: rowData.uuid, data })}
        deleteMutation={deleteJudge}
        onUpdateSuccess={(res) => toast.success(res.msg || "Judge updated successfully!")}
        onUpdateError={(err) => toast.error(err.data?.msg || "Failed to update judge")}
        onDeleteSuccess={(res) => toast.success(res.msg || "Judge deleted successfully!")}
        onDeleteError={(err) => toast.error(err.data?.msg || "Failed to delete judge")}
      />
    </div>
  );
}