"use client"

import React, { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import DataTable, { 
  DataTableRow, 
  SearchConfig, 
  StatusConfig, 
  ActionConfig 
} from "@/components/table/data-table"

type User = {
  id: string
  name: string
  email: string
  location: string
  flag: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
} & DataTableRow

const userColumns: ColumnDef<User>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
        <span className="text-lg leading-none">{row.original.flag}</span>{" "}
        {row.getValue("location")}
      </div>
    ),
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Inactive" &&
            "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <div className="py-2.5 flex items-center gap-2.5">
        <Button variant="outline" size="sm">
          <Eye size={16} />
        </Button>
        <Button variant="outline" size="sm">
          <SquarePen size={16} />
        </Button>
        <Button variant="outline" size="sm">
          <Trash size={16} />
        </Button>
      </div>
    ),
    size: 150,
    enableHiding: false,
  },
]

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

    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading Users...</div>
        </div>
      )
    }

    return (
        <div className="container mx-auto py-6">

          <h1 className="text-2xl font-bold mb-6">Users</h1>

          <DataTable data={users}
            columns={userColumns}
            searchConfig={searchConfig}
            statusConfig={statusConfig}
            actionConfig={actionConfig}
            onDataChange={setUsers}
          />

        </div>
    )

}