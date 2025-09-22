
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import { StudyLevel } from "@/types/hackthon/form-options/studyLevels";
import { studyLevelValidationSchema } from "@/validations/hackthon/form-options/studylevel"
import {
  useDeleteStudtyLevelMutation,
  useUpdateStudyLevelMutation,
} from "@/service/Api/hackthon/form-options/studyLevel";
import { toast } from "sonner";
import { Field } from "@/app/interface";

export const getStudyLevelFields = (studyLevel?: StudyLevel): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter study level title",
    ...(studyLevel?.title && { defaultValue: studyLevel.title }),
    step: 1,
  },
  {
    name: "extra_field",
    type: "text",
    label: "Extra Field",
    placeholder: "Enter extra field (e.g., Basic education)",
    ...(studyLevel?.extra_field && { defaultValue: studyLevel.extra_field }),
    step: 1,
  },
  {
    name: "description",
    type: "text",
    label: "Description",
    placeholder: "Enter study level description",
    ...(studyLevel?.description && { defaultValue: studyLevel.description }),
    step: 2,
  },
];

export const studyLevelColumns: ColumnDef<StudyLevel>[] = [
  {
    header: "Title",
    accessorKey: "title",
    size: 200,
    enableHiding: false,
  },
  {
    header: "Extra Field",
    accessorKey: "extra_field",
    size: 250,
    enableHiding: false,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 400,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    size: 150,
    enableHiding: false,
    cell: ({ row }) => <StudyLevelRowActions rowData={row.original} />,
  },
];

function StudyLevelRowActions({ rowData }: { rowData: StudyLevel }) {
  const [updateStudyLevel] = useUpdateStudyLevelMutation();
  const [deleteStudyLevel] = useDeleteStudtyLevelMutation();

  return (
    <div className="flex items-center gap-2">
      <RowsActions
        rowData={rowData}
        isDelete={true}
        isUpdate={true}
        isPreview={true}
        fields={getStudyLevelFields(rowData)}
        validationSchema={studyLevelValidationSchema}
        updateMutation={(data: StudyLevel) =>
          updateStudyLevel({ id: rowData.id, data })
        }
        deleteMutation={deleteStudyLevel}
        onUpdateSuccess={(result) => {
          toast.success(result.message || "Study Level updated successfully!");
        }}
        onUpdateError={(error) => {
          toast.error(
            error.data?.message ||
              "Failed to update Study Level. Please try again."
          );
        }}
        onDeleteSuccess={(result) => {
          toast.success(result.message || "Study Level deleted successfully!");
        }}
        onDeleteError={(error) => {
          toast.error(
            error.data?.message ||
              "Failed to delete Study Level. Please try again."
          );
        }}
      />
    </div>
  );
}
