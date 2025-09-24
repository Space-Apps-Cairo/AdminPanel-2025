import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { ChevronRight, Mail, UserPlus } from "lucide-react";
import RowsActions from "../../../../../components/table/rows-actions";
import {
  useDeleteParticipantMutation,
  useUpdateParticipantMutation,
} from "@/service/Api/participants";
import { Participant } from "@/types/participants";
import { Field, FieldOption } from "@/app/interface";
import { participantValidationSchema } from "@/validations/participantSchema";
import { toast } from "sonner";
import CrudForm from "@/components/crud-form";
import { useState } from "react";
import {
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
} from "@/service/Api/emails/templates";
import {
  sendEmailSchema,
} from "@/validations/emails/templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetBootcampsQuery,
  useRegisterBootcampAttendeeMutation,
} from "@/service/Api/bootcamp";
import { useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";

//  helper موحد لإضافة defaultValue
export const withDefault = (value?: Field["defaultValue"]): Partial<Field> =>
  value !== undefined && value !== null ? { defaultValue: value } : {};

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
    ...withDefault(participantData?.name_ar),
    placeholder: "Enter your name in Arabic",
    step: 1,
  },
  {
    name: "name_en",
    type: "text",
    label: "English Name",
    ...withDefault(participantData?.name_en),
    placeholder: "Enter your name in English",
    step: 1,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    ...withDefault(participantData?.email),
    placeholder: "Enter your email (example@gmail.com)",
    step: 1,
  },
  {
    name: "phone_number",
    type: "text",
    label: "Phone Number",
    ...withDefault(participantData?.phone_number),
    placeholder: "Enter your phone number",
    step: 1,
  },
  {
    name: "national_id",
    type: "number",
    label: "National ID",
    ...withDefault(participantData?.national_id),
    placeholder: "Enter your national ID number",
    step: 1,
  },
  {
    name: "nationality",
    type: "text",
    label: "Nationality",
    ...withDefault(participantData?.nationality),
    placeholder: "Enter your nationality ",
    step: 1,
  },
  {
    name: "birth_date",
    type: "date",
    label: "Birth Date",
    ...withDefault(participantData?.birth_date),
    placeholder: "Select your birth date",
    step: 2,
  },
  {
    name: "governorate",
    type: "text",
    label: "Governorate",
    ...withDefault(participantData?.governorate),
    placeholder: "Enter your governorate",
    step: 2,
  },
  {
    name: "current_occupation",
    type: "text",
    label: "Current Occupation",
    ...withDefault(participantData?.current_occupation),
    placeholder: "Enter your current occupation",
    step: 2,
  },
  {
    name: "educational_level_id",
    type: "select",
    label: "Educational Level",
    options: educationalLevelOptions ?? [],
    ...withDefault(participantData?.educational_level_id),
    placeholder: "Select your educational level",
    step: 2,
  },
  {
    name: "educational_institute",
    type: "text",
    label: "Educational Institute",
    ...withDefault(participantData?.educational_institute),
    placeholder: "Enter your educational institute",
    step: 2,
  },
  {
    name: "first_priority_id",
    type: "select",
    label: "First Priority Workshop",
    options: workshopOptions ?? [],
    ...withDefault(participantData?.first_priority_id),
    placeholder: "Select first priority workshop",
    step: 3,
  },
  {
    name: "second_priority_id",
    type: "select",
    label: "Second Priority Workshop",
    options: workshopOptions ?? [],
    ...withDefault(participantData?.second_priority_id),
    placeholder: "Select second priority workshop",
    step: 3,
  },
  {
    name: "third_priority_id",
    type: "select",
    label: "Third Priority Workshop",
    options: workshopOptions ?? [],
    ...withDefault(participantData?.third_priority_id),
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
    ...withDefault(participantData?.is_have_team),
    placeholder: "Select your team status",
    step: 3,
  },
  {
    name: "participation_status",
    type: "select",
    label: "Participation Status",
    options: [
      { value: "ex_participant", label: "Ex Participant" },
      { value: "ex_volunteer", label: "Ex Volunteer" },
      { value: "first_time", label: "First Time" },
    ],
    ...withDefault(participantData?.participation_status),
    placeholder: "Select your participation status",
    step: 3,
  },
  {
    name: "why_this_workshop",
    type: "text",
    label: "Reason for Workshop",
    ...withDefault(participantData?.why_this_workshop),
    placeholder: "Why do you want this workshop?",
    step: 3,
  },
  {
    name: "year",
    type: "number",
    label: "Year",
    ...withDefault(participantData?.year),
    placeholder: "Enter year",
    step: 3,
  },
  {
    name: "graduation_year",
    type: "number",
    label: "Graduation Year",
    ...withDefault(participantData?.graduation_year),
    placeholder: "Enter your graduation year",
    step: 4,
  },
  {
    name: "field_of_study_id",
    type: "select",
    label: "Field of Study",
    options: fieldOfStudyOptions ?? [],
    ...withDefault(participantData?.field_of_study_id),
    placeholder: "Select your field of study",
    step: 4,
  },
  {
    name: "skills",
    type: "select",
    label: "Skills",
    options: skillsOptions ?? [],
    ...withDefault(participantData?.skills?.map((s) => s.id)),
    placeholder: "Select skills",
    step: 4,
  },
  {
    name: "comment",
    type: "text",
    label: "Comment",
    ...withDefault(participantData?.comment),
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
  { header: "UUID", accessorKey: "uuid", size: 80, enableHiding: false },
  // { header: "English Name", accessorKey: "name_en", size: 180 },
  {
    header: "English Name",
    accessorKey: "name_en",
    cell: ({ row }) => (
      <div className="break-all">{row.getValue("name_en")}</div>
    ),
    size: 180,
  },
  {
    header: "Arabic Name",
    accessorKey: "name_ar",
    cell: ({ row }) => (
      <div className="break-all">{row.getValue("name_ar")}</div>
    ),
    size: 180,
  },
  { header: "Email", accessorKey: "email", size: 300 },
  { header: "Phone", accessorKey: "phone_number" },
  { header: "National ID", accessorKey: "national_id" },
  { header: "Governorate", accessorKey: "governorate", enableHiding: false },
  { header: "Birth Date", accessorKey: "birth_date" },
  { header: "Created At", accessorKey: "created_at" },
  { header: "Institute", accessorKey: "educational_institute", size: 180 },
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
    header: "Occupation",
    accessorKey: "current_occupation",
    enableHiding: true,
  },
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
    size: 270,
    enableHiding: false,
  },
];

function ParticipantRowActions({ rowData }: { rowData: Participant }) {
  const [updateParticipant] = useUpdateParticipantMutation();
  const [deleteParticipant] = useDeleteParticipantMutation();
  const [sendEmail] = useSendEmailsMutation();
  const { data, isLoading } = useGetEmailTemplatesQuery();

  // Registration mutations and queries
  const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
  const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();
  const { data: bootcampsData } = useGetBootcampsQuery();

  const templateOptions: FieldOption[] =
    data?.data?.map((template) => ({
      value: template.id.toString(),
      label: template.title, // or subject if you prefer
    })) ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);

  const fields: Field[] = [
    {
      name: "template_id",
      type: "select",
      label: "Select Template",
      options: templateOptions,
      placeholder: isLoading ? "Loading templates..." : "Choose a template",
    },
    {
      name: "ids",
      type: "select",
      label: "Select Participants",
      //  Example: single participant
      options: [{ value: rowData.id.toString(), label: rowData.name_en }],
      defaultValue: rowData.id.toString(),
    },
  ];
//
  async function handleEmailSubmit(data) {
    try {
      const payload = {
        template_id: data.template_id,
        ids: [rowData.id],
      };
      await sendEmail(payload).unwrap();
      toast.success("Email sended successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong on send Email");
    }
  }

  async function handleBootcampRegistration() {
    try {
      if (!bootcampsData?.data || bootcampsData.data.length === 0) {
        toast.error("No bootcamps available");
        return;
      }

      const firstBootcamp = bootcampsData.data[0];
      await registerBootcampAttendee({
        bootcamp_details_id: Number(firstBootcamp.id),
        bootcamp_participant_uuid: rowData.uuid,
        category: "1",
        attendance_status: "attended",
      }).unwrap();
      
      toast.success("Bootcamp registration successful", {
        description: "Participant has been registered for the bootcamp.",
      });
      setIsRegistrationDialogOpen(false);
    } catch (err: any) {
      const errorMessage = err?.data?.msg || err?.data?.message || "Registration failed";
      toast.error("Bootcamp Registration Failed", {
        description: errorMessage,
      });
    }
  }

  async function handleWorkshopRegistration() {
    try {
      await checkInWorkshopParticipant({
        bootcamp_participant_uuid: rowData.uuid,
      }).unwrap();
      
      toast.success("Workshop registration successful", {
        description: "Participant has been registered for the workshop.",
      });
      setIsRegistrationDialogOpen(false);
    } catch (err: any) {
      const errorMessage = err?.data?.msg || err?.data?.message || "Registration failed";
      toast.error("Workshop Registration Failed", {
        description: errorMessage,
      });
    }
  }

  return (
    <div className="flex items-center gap-3">
      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={sendEmailSchema}
          onSubmit={handleEmailSubmit}
        />
      )}
      
      <Button variant={"outline"} size={"sm"} onClick={() => setIsOpen(true)}>
        <Mail />
      </Button>

      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <UserPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registration Options</DialogTitle>
            <DialogDescription>
              Choose the registration type for {rowData.name_en}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Button 
              onClick={handleBootcampRegistration}
              className="w-full"
            >
              Bootcamp Registration
            </Button>
            <Button 
              onClick={handleWorkshopRegistration}
              variant={"outline"}
              className="w-full"
            >
              Workshop Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RowsActions
        rowData={rowData}
        isDelete={true}
        fields={getParticipantsFields(rowData)}
        validationSchema={participantValidationSchema}
        updateMutation={updateParticipant}
        deleteMutation={deleteParticipant}
        onUpdateSuccess={() =>
          toast.success("Participant updated successfully")
        }
        onUpdateError={(error) =>
          toast.error("Failed to update participant", {
            description: error?.data?.message,
          })
        }
        onDeleteSuccess={() =>
          toast.success("Participant deleted successfully")
        }
        onDeleteError={(error) =>
          toast.error("Failed to delete participant", {
            description: error?.data?.message,
          })
        }
        steps={[1, 2, 3]}
        
      />
    </div>
  );
}
