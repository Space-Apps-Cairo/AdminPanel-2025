import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/hackthon/specialMember";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";
import { toast } from "sonner";
import RowsActions from "@/components/table/rows-actions";
// import {  } from "@/service/Api/hackathon/attending";
import { useDeleteSpecialCaseMutation } from "@/service/Api/hackathon/specialcase";

export const getSpecialCasesColumns = (teamsData: { id: number; name: string }[]) => {
 const getTeamName = (team_id: number) => {
  return teamsData.find(team => team.id === team_id)?.name || "Unknown";
};
  const columns = [
    { header: "Name", accessorKey: "name", size: 180 },
    { header: "Email", accessorKey: "email", size: 200 },
    { header: "Phone", accessorKey: "phone", size: 150 },
    { header: "Reason", accessorKey: "reason", size: 220 },
    { header: "National ID", accessorKey: "national_id", size: 180 },
    {
      header: "Team",
      accessorKey: "team_id",
      cell: ({ row }: any) => getTeamName(row.original.team_id),
      size: 180,
    },
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: ({ row }: any) => <SpecialCaseRowActions rowData={row.original} />,
      size: 100,
    },
  ] as ColumnDef<Member>[]; 

  return columns;
};

function SpecialCaseRowActions({ rowData }: { rowData: Member }) {
  const [deleteSpecialCase] = useDeleteSpecialCaseMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete
      isUpdate={false}
      isPreview={false}
      fields={[]}
      deleteMutation={deleteSpecialCase}
      validationSchema={SpecialMemberSchema}
      onDeleteSuccess={(result) => toast.success(result.msg || "Deleted!")}
      onDeleteError={(error: any) =>
        toast.error(error.data?.msg || "Failed to delete!")
      }
    />
  );
}

