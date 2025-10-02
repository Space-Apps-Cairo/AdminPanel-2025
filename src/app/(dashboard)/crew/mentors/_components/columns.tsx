import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Mentor, CreateMentorRequest } from "@/types/crew/mentors";
import {
  useDeleteMentorMutation,
  useUpdateMentorMutation,
} from "@/service/Api/crew/mentors";
import { mentorValidationSchema } from "@/validations/crew/mentors";

export const getMentorFields = (m?: Mentor): Field[] => [
  { 
    name: "name", 
    type: "text", 
    label: "Name", 
    ...(m?.name && { defaultValue: m.name }), 
    step: 1,
    placeholder: "Enter full name"
  },
  { 
    name: "email", 
    type: "text", 
    label: "Email", 
    ...(m?.email && { defaultValue: m.email }), 
    step: 1,
    placeholder: "Enter email address"
  },
  { 
    name: "phone_number", 
    type: "text", 
    label: "Phone Number", 
    ...(m?.phone_number && { defaultValue: m.phone_number }), 
    step: 1,
    placeholder: "Enter phone number"
  },
  { 
    name: "job_title", 
    type: "text", 
    label: "Job Title", 
    ...(m?.jobTitle && { defaultValue: m.jobTitle }), 
    step: 1,
    placeholder: "Enter job title"
  },
  { 
    name: "organization", 
    type: "text", 
    label: "Organization", 
    ...(m?.organization && { defaultValue: m.organization }), 
    step: 1,
    placeholder: "Enter organization"
  },
  { 
    name: "level_of_experience", 
    type: "text", 
    label: "Level of Experience", 
    ...(m?.level_of_experience && { defaultValue: m.level_of_experience }), 
    step: 1,
    placeholder: "e.g., Junior, Mid, Senior"
  },
  { 
    name: "area_of_expertise", 
    type: "text", 
    label: "Area of Expertise", 
    ...(m?.area_of_expertise && { defaultValue: m.area_of_expertise }), 
    step: 1,
    placeholder: "e.g., AI, Data, Aerospace"
  },
  { 
    name: "tshirt_size", 
    type: "text", 
    label: "T-Shirt Size", 
    ...(m?.tshirt_size && { defaultValue: m.tshirt_size }), 
    step: 1,
    placeholder: "e.g., S, M, L, XL"
  },
  { 
    name: "linkedin_profile_url", 
    type: "text", 
    label: "LinkedIn URL", 
    ...(m?.linkedin_profile_url && { defaultValue: m.linkedin_profile_url }), 
    step: 2,
    placeholder: "https://www.linkedin.com/in/username"
  },
  { 
    name: "space_apps_year", 
    type: "text", 
    label: "Space Apps Year", 
    ...(m?.space_apps_year && { defaultValue: m.space_apps_year }), 
    step: 2,
    placeholder: "e.g., 2023"
  },
  { 
    name: "brief_professional_bio", 
    type: "textArea", 
    label: "Brief Bio", 
    ...(m?.brief_professional_bio && { defaultValue: m.brief_professional_bio }), 
    step: 2,
    placeholder: "Write a short professional bio"
  },
  { 
    name: "timing_concerns", 
    type: "textArea", 
    label: "Timing Concerns", 
    ...(m?.timing_concerns && { defaultValue: m.timing_concerns }), 
    step: 2,
    placeholder: "Share any availability concerns"
  },
  { 
    name: "additional_comments", 
    type: "textArea", 
    label: "Additional Comments", 
    ...(m?.additional_comments && { defaultValue: m.additional_comments }), 
    step: 2,
    placeholder: "Add any extra notes"
  },
  { 
    name: "personal_photo_path", 
    type: "text", 
    label: "Photo Path", 
    ...(m?.personal_photo_path && { defaultValue: m.personal_photo_path }), 
    step: 2,
    placeholder: "Enter photo file path or URL"
  },
  { 
    name: "national_id_front_path", 
    type: "text", 
    label: "National ID Front", 
    ...(m?.national_id_front_path && { defaultValue: m.national_id_front_path }), 
    step: 2,
    placeholder: "Enter front side file path or URL"
  },
  { 
    name: "national_id_back_path", 
    type: "text", 
    label: "National ID Back", 
    ...(m?.national_id_back_path && { defaultValue: m.national_id_back_path }), 
    step: 2,
    placeholder: "Enter back side file path or URL"
  },
  { 
    name: "was_part_of_nasa_space_apps", 
    type: "select", 
    label: "Was Part of NASA Space Apps?", 
    options: [
        { value: "true", label: "Yes" }, 
        { value: "false", label: "No" }
    ], 
    ...(m && { defaultValue: String(Boolean(m.was_part_of_nasa_space_apps)) }), 
    step: 3,
    placeholder: "Select an option"
  },
  { 
    name: "available_for_full_support", 
    type: "select", 
    label: "Available for Full Support", 
    options: [
        { value: "true", label: "Yes" }, 
        { value: "false", label: "No" }
    ], 
    ...(m && { defaultValue: String(Boolean(m.available_for_full_support)) }), 
    step: 3,
    placeholder: "Select availability"
  },
  { 
    name: "available_during_hackathon_all_times", 
    type: "select", 
    label: "Available During All Times", 
    options: [
        { value: "true", label: "Yes" }, 
        { value: "false", label: "No" }
    ], 
    ...(m && { defaultValue: String(Boolean(m.available_during_hackathon_all_times)) }), 
    step: 3,
    placeholder: "Select availability"
  },
  { 
    name: "willing_to_stay_overnight", 
    type: "select", 
    label: "Willing to Stay Overnight", 
    options: [
        { value: "true", label: "Yes" }, 
        { value: "false", label: "No" }
    ], 
    ...(m && { defaultValue: String(Boolean(m.willing_to_stay_overnight)) }), 
    step: 3,
    placeholder: "Select preference"
  },
];

export const mentorColumns: ColumnDef<Mentor>[] = [
  { header: "UUID", accessorKey: "uuid", size: 100, enableHiding: false },
  { header: "Name", accessorKey: "name", size: 200, enableHiding: false },
  { header: "Email", accessorKey: "email", size: 220 },
  { header: "Phone", accessorKey: "phone_number", size: 180 },
  { header: "Job Title", accessorKey: "jobTitle", size: 200 },
  { header: "Organization", accessorKey: "organization", size: 220 },
//   { header: "Experience", accessorKey: "level_of_experience", size: 160 },
  { header: "Expertise", accessorKey: "area_of_expertise", size: 180 },
  { header: "T-Shirt", accessorKey: "tshirt_size", size: 120 },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <MentorRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function MentorRowActions({ rowData }: { rowData: Mentor }) {
  const [updateMentor] = useUpdateMentorMutation();
  const [deleteMentor] = useDeleteMentorMutation();

  const coerceBoolean = (v: any) =>
    typeof v === "string" ? (v === "true" ? true : v === "false" ? false : v) : v;

  const normalizeMentorPayload = (data: CreateMentorRequest): CreateMentorRequest => ({
    ...data,
    was_part_of_nasa_space_apps: coerceBoolean(data?.was_part_of_nasa_space_apps),
    available_for_full_support: coerceBoolean(data?.available_for_full_support),
    available_during_hackathon_all_times: coerceBoolean(data?.available_during_hackathon_all_times),
    willing_to_stay_overnight: coerceBoolean(data?.willing_to_stay_overnight),
  });

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      steps={[1, 2, 3]}
      fields={getMentorFields(rowData)}
      validationSchema={mentorValidationSchema}
      updateMutation={(data: CreateMentorRequest) =>
        updateMentor({ id: rowData.id, data: normalizeMentorPayload(data) }).unwrap()
      }
      deleteMutation={deleteMentor}
      onUpdateSuccess={(result) => {
        toast.success(result?.message || "Mentor updated successfully!");
      }}
      onUpdateError={(error) => {
        toast.error(error?.data?.message || "Failed to update mentor");
      }}
      onDeleteSuccess={(result) => {
        toast.success(result?.message || "Mentor deleted successfully!");
      }}
      onDeleteError={(error) => {
        toast.error(error?.data?.message || "Failed to delete mentor");
      }}
    />
  );
}