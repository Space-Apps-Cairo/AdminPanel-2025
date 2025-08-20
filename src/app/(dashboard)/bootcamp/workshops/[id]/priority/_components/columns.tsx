import { ColumnDef } from "@tanstack/react-table";
import { PriorityParticipant } from "@/types/workshop";

export const priorityColumns: ColumnDef<PriorityParticipant>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 50,
  },
  {
    header: "Name (EN)",
    accessorKey: "name_en",
    size: 150,
  },
  {
    header: "Name (AR)",
    accessorKey: "name_ar",
    size: 150,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
  },
];
