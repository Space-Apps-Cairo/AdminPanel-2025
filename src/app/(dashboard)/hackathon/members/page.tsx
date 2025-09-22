"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import {
  useGetMembersQuery,
  useDeleteMemberMutation,
} from "@/service/Api/hackthon/member";
import { Member } from "@/types/hackthon/member";
import {
  ActionConfig,
  ColumnVisibilityConfig,
  SearchConfig,
  StatusConfig,
} from "@/types/table";
import React from "react";
import { memberColumns } from "./_components/columns";
import { toast } from "sonner";

export default function MembersPage() {
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useGetMembersQuery();

  // Delete mutation for bulk operations
  const [deleteMember] = useDeleteMemberMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name, email, phone",
    searchKeys: ["uuid", "email", "national"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: false,
    showAdd: true, // allow admin to add members
    showDelete: true,
    addButtonText: "Add Member",
  };
  const columnVisibilityConfig: ColumnVisibilityConfig = {
    enableColumnVisibility: true,
    // invisibleColumns:["age","is_new","participation_type",""]
  };
  if (isLoadingMembers) return <Loading />;

  if (membersError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading members</div>
      </div>
    );
  }

  return (
    <div className=" py-6 px-7">
      <h1 className="text-2xl font-bold mb-6">Hackathon Members</h1>

      <DataTable<Member>
        data={membersData}
        columns={memberColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
        columnVisibilityConfig={columnVisibilityConfig}
        bulkDeleteMutation={(ids: number[]) =>
          Promise.all(ids.map((id) => deleteMember(id).unwrap()))
            .then(() => toast.success("Members deleted successfully!"))
            .catch(() => toast.error("Failed to delete selected members."))
        }
      />
    </div>
  );
}
