"use client";

import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} from "@/service/Api/hackathon/member";
import {
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
  // useSendTestEmailMutation,
} from "@/service/Api/emails/templates";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

import { Member } from "@/types/hackthon/member";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { memberSchema } from "@/validations/hackthon/member";
import { Field, FieldOption } from "@/app/interface";
import { sendEmailSchema } from "@/validations/emails/templates";
import CrudForm from "@/components/crud-form";
import { useState } from "react";
import { useRegisterHackathonMemberMutation } from "@/service/Api/hackathon/attending";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


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
    header: "Actions",
    id: "actions",
    size: 170,
    cell: ({ row }) => <MemberRowActions rowData={row.original} />,
  },
];

function MemberRowActions({ rowData }: { rowData: Member }) {
  const [deleteMember] = useDeleteMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  // const [sendTestEmail] = useSendTestEmailMutation();
  const [sendEmail] = useSendEmailsMutation();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetEmailTemplatesQuery();
  const [registerHackathonMember, { isLoading: isRegistering }] = useRegisterHackathonMemberMutation();
  const templateOptions: FieldOption[] = data?.data?.map((template) => ({
    value: template.id.toString(),
    label: template.title,
  })) ?? [];

  const fields: Field[] = [
    {
      name: "template_id",
      type: "select",
      label: "Select Template",
      options: templateOptions,
      placeholder: isLoading ? "Loading templates..." : "Choose a template",
    },
    {
      name: "ids",
      type: "select",
      label: "Select Participants",
      //  Example: single participant
      options: [{ value: rowData.id.toString(), label: rowData.name }],
      defaultValue: rowData.id.toString(),
    },
  ];

  async function handleEmailSubmit(data: any) {
    try {
      const payload = {
        template_id: data.template_id,
        ids: [rowData.id],
      };
      await sendEmail(payload).unwrap();
      toast.success("Email sent successfully");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
    }
  }
  async function handleAttendMember() {
    try {
      await registerHackathonMember({ member_id: rowData.uuid }).unwrap();
      toast.success("Member marked as attended");
    } catch (err: any) {
      const description = err?.data?.msg || err?.data?.message || "Registration failed";
      toast.error("Failed to mark as attended", { description });
    }
  }

  return (
    <div className="flex items-center gap-3">

      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Mail className="w-4 h-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isRegistering}
            title="Mark as attended"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Attendance Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{rowData.name}" as attended?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRegistering}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRegistering}
              onClick={handleAttendMember}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={sendEmailSchema}
          onSubmit={handleEmailSubmit}
        />
      )}

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
        updateMutation={(data: any) =>
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
