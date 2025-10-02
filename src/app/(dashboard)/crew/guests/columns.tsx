import { ColumnDef } from "@tanstack/react-table"
import { Guest } from "@/types/crew/guest"
import RowsActions from "@/components/table/rows-actions";
import { guestValidationSchema } from "@/validations/crew/guest";
import { toast } from "sonner";
import { Field } from "@/app/interface";
import { useDeleteGuestMutation, useUpdateGuestMutation } from "@/service/Api/crew/guest";

export const getGuestFields = (rowData?: Guest): Field[] => [
  {
    name: "fullName",
    label: "Full Name",
   type: "text",
    placeholder: "Enter full name",
    defaultValue: rowData?.fullName || "",
   
  },
  {
    name: "organization",
    label: "Organization",
    type: "text",
    placeholder: "Enter organization (optional)",
    defaultValue: rowData?.organization || "",
   
  },
  {
    name: "nationality",
    label: "National ID",
    type: "text",
    placeholder: "Enter national ID",
    defaultValue: rowData?.nationality || "",
   
  },
  {
    name: "freeSpace",
    label: "Free Space",
    type: "textArea",
    placeholder: "Optional free notes",
    defaultValue: rowData?.freeSpace || "",
  },
]
export const guestColumns: ColumnDef<Guest>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 80,
    enableHiding: false,
  },
  {
  header: "Full Name",
  accessorFn: (row) => row.fullName ?? "-",
  id: "fullName",
},
{
  header: "Organization",
  accessorFn: (row) => row.organization ?? "-",
  id: "organization",
},
{
  header: "National ID",
  accessorFn: (row) => row.nationality ?? "-",
  id: "nationality",
},
  {
    header: "Free Space",
    accessorFn: (row) => row.freeSpace ?? "-",
    id: "freeSpace",
  },
 {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <GuestRowActions rowData={row.original} />
        ),
        size: 150,
        enableHiding: false,
    },

];

export function GuestRowActions({ rowData }: { rowData: Guest }) {
  const [updateGuest] = useUpdateGuestMutation()
  const [deleteGuest] = useDeleteGuestMutation();


  return (
    <div className="flex items-center gap-3">
      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={false}
        fields={getGuestFields(rowData)}
        validationSchema={guestValidationSchema}
        updateMutation={(data:Guest) =>
          updateGuest({ id: rowData.id, data })
        }
        deleteMutation={deleteGuest}
        onUpdateSuccess={(result) => {
          console.log("Guest updated successfully:", result)
          toast.success(result.msg || "Guest updated successfully!")
        }}
        onUpdateError={(error) => {
          console.error("Error updating guest:", error)
          toast.error(error.data?.msg || "Failed to update guest. Please try again.")
        }}
        onDeleteSuccess={(result) => {
          console.log("Guest deleted successfully:", result)
          toast.success(result.msg || "Guest deleted successfully!")
        }}
        onDeleteError={(error) => {
          console.error("Error deleting guest:", error)
          toast.error(error.data?.msg || "Failed to delete guest. Please try again.")
        }}
      />
    </div>
  )
}