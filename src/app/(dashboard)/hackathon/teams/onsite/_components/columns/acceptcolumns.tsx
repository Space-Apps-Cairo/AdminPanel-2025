"use client";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteTeamMutation,
} from "@/service/Api/teams";
import { Team } from "@/types/teams";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
    header: "Team Leader",
    accessorKey: "team_leader.name",
    cell: ({ row }) => {
      const teamLeader = row.original.team_leader;
      return teamLeader ? (
        <span className="text-sm">{teamLeader.name}</span>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      );
    },
    size: 200,
    enableHiding: false,
  },
  {
    header: "Challenge Name",
    accessorKey: "challenge.title",
    size: 250,
    cell: ({ row }) => {
      const challenge = row.original.challenge;
      return challenge ? (
        <span className="text-sm">{challenge.title}</span>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      );
    },
  },
 
  {
    header: "Actions",
    id: "actions",
    size: 100,
    cell: ({ row }) => <TeamRowActions rowData={row.original} />,
  },
];

function TeamRowActions({ rowData }: { rowData: Team }) {
  const [deleteTeam] = useDeleteTeamMutation();

  return (
    <div className="flex items-center gap-3">

        <Link href={`/hackathon/teams/All/${rowData.id}`}>
            <Button variant={"outline"} size={"sm"}>
                <Eye size={16} />
            </Button>
        </Link>

        <RowsActions
            rowData={rowData}
            isDelete={true}
            isUpdate={false}
            isPreview={false}
            fields={[]}
            validationSchema={null}
            updateMutation={(data: Team) =>
                Promise.resolve(data)
            }
            deleteMutation={deleteTeam}
            onUpdateSuccess={(result) => {
                console.log("Team updated successfully:", result);
                toast.success(result.message || "Team updated successfully!");
            }}
            onUpdateError={(error) => {
                console.error("Error updating team:", error);
                toast.error(
                error.data?.message || "Failed to update team. Please try again."
                );
            }}
            onDeleteSuccess={(result) => {
                console.log("Team deleted successfully:", result);
                toast.success(result.message || "Team deleted successfully!");
            }}
            onDeleteError={(error) => {
                console.error("Error deleting team:", error);
                toast.error(
                    error.data?.message || "Failed to delete team. Please try again."
                );
            }}
        />

    </div>
  );
}
