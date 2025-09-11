import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RowsActions from "../../../../../components/table/rows-actions";
import {
  useDeleteParticipantMutation,
  useUpdateParticipantMutation,
} from "@/service/Api/participants";
import { Participant } from "@/types/participants";
import { Field, FieldOption } from "@/app/interface";
import { participantValidationSchema } from "@/validations/participantSchema";
import { toast } from "sonner";

//Fields --------------------
export const getParticipantsFields = (
  participantData?: Participant,
  educationalLevelOptions?: FieldOption[],
  fieldOfStudyOptions?: FieldOption[],
  skillsOptions?: FieldOption[],
  workshopOptions?: FieldOption[]
): Field[] => [
  {
    name: "name_ar",
    type: "text",
    label: "Arabic Name",
    ...(participantData?.name_ar && { defaultValue: participantData.name_ar }),
    placeholder: "Enter your name in Arabic",
    step: 1,
  },
  {
    name: "name_en",
    type: "text",
    label: "English Name",
    ...(participantData?.name_en && { defaultValue: participantData.name_en }),
    placeholder: "Enter your name in English",
    step: 1,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    ...(participantData?.email && { defaultValue: participantData.email }),
    placeholder: "Enter your email (example@gmail.com)",
    step: 1,
  },
  {
    name: "phone_number",
    type: "text",
    label: "Phone Number",
    ...(participantData?.phone_number && {
      defaultValue: participantData.phone_number,
    }),
    placeholder: "Enter your phone number",
    step: 1,
  },

  {
    name: "national_id",
    type: "number",
    label: "National ID",
    ...(participantData?.national_id && {
      defaultValue: participantData.national_id,
    }),
    placeholder: "Enter your national ID number",
    step: 1,
  },
  {
    name: "nationality",
    type: "text",
    label: "Nationality",
    ...(participantData?.nationality && {
      defaultValue: participantData.nationality,
    }),
    placeholder: "Enter your nationality ",
    step: 1,
  },
  {
    name: "birth_date",
    type: "date",
    label: "Birth Date",
    ...(participantData?.birth_date && {
      defaultValue: participantData.birth_date,
    }),
    placeholder: "Select your birth date",
    step: 2,
  },
  
  {
    name: "governorate",
    type: "text",
    label: "Governorate",
    ...(participantData?.governorate && {
      defaultValue: participantData.governorate,
    }),
    placeholder: "Enter your governorate",
    step: 2,
  },
  {
    name: "current_occupation",
    type: "text",
    label: "Current Occupation",
    ...(participantData?.current_occupation && {
      defaultValue: participantData.current_occupation,
    }),
    placeholder: "Enter your current occupation",
    step: 2,
  },
  {
    name: "educational_level_id",
    type: "select",
    label: "Educational Level",
    options: educationalLevelOptions ?? [],
    ...(participantData?.educational_level_id && {
      defaultValue: participantData.educational_level_id.toString(),
    }),
    placeholder: "Select your educational level",
    step: 2,
  },
  {
    name: "educational_institute",
    type: "text",
    label: "Educational Institute",
    ...(participantData?.educational_institute && {
      defaultValue: participantData.educational_institute,
    }),
    placeholder: "Enter your educational institute",
    step: 2,
  },
  
{
  name: "first_priority_id",
  type: "select",
  label: "First Priority Workshop",
  options: workshopOptions ?? [],
  ...(participantData?.first_priority_id && {
    defaultValue: participantData.first_priority_id.toString(),
  }),
  placeholder: "Select first priority workshop",
  step: 3,
},
{
  name: "second_priority_id",
  type: "select",
  label: "Second Priority Workshop",
  options: workshopOptions ?? [],
  ...(participantData?.second_priority_id && {
    defaultValue: participantData.second_priority_id.toString(),
  }),
  placeholder: "Select second priority workshop",
  step: 3,
},
{
  name: "third_priority_id",
  type: "select",
  label: "Third Priority Workshop",
  options: workshopOptions ?? [],
  ...(participantData?.third_priority_id && {
    defaultValue: participantData.third_priority_id.toString(),
  }),
  placeholder: "Select third priority workshop",
  step: 3,
},

  {
    name: "is_have_team",
    type: "select",
    label: "Team Status",
    options: [
      { value: "individual", label: "Individual" },
      { value: "team_not_complete", label: "Team Not Complete" },
      { value: "team_complete", label: "Team Complete" },
    ],
    ...(participantData?.is_have_team && {
      defaultValue: participantData.is_have_team,
    }),
    placeholder: "Select your team status",
    step: 3,
  },
{
  name: "participant_status",
  type: "select",
  label: "Participation Status",
  options: [
    { value: "ex_participant", label: "Ex Participant" },
    { value: "ex_volunteer", label: "Ex Volunteer" },
    { value: "first_time", label: "First Time" },
  ],
  ...(participantData?.participation_status && {
    defaultValue: participantData.participation_status,
  }),
  placeholder: "Select your participation status",
  step: 3,
},


  {
    name: "why_this_workshop",
    type: "text",
    label: "Reason for Workshop",
    ...(participantData?.why_this_workshop && {
      defaultValue: participantData.why_this_workshop,
    }),
    placeholder: "Why do you want this workshop?",
    step: 3,
  },
  {
    name: "year",
    type: "number",
    label: "Year",
    ...(participantData?.year && {
      defaultValue: participantData.year,
    }),
    placeholder: "Enter year",
    step: 3,
  },

  {
    name: "graduation_year",
    type: "number",
    label: "Graduation Year",
    ...(participantData?.graduation_year && {
      defaultValue: participantData.graduation_year,
    }),
    placeholder: "Enter your graduation year",
    step: 4,
  },
  {
    name: "field_of_study_id",
    type: "select",
    label: "Field of Study",
    options: fieldOfStudyOptions ?? [],
    ...(participantData?.field_of_study_id && {
      defaultValue: participantData.field_of_study_id.toString(),
    }),
    placeholder: "Select your field of study",
    step: 4,
  },
  {
    name: "skills",
    type: "select",
    label: "Skills",
    options: skillsOptions ?? [],
    ...(participantData?.skills && {
      defaultValue: participantData.skills.map((s) => s.id.toString()),
    }),
    placeholder: "Select skills",
    step: 4,
  },
  
  {
    name: "comment",
    type: "text",
    label: "Comment",
    ...(participantData?.comment && { defaultValue: participantData.comment }),
    placeholder: "Write any additional comments...",
    step: 4,
  },
  {
    name: "national_id_front",
    type: "file",
    label: "National ID Front",
    placeholder: "Upload the front side of your National ID",
    step: 4,
  },
  {
    name: "national_id_back",
    type: "file",
    label: "National ID Back",
    placeholder: "Upload the back side of your National ID",
    step: 4,
  },
  {
    name: "personal_photo",
    type: "file",
    label: "Personal Photo",
    placeholder: "Upload a recent personal photo",
    step: 4,
  },
];

// Columns --------------------
export const participantColumns: ColumnDef<Participant>[] = [
  { header: "ID", accessorKey: "id", size: 80, enableHiding: false },
  { header: "English Name", accessorKey: "name_en" },
  { header: "Arabic Name", accessorKey: "name_ar" },
  { header: "Email", accessorKey: "email", size: 300 },
  { header: "Phone", accessorKey: "phone_number" },
  { header: "National ID", accessorKey: "national_id" },
  { header: "Governorate", accessorKey: "governorate", enableHiding: false },
  { header: "Birth Date", accessorKey: "birth_date" },
  {
    header: "Occupation",
    accessorKey: "current_occupation",
    enableHiding: true,
  },
  { header: "Institute", accessorKey: "educational_institute" },
  {
    header: "Graduation Year",
    accessorKey: "graduation_year",
    enableHiding: true,
  },
  {
    header: "Field of Study",
    accessorKey: "field_of_study_id",
    enableHiding: true,
  },
  { header: "Team", accessorKey: "is_have_team" },
  {
    header: "Details",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        <Link href={`participants/${row.original.id}`}>View Details</Link>
        <ChevronRight />
      </Button>
    ),
    size: 140,
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
      onUpdateSuccess={() => toast.success("Participant updated successfully")}
      onUpdateError={(error) =>
        toast.error("Falid to update participant", {
          description: error?.data?.message,
        })
      }
      onDeleteSuccess={() => toast.success("Participant deleted successfully")}
      onDeleteError={(error) =>
        toast.error("Falid to delete participant", {
          description: error?.data?.message,
        })
      }
      steps={[1, 2, 3]}
    />
  );
}
