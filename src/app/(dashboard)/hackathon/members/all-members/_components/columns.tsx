"use client";

import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMemberMutation,
  useUpdateMemberMutation,
  
} from "@/service/Api/hackathon/member";
import { useSendTestEmailMutation } from "@/service/Api/emails/templates";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Member } from "@/types/hackthon/member";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import { memberSchema } from "@/validations/hackthon/member";
import { Field } from "@/app/interface";

export const getMemberFields = (member?: Member): Field[] => [
  {
    name: "national",
    type: "text",
    label: "National ID",
    placeholder: "Enter national ID",
    ...(member?.national && { defaultValue: member.national }),
    step: 1,
  },
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter full name",
    ...(member?.name && { defaultValue: member.name }),
    step: 1,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter email address",
    ...(member?.email && { defaultValue: member.email }),
  },
  {
    name: "phone_number",
    type: "text",
    label: "Phone Number",
    placeholder: "Enter phone number",
    ...(member?.phone_number && { defaultValue: member.phone_number }),
  },
  {
    name: "age",
    type: "number",
    label: "Age",
    placeholder: "Enter age",
    ...(member?.age && { defaultValue: member.age }),
  },
  {
    name: "is_new",
    type: "checkbox",
    label: "Is New Member?",
    ...(typeof member?.is_new === "boolean" && { defaultValue: member.is_new }),
  },
  {
    name: "member_role",
    type: "text",
    label: "Role",
    placeholder: "Enter member role",
    ...(member?.member_role && { defaultValue: member.member_role }),
  },
  {
    name: "tshirt_size_id",
    type: "number",
    label: "T-Shirt Size ID",
    placeholder: "Enter t-shirt size ID",
    ...(member?.tshirt_size_id && { defaultValue: member.tshirt_size_id }),
  },
  {
    name: "major_id",
    type: "number",
    label: "Major ID",
    placeholder: "Enter major ID",
    ...(member?.major_id && { defaultValue: member.major_id }),
  },
  {
    name: "organization",
    type: "text",
    label: "Organization",
    placeholder: "Enter organization",
    ...(member?.organization && { defaultValue: member.organization }),
  },
  {
    name: "participation_type",
    type: "number",
    label: "Participation Type",
    placeholder: "Enter participation type",
    ...(member?.  participant_type&& {
      defaultValue: member.participation_type,
    }),
  },
  {
    name: "study_level_id",
    type: "number",
    label: "Study Level ID",
    placeholder: "Enter study level ID",
    ...(member?.study_level_id && { defaultValue: member.study_level_id }),
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Info",
    placeholder: "Enter extra info",
    ...(member?.extra_field && { defaultValue: member.extra_field }),
  },
  {
    name: "notes",
    type: "textArea",
    label: "Notes",
    placeholder: "Enter any notes",
    ...(member?.notes && { defaultValue: member.notes }),
  },
  {
    name: "address",
    type: "text",
    label: "Address",
    placeholder: "Enter address",
    ...(member?.address && { defaultValue: member.address }),
  },
];






export const memberColumns: ColumnDef<Member>[] = [
  {
    header: "UUID",
    accessorKey: "uuid",
    size: 80,
    enableHiding: false,
  },
  {
    header: "National ID",
    accessorKey: "national",
    size: 160,
  },
  {
    header: "Name",
    accessorKey: "name",
    size: 200,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
    enableHiding: false,
  },
  {
    header: "Phone",
    accessorKey: "phone_number",
    size: 180,
  },
  // {
  //   header: "Age",
  //   accessorKey: "age",
  //   size: 80,
  // },
  // {
  //   header: "New?",
  //   accessorKey: "is_new",
  //   size: 100,
  //   cell: ({ row }) => (
  //     <Badge
  //       variant={row.original.is_new ? "default" : "secondary"}
  //       className="capitalize px-2.5 py-1"
  //     >
  //       {row.original.is_new ? "Yes" : "No"}
  //     </Badge>
  //   ),
  // },
  {
    header: "Role",
    accessorKey: "member_role",
    size: 150,
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.member_role === "team_lead" ? "default" : "secondary"
        }
        className="capitalize px-2.5 py-0.5"
      >
        {row.original.member_role}
      </Badge>
    ),
  },
  // {
  //   header: "Participation",
  //   accessorKey: "participation_type",
  //   size: 150,
  //   cell: ({ row }) => (
  //     <Badge
  //       variant={
  //         row.original.participant_type === "online" ? "secondary" : "default"
  //       }
  //       className="capitalize px-2.5 py-1"
  //     >
  //       {row.original.participant_type}
  //     </Badge>
  //   ),
  // },
  // {
  //   header: "Organization",
  //   accessorKey: "organization",
  //   size: 200,
  // },
  // {
  //   header: "Major",
  //   accessorKey: "major.title",
  //   size: 120,
  // },
  {
    header: "Study Level",
    accessorKey: "study_level.title",
    size: 120,
    cell: ({ row }) => (
      <Badge className="capitalize px-2.5 py-0.5">
        {row.original.study_level?.title ?? "N/A"}
      </Badge>
    ),
  },
  {
    header: "T-Shirt Size",
    accessorKey: "tshirt_size.title",
    size: 120,
    cell: ({ row }) => (
      <Badge className="capitalize px-2.5 py-0.5">
        {row.original?.tshirt_size?.title ?? "N/A"}
      </Badge>
    ),
  },
  // {
  //   header: "Notes",
  //   accessorKey: "notes",
  //   size: 200,
  //   cell: ({ row }) =>
  //     row.original.notes ? (
  //       <span className="text-sm text-muted-foreground">
  //         {row.original.notes}
  //       </span>
  //     ) : (
  //       <span className="text-sm text-muted-foreground">—</span>
  //     ),
  // },
  {
    header: "Actions",
    id: "actions",
    size: 120,
    cell: ({ row }) => <MemberRowActions rowData={row.original} />,
  },
];

function MemberRowActions({ rowData }: { rowData: Member }) {
  const [deleteMember] = useDeleteMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [sendTestEmail] = useSendTestEmailMutation();

async function handleSendEmail() {
  try {
    await sendTestEmail({
      template_id: 1, 
      email: rowData.email, 
    }).unwrap();

    toast.success("Email sent successfully!");
  } catch (error) {
    toast.error("Failed to send email");
    console.error(error);
  }
}


  return (
    <div className="flex items-center gap-3">
    <Button variant="outline" size="sm" onClick={handleSendEmail}>
    <Mail className="w-4 h-4" />
  </Button>
      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={true}
        fields={
          
          

getMemberFields(rowData)}
        validationSchema={memberSchema}
        updateMutation={(data) =>
          updateMember({ id: rowData.id, data }).unwrap()
        }
        deleteMutation={deleteMember}
        onUpdateSuccess={(result) => {
          toast.success(result.message || "Member updated successfully!");
        }}
        onUpdateError={(error) => {
          toast.error(
            error.data?.message || "Failed to update member. Please try again."
          );
        }}
        onDeleteSuccess={(result) => {
          toast.success(result.message || "Member deleted successfully!");
        }}
        onDeleteError={(error) => {
          toast.error(
            error.data?.message || "Failed to delete member. Please try again."
          );
        }}
      />
    </div>
  );
}
