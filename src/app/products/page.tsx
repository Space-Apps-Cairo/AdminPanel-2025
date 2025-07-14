"use client"

import React, { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import DataTable, { 
  DataTableRow, 
  SearchConfig, 
  StatusConfig, 
  ActionConfig 
} from "@/components/table/data-table"

type Officer = {
    id: string
    name: string
    username: string
    location: string
    status: "Online" | "Offline"
    badgeNum: string
} & DataTableRow

const OfficersColumns: ColumnDef<Officer>[] = [
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
    header: "Username",
    accessorKey: "username",
    size: 220,
  },
  {
    header: "Badge number",
    accessorKey: "badgeNum",
    size: 220,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
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
          row.getValue("status") === "Offline" &&
            "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
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
          <Trash size={16} />
        </Button>
      </div>
    ),
    size: 80,
    enableHiding: false,
  },
]

export default function Products() {

    const [products, setProducts] = useState<Officer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
        try {
            const res = await fetch(
            "https://traffic-fake-data.vercel.app/officers"
        )
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
        }
        fetchProducts()
    }, [])

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by name or username or bade number",
        searchKeys: ["name", "email", "badgeNum"]
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
        addButtonText: "Add product",
        onAdd: () => {
        console.log("Open add form")
        }
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading Officers...</div>
        </div>
      )
    }

    return (
        <div className="container mx-auto py-6">

          <h1 className="text-2xl font-bold mb-6">Officer</h1>

          <DataTable data={products}
            columns={OfficersColumns}
            searchConfig={searchConfig}
            statusConfig={statusConfig}
            actionConfig={actionConfig}
            onDataChange={setProducts}
          />

        </div>
    )

}