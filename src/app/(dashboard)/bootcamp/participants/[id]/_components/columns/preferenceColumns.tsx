import { Field, FieldOption } from "@/app/interface";
import { ParticipantPreference } from "@/types/preference";
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import {
  useUpdatePreferenceMutation,
  useDeletePreferenceMutation,
} from "@/service/Api/preferences";
import { ParticipantPreferenceSchema } from "@/validations/preference";

export const getPreferenceFields = (
 prefData?: ParticipantPreference,
workshopOptions?: FieldOption[]
): Field[] => [
  {
    name: "preference_order",
    type: "number",
    label: "Preference Order",
     placeholder: "Enter preference order",
  defaultValue: prefData?.preference_order?? undefined,
},
{
    name: "workshop_id",
    type: "select", 
    label: "Workshop ID",
    placeholder: "Enter workshop ID",
   
    options: workshopOptions ?? [],
  ...(prefData?.workshop && { defaultValue: prefData.workshop.id.toString() }),
},


];
 
export const preferenceColumns = (
  workshopOptions: FieldOption[]
): ColumnDef<ParticipantPreference>[] => [
  {
    header: "Preference Order",
    accessorKey: "preference_order",
    size: 120,
  },
  {
    header: "Workshop Title",
    accessorFn: (row) => row.workshop?.title ?? "Not assigned",
    size: 200,
  },
{
  id: "actions",
  header: () => <span>Actions</span>,
  cell: ({ row }) => (
    <PreferenceRowActions
      rowData={row.original}
      workshopOptions={workshopOptions} 
    />
  ),
}
];

function PreferenceRowActions({
  rowData,
  workshopOptions,
}: {
  rowData: ParticipantPreference;
  workshopOptions?: FieldOption[];
}) {

  const [updatePreference] = useUpdatePreferenceMutation();
  const [deletePreference] = useDeletePreferenceMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getPreferenceFields(rowData,workshopOptions)}
      validationSchema={ParticipantPreferenceSchema}
      updateMutation={updatePreference}
      deleteMutation={deletePreference}
      onUpdateSuccess={(result) => console.log("Preference updated:", result)}
      onUpdateError={(error) => console.error("Update error:", error)}
      onDeleteSuccess={(result) => console.log("Preference deleted:", result)}
      onDeleteError={(error) => console.error("Delete error:", error)}
    />
  );
}
