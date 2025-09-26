import { ColumnDef } from "@tanstack/react-table";

export type AttendedMember = {
  id: number;
  uuid: string;
  national: string;
  name: string;
  email: string;
  phone_number: string;
};
export const attendedMembersColumns: ColumnDef<AttendedMember>[] = [
  { header: "ID", accessorKey: "id", size: 80 },
  { header: "UUID", accessorKey: "uuid", size: 120 },
  { header: "National ID", accessorKey: "national", size: 180 },
  { header: "Name", accessorKey: "name", size: 180 },
  { header: "Email", accessorKey: "email", size: 220 },
  { header: "Phone Number", accessorKey: "phone_number", size: 150 },
];
