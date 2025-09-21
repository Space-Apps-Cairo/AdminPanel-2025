// src/app/(dashboard)/Hackathon-management/formOptions/member-roles/_components/fields.ts
import type { Field } from "@/app/interface";
import type { MemberRole } from "@/types/hackathon/memberRoles";

export const getMemberRoleFields = (role?: MemberRole): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Role Name",
    placeholder: "Enter role name",
    defaultValue: role?.name ?? "",
    step: 1,
  },
  {
    name: "description",
    type: "textArea",
    label: "Description",
    placeholder: "Optional description",
    defaultValue: role?.description ?? "",
    step: 1,
  },
];
