"use client"

import React, { useState, useEffect } from "react"
import { User } from "@/types/user"
import { userColumns } from "./_components/columns/columns"
import DataTable, { 
  DataTableRow, 
  SearchConfig, 
  StatusConfig, 
  ActionConfig 
} from "@/components/table/data-table"


export default function Users() {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUsers() {
        try {
            const res = await fetch(
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json"
        )
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
        }
        fetchUsers()
    }, [])

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by name or email",
        searchKeys: ["name", "email"]
    }

    const statusConfig: StatusConfig = {
        enabled: true,
        columnKey: "status",
        title: "Status"
    }

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add user",
        onAdd: () => {
        console.log("Open add form")
        }
    }

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
    )

}