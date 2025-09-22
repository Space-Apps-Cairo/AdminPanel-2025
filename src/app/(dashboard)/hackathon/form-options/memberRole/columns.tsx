"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteMemberRoleMutation,
  useUpdateMemberRoleMutation,
} from "@/service/Api/hackthon/form-options/memberRole";
import { MemberRole } from "@/types/hackthon/form-options/memberRole";
import { memberRoleValidationSchema } from "@/validations/hackthon/form-options/memberRole";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export const getMemberRoleFields = (role?: MemberRole): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Role Name",
    placeholder: "Enter role name",
    ...(role?.name && { defaultValue: role.name }),
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
    header: "Role Name",
    accessorKey: "name",
    size: 200,
    enableHiding: false,
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
