// src/app/(dashboard)/Hackathon-management/formOptions/actual-solutions/_components/fields.ts
import { Field } from "@/app/interface";

export const actualSolutionFields: Field[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter solution title",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textArea",
    placeholder: "Write a short description (optional)",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
    ],
    placeholder: "Select status",
  },
];
