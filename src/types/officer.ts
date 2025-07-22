import { DataTableRow } from 
"@/types/table"

export type Officer = {
    id: string
    name: string
    username: string
    location: string
    status: "Online" | "Offline"
    badgeNum: string
evaluation?: string
  awards?: number
  remarks?: string
} & DataTableRow
