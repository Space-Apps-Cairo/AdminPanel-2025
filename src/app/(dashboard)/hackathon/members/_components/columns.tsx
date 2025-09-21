"use client";

import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} from "@/service/Api/hackthon/member";
import { Member } from "@/types/hackthon/member";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { memberSchema } from "@/validations/hackthon/member";
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

  return (
    <div className="flex items-center gap-3">
      {/* <Link href={`/hackathon/members/${rowData.id}`}>
        <Button variant={"outline"} size={"sm"}>
          <Eye size={16} />
        </Button>
      </Link> */}

      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={false}
        isPreview={false}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone_number", label: "Phone Number", type: "text" },
          { name: "age", label: "Age", type: "number" },
          {
            name: "member_role",
            label: "Role",
            type: "select",
            options: [],
          },
          {
            name: "participant_type",
            label: "Participant Type",
            type: "select",
            options: [],
          },
          { name: "organization", label: "Organization", type: "text" },
        ]}
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
