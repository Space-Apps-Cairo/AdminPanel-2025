import { DataTableRow } from "@/components/table/data-table"

export type User = {
  id: string
  name: string
  email: string
  location: string
  flag: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
} & DataTableRow