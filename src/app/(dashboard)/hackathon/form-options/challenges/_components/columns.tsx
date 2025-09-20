"use client";
import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteChallengeMutation,
  useUpdateChallengeMutation,
} from "@/service/Api/challenges";
import { Challenge, CreateChallengeRequest } from "@/types/challenges";
import { challengeValidationSchema } from "@/validations/challenges";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const getChallengeFields = (
  challengeData?: Challenge,
): Field[] => [
  {
    name: "title",
    type: "text",
    label: "Challenge Title",
    placeholder: "Enter challenge title",
    ...(challengeData?.title && {
      defaultValue: challengeData.title,
    }),
    step: 1,
  },
  {
    name: "description",
    type: "textArea",
    label: "Description",
    placeholder: "Enter challenge description",
    ...(challengeData?.description && {
      defaultValue: challengeData.description,
    }),
    step: 1,
  },
  {
    name: "difficulty_level_id",
    type: "select",
    label: "Difficulty Level",
    placeholder: "Select difficulty level",
    options: [
      { value: "1", label: "Easy" },
      { value: "2", label: "Medium" },
      { value: "3", label: "Hard" },
    ],
    ...(challengeData?.difficulty_level && {
      defaultValue: challengeData.difficulty_level.id.toString(),
    }),
    step: 1,
  },
];

export const challengeColumns: ColumnDef<Challenge>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 50,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 220,
    enableHiding: false,
  },
  {
    header: "Difficulty Level",
    id: "difficulty_level_name",
    accessorKey: "difficulty_level.name",
    size: 150,
    cell: ({ row }) => {
        const difficultyLevel = row.original.difficulty_level;
        return (
            <Badge 
                variant={
                    difficultyLevel.name === "easy" ? "default" 
                    : difficultyLevel.name === "medium" ? "secondary" 
                    : "destructive"
                }
                className="capitalize px-2.5 py-1"
            >
                {difficultyLevel.name || "N/A"}
            </Badge>
        )
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 100,
    cell: ({ row }) => <ChallengeRowActions rowData={row.original} />,
  },
];

function ChallengeRowActions({ rowData }: { rowData: Challenge }) {
  const [updateChallenge] = useUpdateChallengeMutation();
  const [deleteChallenge] = useDeleteChallengeMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getChallengeFields(rowData)}
      validationSchema={challengeValidationSchema}
      updateMutation={(data: CreateChallengeRequest) =>
        updateChallenge({ 
          id: rowData.id, 
          data: {
            title: data.title,
            description: data.description,
            difficulty_level_id: data.difficulty_level_id ? Number(data.difficulty_level_id) : undefined,
          }
        })
      }
      deleteMutation={deleteChallenge}
      onUpdateSuccess={(result) => {
        console.log("Challenge updated successfully:", result);
        toast.success(result.message || "Challenge updated successfully!");
      }}
      onUpdateError={(error) => {
        console.error("Error updating challenge:", error);
        toast.error(
          error.data?.message || "Failed to update challenge. Please try again."
        );
      }}
      onDeleteSuccess={(result) => {
        console.log("Challenge deleted successfully:", result);
        toast.success(result.message || "Challenge deleted successfully!");
      }}
      onDeleteError={(error) => {
        console.error("Error deleting challenge:", error);
        toast.error(
          error.data?.message || "Failed to delete challenge. Please try again."
        );
      }}
    />
  );
}