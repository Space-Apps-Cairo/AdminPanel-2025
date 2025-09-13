import { Field, FieldOption } from "@/app/interface";
import { ParticipantPreference, ParticipantPreferenceRequest } from "@/types/preference";
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "../../../../../../../components/table/rows-actions";
import {
  useUpdatePreferenceMutation,
  useDeletePreferenceMutation,
  useGetPreferencesByParticipantQuery,
} from "@/service/Api/preferences";
import { ParticipantPreferenceSchema } from "@/validations/preference";
import { toast } from "sonner";

export const getPreferenceFields = (
  prefData?: ParticipantPreference,
  workshopOptions?: FieldOption[]
): Field[] => [
  {
    name: "preference_order",
    type: "number",
    label: "Preference Order",
    placeholder: "Enter preference order",
    defaultValue: prefData?.preference_order ?? undefined,
  },
  {
    name: "workshop_id",
    type: "select",
    label: "Workshop ",
    placeholder: "Enter workshop ",

    options: workshopOptions ?? [],
    ...(prefData?.workshop && {
      defaultValue: prefData.workshop.id.toString(),
    }),
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
  },
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

 ;


  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getPreferenceFields(rowData, workshopOptions)}
      validationSchema={ParticipantPreferenceSchema}
    updateMutation={(data: ParticipantPreference) => {
        const formattedData = {
          bootcamp_participant_id: String(data.participant.id),
    workshop_id: data.workshop ? String(data.workshop.id) : "",
    preference_order: String(data.preference_order),
        };
        return updatePreference({
          id: rowData.id, 
          data: formattedData ,
        });
      }}

      deleteMutation={deletePreference}
       onUpdateSuccess={(result) => {
            toast.success(
              result.message || "Preferences updated successfully!"
            );
         
          }}
          onUpdateError={(error) => {
            toast.error(
              error.data?.message ||
                "Failed to update Preference. Please try again."
            );
         console.log(error.message)
          }}
          onDeleteSuccess={(result) => {
            toast.success(
              result.message || "Preferences deleted successfully!"
            );
          }}
          onDeleteError={(error) => {
            toast.error(
              error.data?.message ||
                "Failed to delete Preference. Please try again."
            );
          }}
    />
  );
}
