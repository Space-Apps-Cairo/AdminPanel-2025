"use client";

import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";

import { memberRoleColumns, getMemberRoleFields } from "./columns";

import {
  useGetMemberRolesQuery,
  useAddMemberRoleMutation,
} from "@/service/Api/memberRole";
import { MemberRole } from "@/types/memberRole";
import { memberRoleValidationSchema } from "@/validations/memberRole";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";

export default function MemberRoles() {
  const {
    data: memberRolesData,
    isLoading,
    error,
  } = useGetMemberRolesQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [addMemberRole] = useAddMemberRoleMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by role name",
    searchKeys: ["name"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Member Role",
    onAdd: () => setIsOpen(true),
  };

  const handleAddMemberRoleSubmit = async (data: FieldValues) => {
    try {
      const result = await addMemberRole(data).unwrap();
      console.log("Member role added successfully:", result);
      toast.success("Member role added successfully!");
    } catch (error) {
      console.error("Error adding member role:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add member role. Please try again."
      );
      throw error;
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getMemberRoleFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={memberRoleValidationSchema}
          onSubmit={handleAddMemberRoleSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Member Roles</h1>

        <DataTable<MemberRole>
          data={memberRolesData?.data ?? []}
          columns={memberRoleColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
    </React.Fragment>
  );
}
