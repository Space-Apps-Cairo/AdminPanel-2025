import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/hackthon/member";

export const attendedMembersColumns: ColumnDef<Member>[] = [
  { header: "ID", accessorKey: "id", size: 80 },
  { header: "National ID", accessorKey: "national", size: 180 },
  { header: "Name", accessorKey: "name", size: 180 },
  { header: "Email", accessorKey: "email", size: 220 },
  { header: "Phone Number", accessorKey: "phone_number", size: 150 },
];
