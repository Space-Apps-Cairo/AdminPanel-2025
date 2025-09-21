// src/app/(dashboard)/Hackathon-management/formOptions/member-roles/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import { memberRoleColumns } from "./_components/columns";
import { getMemberRoleFields } from "./_components/fields";
import { memberRolesSchema, type MemberRoleFormValues } from "@/validations/hackathon/memberRolesSchema";
import { MemberRole } from "@/types/hackathon/memberRoles";
import {
  useGetMemberRolesQuery,
  useAddMemberRoleMutation,
} from "@/service/Api/hackathon/memberRoles";
import { useToast } from "@/components/ui/use-toast";

export default function MemberRolesPage() {
  const { toast } = useToast();

  const { data: rolesResp, isLoading, error } = useGetMemberRolesQuery();
  const [roles, setRoles] = useState<MemberRole[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [addMemberRole] = useAddMemberRoleMutation();

  useEffect(() => {
    if (rolesResp?.data) {
      setRoles(rolesResp.data);
    }
  }, [rolesResp]);

  const searchConfig = {
    enabled: true,
    placeholder: "Search by name or description",
    searchKeys: ["name", "description"],
  };

  const actionConfig = {
    enabled: true,
    showAdd: true,
    addButtonText: "Add Role",
    showExport: true,
    onAdd: () => setIsOpen(true),
  };

  const columnVisibilityConfig = {
    enableColumnVisibility: true,
    invisibleColumns: ["description", "created_at"],
  };

  const handleAddRole = async (data: MemberRoleFormValues, formData?: FormData) => {
    try {
      const payload = { name: data.name, description: data.description ?? null };
      const result = await addMemberRole(payload).unwrap();

      if (result?.data) {
        setRoles((prev) => [...prev, result.data]);
        toast({
          title: "Role added",
          description: "Member role added successfully",
        });
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error("Add role error:", err);
      toast({
        title: "Error",
        description: err?.data?.message ?? "Failed to add role",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading roles</div>;

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-6">Member Roles</h1>

      <DataTable<MemberRole>
        data={roles}
        columns={memberRoleColumns}
        searchConfig={searchConfig}
        actionConfig={actionConfig}
        onDataChange={setRoles}
        enableBulkEmail={false}
        enableSelection={true}
        columnVisibilityConfig={columnVisibilityConfig}
      />

      {isOpen && (
        <CrudForm
          fields={getMemberRoleFields(undefined)}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={memberRolesSchema}
          onSubmit={handleAddRole as any}
          steps={[1]}
        />
      )}
    </div>
  );
}
