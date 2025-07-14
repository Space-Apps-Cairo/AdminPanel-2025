import { DataTableRow } from "@/components/table/data-table"

export type Officer = {
    id: string
    name: string
    username: string
    location: string
    status: "Online" | "Offline"
    badgeNum: string
} & DataTableRow
