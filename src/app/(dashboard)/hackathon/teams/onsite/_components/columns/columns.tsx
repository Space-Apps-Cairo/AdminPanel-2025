"use client";
import { Team } from "@/types/teams";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye } from "lucide-react";

export const teamColumns: ColumnDef<Team>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 80,
    enableHiding: false,
  },
  {
    header: "Team Name",
    accessorKey: "team_name",
    size: 200,
    enableHiding: false,
  },

  {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => String(row.getValue("status") ?? "-"),
},
 {
  accessorKey: "participation_method",
  header: "Participation Method",
  cell: ({ row }) => {
    const method = row.getValue("participation_method") as string | undefined;
    if (!method) return <Badge variant="outline">-</Badge>;

    return (
      <Badge variant={method === "virtual" ? "secondary" : "default"}>
        {method}
      </Badge>
    );
  }},
 {
    header: "Details",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        <Link href={`/hackathon/teams/All/${row.original.id}`}>View Details</Link>
        <ChevronRight />
      </Button>
    ),
    size: 140,
    enableHiding: false,
  },
];
