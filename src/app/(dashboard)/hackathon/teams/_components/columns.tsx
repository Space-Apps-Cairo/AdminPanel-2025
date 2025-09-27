"use client";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteTeamMutation } from "@/service/Api/teams";
import { Team } from "@/types/teams";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";
import {
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
} from "@/service/Api/emails/templates";
import {
  sendEmailSchema,
} from "@/validations/emails/templates";
import { Field, FieldOption } from "@/app/interface";
import CrudForm from "@/components/crud-form";
import { useState } from "react";
export const teamColumns: ColumnDef<Team>[] = [
  {
    header: "UUID",
    accessorKey: "uuid",
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
    header: "Total Score",
    accessorKey: "total_score",
    cell: ({ row }) => {
      const score = row.original.total_score;
      return score !== null ? score : "—";
    },
  },
  {
    header: "Rank",
    accessorKey: "rank",
    cell: ({ row }) => {
      const rank = row.original.rank;
      return rank ? `#${rank}` : "—";
    },
  },
  {
    header: "Participation Method",
    accessorKey: "participation_method.title",
    size: 150,
    cell: ({ row }) => {
      const method = row.original.participation_method;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant={method?.title === "onsite" ? "default" : "secondary"}
            className="capitalize px-2.5 py-1"
          >
            {method?.title || "N/A"}
          </Badge>
        </div>
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
const [sendEmail] = useSendEmailsMutation();
  const { data, isLoading } = useGetEmailTemplatesQuery();
 const [isOpen, setIsOpen] = useState(false);
   const templateOptions: FieldOption[] =
      data?.data?.map((template) => ({
        value: template.id.toString(),
        label: template.title,
      })) ?? [];
  
 const fields: Field[] = [
    {
      name: "template_id",
      type: "select",
      label: "Select Template",
      options: templateOptions,
      placeholder: isLoading ? "Loading templates..." : "Choose a template",
    },
    {
      name: "ids",
      type: "select",
      label: "Select Teams",
      options: [{ value: rowData.id.toString(), label: rowData.team_name }],
      defaultValue: rowData.id.toString(),
    },
  ];
//
  async function handleEmailSubmit(data) {
    try {
      const payload = {
        template_id: data.template_id,
        ids: [rowData.id],
      };
      await sendEmail(payload).unwrap();
      toast.success("Email sended successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong on send Email");
    }
  }


  return (
    <div className="flex items-center gap-3">
 {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={sendEmailSchema}
          onSubmit={handleEmailSubmit}
        />
      )}
      
      <Button variant={"outline"} size={"sm"} onClick={() => setIsOpen(true)}>
        <Mail />
      </Button>


      <Link href={`/hackathon/teams/${rowData.id}`}>
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
        updateMutation={(data: Team) => Promise.resolve(data)}
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
