// src/app/(dashboard)/Hackathon-management/formOptions/member-roles/_components/columns.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import RowsActions from "@/components/table/rows-actions";
import { MemberRole } from "@/types/hackathon/memberRoles";
import { getMemberRoleFields } from "./fields";
import { memberRolesSchema } from "@/validations/hackathon/memberRolesSchema";
import {
  useUpdateMemberRoleMutation,
  useDeleteMemberRoleMutation,
} from "@/service/Api/hackathon/memberRoles";
import Link from "next/link";

/**
 * Columns definition (same style as participants)
 */
export const memberRoleColumns: ColumnDef<MemberRole>[] = [
  { header: "ID", accessorKey: "id", size: 60, enableHiding: false },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => <div className="break-all">{row.getValue("name")}</div>,
    size: 220,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => <div className="break-all">{row.getValue("description")}</div>,
    enableHiding: true,
  },
  { header: "Created At", accessorKey: "created_at", enableHiding: true },
  {
    header: "Details",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        <Link href={`/dashboard/Hackathon-management/formOptions/member-roles/${row.original.id}`}>
          View
        </Link>
        <ChevronRight />
      </Button>
    ),
    size: 140,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <MemberRoleRowActions rowData={row.original} />,
    size: 260,
    enableHiding: false,
  },
];


function MemberRoleRowActions({ rowData }: { rowData: MemberRole }) {
  const [updateMemberRole] = useUpdateMemberRoleMutation();
  const [deleteMemberRole] = useDeleteMemberRoleMutation();

  // wrapper to match RowsActions signature: (jsonData, formData) => Promise
  const handleUpdate = (jsonData: any, formData?: FormData) => {
    // updateMemberRole expects { id, data } shape in our service
    const payload = { id: Number(rowData.id), data: { name: jsonData.name, description: jsonData.description } };
    return updateMemberRole(payload);
  };

  // pass raw delete mutation function (RowsActions will call deleteMutation(id))
  return (
    <div className="flex items-center gap-3">
      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={true}
        asDialog={true}
        fields={getMemberRoleFields(rowData)}
        validationSchema={memberRolesSchema}
        updateMutation={handleUpdate}
        deleteMutation={deleteMemberRole}
        onUpdateSuccess={() => {}}
        onUpdateError={(err) => {}}
        onDeleteSuccess={() => {}}
        onDeleteError={(err) => {}}
      />
    </div>
  );
}
