"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMemberRoleMutation,
  useUpdateMemberRoleMutation,
} from "@/service/Api/memberRole";
import { MemberRole } from "@/types/memberRole";
import { memberRoleValidationSchema } from "@/validations/memberRole";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";


export const getMemberRoleFields = (role?: MemberRole): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Role Title",
    placeholder: "Enter role title",
    ...(role?.title && { defaultValue: role.title }),
    step: 1,
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Field",
    placeholder: "Enter extra info",
    ...(role?.extra_field && { defaultValue: role.extra_field }),
    step: 1,
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    placeholder: "Enter role description",
    ...(role?.description && { defaultValue: role.description }),
    step: 1,
  },
  {
    name: "created_by_id",
    type: "number",
    label: "Created By ID",
    placeholder: "Enter creator user ID",
    ...(role?.created_by_id && { defaultValue: role.created_by_id }),
    step: 1,
  },
];


export const memberRoleColumns: ColumnDef<MemberRole>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 60,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 150,
    enableHiding: false,
  },
  {
    header: "Extra Field",
    accessorKey: "extra_field",
    size: 200,
    enableHiding: true,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 300,
    enableHiding: true,
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    size: 180,
    enableHiding: true,
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    size: 180,
    enableHiding: true,
  },
  {
    header: "Deleted At",
    accessorKey: "deleted_at",
    size: 180,
    enableHiding: true,
  },
  {
    header: "Created By ID",
    accessorKey: "created_by_id",
    size: 120,
    enableHiding: true,
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    size: 200,
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <MemberRoleRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];


function MemberRoleRowActions({ rowData }: { rowData: MemberRole }) {
  const [updateRole] = useUpdateMemberRoleMutation();
  const [deleteRole] = useDeleteMemberRoleMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      fields={getMemberRoleFields(rowData)}
      validationSchema={memberRoleValidationSchema}
      updateMutation={(data: Partial<MemberRole>) =>
        updateRole({ id: rowData.id, data })
      }
      deleteMutation={deleteRole}
      onUpdateSuccess={() => toast.success("Role updated successfully")}
      onUpdateError={() => toast.error("Failed to update role")}
      onDeleteSuccess={() => toast.success("Role deleted successfully")}
      onDeleteError={() => toast.error("Failed to delete role")}
    />
  );
}
