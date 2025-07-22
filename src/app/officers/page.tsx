"use client"

import React, { useState, useEffect } from "react"
import DataTable from "@/components/table/data-table"
import {SearchConfig, StatusConfig, ActionConfig } from '@/types/table';
import { Officer } from "@/types/officer"
import { OfficersColumns } from "./_components/columns/columns"
import Loading from "@/components/loading/loading"
import { officersExtra } from "@/data/officer-extra"
export default function Products() {

    const [products, setProducts] = useState<Officer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
        try {
            const res = await fetch(
            "https://traffic-fake-data.vercel.app/officers"
        )
            const data = await res.json();
            // console.log(data)
     const enrichedData = data.map((officer: Officer) => {
       const extra = officersExtra.find((ex) => ex.id === Number(officer.id));

        return {
          ...officer,
          evaluation: extra?.evaluation || "N/A",
          awards: extra?.awards ?? 0,
          remarks: extra?.remarks || "No remarks"
        };
      });
            setProducts(enrichedData)
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
            showExport: true,
            showDelete: true,
            addButtonText: "Add user",
            onAdd: () => {
            console.log("Open add form")
            },
        //    onExport:(type)=>{}
        //     , 
        }
        
    if(loading) return <Loading />

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
            />

        </div>
    )

}