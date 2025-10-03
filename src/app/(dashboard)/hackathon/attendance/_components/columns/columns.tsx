import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/hackthon/member";

export const attendedMembersColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "member.uuid", size: 80 },
  { header: "National ID", accessorKey: "member.national", size: 180 },
  { header: "Name", accessorKey: "member.name", size: 180 },
  { header: "Email", accessorKey: "member.email", size: 220 },
  { header: "Phone Number", accessorKey: "member.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
];
