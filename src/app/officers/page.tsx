"use client"

import React, { useState, useEffect } from "react"

import DataTable, { 
  DataTableRow, 
  SearchConfig, 
  StatusConfig, 
  ActionConfig 
} from "@/components/table/data-table"
import { Officer } from "@/types/officer"
import { OfficersColumns } from "@/columns/officer-columns"

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
        showDelete:true,
        addButtonText: "Add product",
        onAdd: () => {
        console.log("Open add form")
        }
    }

    return (
        <div className="container mx-auto py-6">

        <h1 className="text-2xl font-bold mb-6">Officer</h1>

        <DataTable<Officer>
         data={products}
            columns={OfficersColumns}
            searchConfig={searchConfig}
            statusConfig={statusConfig}
            actionConfig={actionConfig}
            onDataChange={setProducts}
            loading={loading}
            // enableSelection={true}
            // enableColumnVisibility={false}
            enableSorting={true}
            pageSize={10}
        />

        </div>
    )

}