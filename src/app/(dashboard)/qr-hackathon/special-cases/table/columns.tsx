import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteSpecialCaseMutation,
} from "@/service/Api/hackathon/specialcase";
import { Member } from "@/types/hackthon/specialMember";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";

export const specialCasesColumns: ColumnDef<Member>[] = [
  {
    header: "Name",
    accessorKey: "name",
    size: 180,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 200,
    enableHiding: false,
  },
  {
    header: "Phone",
    accessorKey: "phone",
    size: 150,
    enableHiding: false,
  },
  {
    header: "Reason",
    accessorKey: "reason",
    size: 220,
    enableHiding: false,
  },
  {
    header: "National ID",
    accessorKey: "national_id",
    size: 180,
    enableHiding: false,
  },
  {
    header: "Team ID",
    accessorKey: "team_id",
    size: 120,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <SpecialCaseRowActions rowData={row.original} />,
    size: 100,
    enableHiding: false,
  },
];

function SpecialCaseRowActions({ rowData }: { rowData: Member }) {
  
  const [deleteSpecialCase] = useDeleteSpecialCaseMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={false}
      isPreview={true}
      fields={[]}
      deleteMutation={deleteSpecialCase}
      validationSchema={SpecialMemberSchema}
      onDeleteSuccess={(result) => {
        console.log("Special Case deleted successfully:", result);
        toast.success(result.msg || "Special Case deleted successfully!");
      }}
      onDeleteError={(error) => {
        console.error("Error deleting Special Case:", error);
        toast.error(
          error.data?.msg || "Failed to delete Special Case. Please try again."
        );
      }}
    />
  );
}
