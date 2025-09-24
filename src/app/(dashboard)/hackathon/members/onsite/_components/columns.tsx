"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/filtertion/member";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import RowsActions from "@/components/table/rows-actions";

export const MemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
    enableHiding: false,
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    size: 150,
    enableHiding: false,
  },
  {
    id: "team_name",
    header: "Team",
    cell: ({ row }) => {
      const teams = row.original.teams ?? [];
      return (
        <div className="flex flex-col gap-1">
          {teams.map((team) => (
            <span key={team.id}>{team.team_name}</span>
          ))}
        </div>
      );
    },
  },
  {
    id: "team_status",
    header: "Status",
    cell: ({ row }) => {
      const teams = row.original.teams ?? [];
      return (
        <div className="flex flex-col gap-1">
          {teams.map((team) => (
            <Badge
              key={`status-${row.original.id}-${team.id}`}
              variant={
                team.status === "accepted"
                  ? "default"
                  : team.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {team.status}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "participation_method",
    header: "Participation",
    cell: ({ row }) => {
      const teams = row.original.teams ?? [];
      return (
        <div className="flex flex-col gap-1">
          {teams.map((team) => (
            <Badge
              key={`method-${row.original.id}-${team.id}`}
              variant={team.participation_method === "virtual" ? "secondary" : "default"}
            >
              {team.participation_method}
            </Badge>
          ))}
        </div>
      );
    },
  },
  
];
