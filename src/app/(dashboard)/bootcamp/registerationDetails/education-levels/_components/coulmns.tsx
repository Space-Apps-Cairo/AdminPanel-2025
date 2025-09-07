import { ColumnDef } from "@tanstack/react-table";
import { EducationLevelType } from "@/types/educationLevel";
import RowsActions from "../../../../../../components/table/rows-actions";
import { Field } from "@/app/interface";
import { EducationLevelSchema } from "@/validations/education-level";
import {
  useDeleteEducationalLevelMutation,
  useUpdateEducationalLevelMutation,
} from "@/service/Api/educationalLevels";
import { toast } from "sonner";

export const getEducationLevelFields = (
  educationLevelData?: EducationLevelType
): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter education level name",
    ...(educationLevelData?.name && { defaultValue: educationLevelData.name }),
  },
];

export const educationLevelColumns: ColumnDef<EducationLevelType>[] = [
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
    cell: ({ row }) => <EducationLevelRowActions rowData={row.original} />,
  },
];

function EducationLevelRowActions({
  rowData,
}: {
  rowData: EducationLevelType;
}) {
  const [updateEducationLevel] = useUpdateEducationalLevelMutation();
  const [deleteEducationLevel] = useDeleteEducationalLevelMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getEducationLevelFields(rowData)}
      validationSchema={EducationLevelSchema}
      updateMutation={(data) => {
        const payload = {
          title: data.name,
        };
        updateEducationLevel({ data: payload, id: rowData.id });
      }}
      deleteMutation={deleteEducationLevel}
      onUpdateSuccess={() =>
        toast.success("Education level updated successfully")
      }
      onUpdateError={(error) =>
        toast.error("Failed to update education level:", error?.data?.message)
      }
      onDeleteSuccess={() =>
        toast.success("Education level deleted successfully")
      }
      onDeleteError={(error) =>
        toast.error("Failed to delete education level:", error?.data?.message)
      }
    />
  );
}
