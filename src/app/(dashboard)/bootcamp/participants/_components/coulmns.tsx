import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteParticipantMutation,
  useUpdateParticipantMutation,
} from "@/service/Api/participants";
import { Participant } from "@/types/participants";
import { Field } from "@/app/interface";
import { participantValidationSchema } from "@/validations/participantSchema";

export const getParticipantsFields = (
  participantData?: Participant
): Field[] => [
  {
    name: "name_ar",
    type: "text",
    label: "Arabic Name",
    ...(participantData?.name_ar && { defaultValue: participantData.name_ar }),
    placeholder: "Enter you name in arabic",
  },
  {
    name: "name_en",
    type: "text",
    label: "English Name",
    ...(participantData?.name_en && { defaultValue: participantData.name_en }),
    placeholder: "Enter you name in english",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    ...(participantData?.email && { defaultValue: participantData.email }),
    placeholder: "Enter you email@gmail.com",
  },
  {
    name: "age",
    type: "number",
    label: "Age",
    ...(participantData?.age && { defaultValue: participantData.age }),
    placeholder: "Enter you age@gmail.com",
  },
  {
    name: "phone_number",
    type: "text",
    label: "Phone Number",
    ...(participantData?.phone_number && {
      defaultValue: participantData.phone_number,
    }),
  },
  // Add other fields following the same pattern
];

export const participantColumns: ColumnDef<Participant>[] = [
  {
    header: "English Name",
    accessorKey: "name_en",
    size: 180,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Phone",
    accessorKey: "phone_number",
    size: 150,
  },
  {
    header: "Nationality",
    accessorKey: "nationality",
    size: 120,
  },
  {
    header: "Details",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        <Link href={`participants/${row.original.id}`}>View Details</Link>
        <ChevronRight />
      </Button>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <ParticipantRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function ParticipantRowActions({ rowData }: { rowData: Participant }) {
  const [updateParticipant] = useUpdateParticipantMutation();
  const [deleteParticipant] = useDeleteParticipantMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getParticipantsFields(rowData)}
      validationSchema={participantValidationSchema}
      updateMutation={updateParticipant}
      deleteMutation={deleteParticipant}
      onUpdateSuccess={(result) => console.log("Participant updated:", result)}
      onUpdateError={(error) => console.error("Update error:", error)}
      onDeleteSuccess={(result) => console.log("Participant deleted:", result)}
      onDeleteError={(error) => console.error("Delete error:", error)}
    />
  );
}
