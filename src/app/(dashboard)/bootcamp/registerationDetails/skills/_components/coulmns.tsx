import { ColumnDef } from "@tanstack/react-table";
import { Skill } from "@/types/skill";
import RowsActions from "../../../../../../components/table/rows-actions";
import { Field } from "@/app/interface";
import { SkillSchema } from "@/validations/skill";
import {
  useDeleteSkillMutation,
  useUpdateSkillMutation,
} from "@/service/Api/skills";
import { toast } from "sonner";

export const getSkillFields = (skillData?: Skill): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter skill name",
    ...(skillData?.name && { defaultValue: skillData.name }),
  },
  {
    name: "type",
    type: "select",
    label: "Type",
    placeholder: "Enter skill type",
    options: [
      { label: "non-technical", value: "non-technical" },
      { label: "technical", value: "technical" },
    ],
    ...(skillData?.type && { defaultValue: skillData.type }),
  },
];

export const skillColumns: ColumnDef<Skill>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <SkillRowActions rowData={row.original} />,
  },
];

function SkillRowActions({ rowData }: { rowData: Skill }) {
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getSkillFields(rowData)}
      validationSchema={SkillSchema}
      updateMutation={(data) => updateSkill({ id: rowData.id, data })}
      deleteMutation={deleteSkill}
      onUpdateSuccess={() => toast.success("Skill updated successfully")}
      onUpdateError={(error) =>
        toast.error("Failed to update skill:", error?.data?.message)
      }
      onDeleteSuccess={() => toast.success("Skill deleted successfully")}
      onDeleteError={(error) =>
        toast.error("Failed to delete skill:", error?.data?.message)
      }
    />
  );
}
