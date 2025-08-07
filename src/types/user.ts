import { DataTableRow } from "@/types/table"

export type User = {
  id:string | number
  name: string
  email: string
  location: string
  flag: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
  bonusPoints?: number
  remarks?: string
} & DataTableRow
