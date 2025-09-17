"use client";
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import { Field, FieldOption } from "@/app/interface";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { any } from "zod";
import { EmailTemplate } from "@/types/emails/templates";
import { Badge } from "@/components/ui/badge";

import CrudForm from "@/components/crud-form";
import { useState } from "react";
import { sendEmailSchema } from "@/validations/emails/templates";
import {
  useDeleteEmailTemplateMutation,
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
} from "@/service/Api/emails/templates";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { withDefault } from "../../participants/_components/coulmns";

export const EmailColumns: ColumnDef<EmailTemplate>[] = [
  { header: "ID", accessorKey: "id", size: 80, enableHiding: false },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => <Badge>{row.getValue("type")}</Badge>,
  },

  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <EmailRowActions rowData={row.original} />,
  },
];

function EmailRowActions({ rowData }: { rowData: EmailTemplate }) {
  const router = useRouter();
  const [deleteTemplate] = useDeleteEmailTemplateMutation();

  const [isOpen, setIsOpen] = useState(false);
  const fields: Field[] = [
    {
      name: "template_id",
      type: "select",
      label: "Selected Template",
      disabled: true,
      options: [{ label: rowData.title, value: rowData.id.toString() }],
      ...(rowData?.id.toString() && { defaultValue: rowData.id.toString() }),
    },
    {
      name: "email",
      type: "email",
      label: "Enter your testing email",
    },
  ];
  async function handleEmailSubmit(data) {
    try {
      const payload = {
        template_id: data.template_id,
        email: data.email,
      };
      // await sendEmail(payload).unwrap();
      toast.success("Email sended successfully");
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong on send Email");
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
      <RowsActions
        rowData={rowData}
        isDelete={true}
        validationSchema={any}
        isPreview={false}
        deleteMutation={deleteTemplate}
        customEditHandler={(row) => {
          console.log("Edit IdL", row.id);
          router.push(`/bootcamp/email-templates/${row.id}`);
        }}
        onDeleteSuccess={(result) =>
          toast.success("Email deleted successfully")
        }
        onDeleteError={(error) =>
          toast.error("Falid to delete email:", error?.data?.message)
        }
      />
    </div>
  );
}
