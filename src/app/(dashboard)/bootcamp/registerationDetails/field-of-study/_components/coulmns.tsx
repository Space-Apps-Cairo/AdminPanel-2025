import { ColumnDef } from "@tanstack/react-table";
import { FieldOfStudyType } from "@/types/fieldOfStudy";
import RowsActions from "../../../../../../components/table/rows-actions";
import { Field } from "@/app/interface";
import { FieldOfStudySchema } from "@/validations/field-of-study";
import {
  useDeleteFieldOfStudyMutation,
  useUpdateFieldOfStudyMutation,
} from "@/service/Api/fieldsOfStudy";
import { toast } from "sonner";

export const getFieldOfStudyFields = (
  fieldOfStudyData?: FieldOfStudyType
): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter field of study name",
    ...(fieldOfStudyData?.name && { defaultValue: fieldOfStudyData.name }),
  },
];

export const fieldOfStudyColumns: ColumnDef<FieldOfStudyType>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <FieldOfStudyRowActions rowData={row.original} />,
  },
];

function FieldOfStudyRowActions({ rowData }: { rowData: FieldOfStudyType }) {
  const [updateFieldOfStudy] = useUpdateFieldOfStudyMutation();
  const [deleteFieldOfStudy] = useDeleteFieldOfStudyMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getFieldOfStudyFields(rowData)}
      validationSchema={FieldOfStudySchema}
      updateMutation={(data) =>
        updateFieldOfStudy({ data: { title: data.name }, id: rowData.id })
      }
      deleteMutation={deleteFieldOfStudy}
      onUpdateSuccess={() =>
        toast.success("Field of study updated successfully")
      }
      onUpdateError={(error) =>
        toast.error("Failed to update field of study:", error?.data?.message)
      }
      onDeleteSuccess={() =>
        toast.success("Field of study deleted successfully")
      }
      onDeleteError={(error) =>
        toast.error("Failed to delete field of study:", error?.data?.message)
      }
    />
  );
}
