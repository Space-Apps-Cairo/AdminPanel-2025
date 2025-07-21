"use client";

import React, {  useState, useEffect } from "react";
import { User } from "@/types/user";
import { userColumns } from "./_components/columns/columns";
import DataTable from "@/components/table/data-table";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Loading from "@/components/loading/loading";
import { extraDataMap } from "@/data/user-extra";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json"
        );
        const data = await res.json();
        //  console.log(data)
        const enriched = data.map((user: User) => ({
          ...user,
          bonusPoints: extraDataMap[user.id]?.bonusPoints || 0,
          remarks: extraDataMap[user.id]?.remarks || "N/A",
        }));

        setUsers(enriched);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name or email",
    searchKeys: ["name", "email"],
  };

  const statusConfig: StatusConfig = {
    enabled: true,
    columnKey: "status",
    title: "Status",
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showExport: true,
    showDelete: true,
    addButtonText: "Add user",
    onAdd: () => {
      console.log("Open add form");
    },
  };

  if (loading) return <Loading />;
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <DataTable<User>
        data={users}
        columns={userColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
        onDataChange={setUsers}
      />
    </div>
  );
}
