import { Field, FieldOption } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteVolunteerMutation, useUpdateVolunteerMutation } from "@/service/Api/material/materials";
import { Volunteer } from "@/types/material/materials";
import { volunteerValidationSchema } from "@/validations/material/volunteer";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from 'sonner';
import {
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
} from "@/service/Api/emails/templates";
import {
  sendEmailSchema,
} from "@/validations/emails/templates";
import { useState } from "react";
import CrudForm from "@/components/crud-form";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
export const getVolunteerFields = (volunteerData?: Volunteer): Field[] => [

    {
        name: "full_name",
        type: "text",
        label: "Full Name",
        ...(volunteerData?.full_name && { defaultValue: volunteerData.full_name }),
        step: 1,
    },

    {
        name: "email",
        type: "text",
        label: "Email",
        ...(volunteerData?.email && { defaultValue: volunteerData.email }),
        step: 1,
    },

    {
        name: "phone",
        type: "text",
        label: "Phone",
        ...(volunteerData?.phone && { defaultValue: volunteerData.phone }),
        step: 1,
    },

    {
        name: "team",
        type: "text",
        label: "Team",
        ...(volunteerData?.team && { defaultValue: volunteerData.team }),
        step: 1,
    },

    {
        name: "volunteering_year",
        type: "number",
        label: "Volunteering year",
        ...(volunteerData?.volunteering_year && { defaultValue: volunteerData.volunteering_year }),
        step: 1,
    },

];

export const volunteerColumns: ColumnDef<Volunteer>[] = [
    {
        header: "Name",
        accessorKey: "full_name",
        size: 180,
        enableHiding: false,
    },
    {
        header: "Email",
        accessorKey: "email",
        size: 220,
        enableHiding: false,
    },
    {
        header: "Phone",
        accessorKey: "phone",
        size: 180,
        enableHiding: false,
    },
    {
        header: "Team",
        accessorKey: "team",
        size: 180,
    },
    {
        header: "Year of joining",
        accessorKey: "volunteering_year",
        size: 180,
    },
    {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <VolunteerRowActions rowData={row.original} />
        ),
        size: 150,
        enableHiding: false,
    },
];

function VolunteerRowActions({ rowData }: { rowData: Volunteer }) {
    const [updateVolunteer] = useUpdateVolunteerMutation();
    const [deleteVolunteer] = useDeleteVolunteerMutation();
  const [sendEmail] = useSendEmailsMutation();
  const { data, isLoading } = useGetEmailTemplatesQuery();
  const templateOptions: FieldOption[] =
      data?.data?.map((template) => ({
        value: template.id.toString(),
        label: template.title, 
      })) ?? [];
  
    const [isOpen, setIsOpen] = useState(false);

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
      options: [{ value: rowData.id.toString(), label: rowData.full_name }],
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
            isUpdate={true}
            isPreview={false}
            fields={getVolunteerFields(rowData)}
            validationSchema={volunteerValidationSchema}
            updateMutation={(data: Volunteer) => updateVolunteer({ id: rowData.id, data })}
            deleteMutation={deleteVolunteer}
            onUpdateSuccess={(result) => {
                console.log('Volunteer updated successfully:', result);
                toast.success(result.msg || "Volunteer updated successfully!");
            }}
            onUpdateError={(error) => {
                console.error('Error updating volunteer:', error);
                toast.error(error.data?.msg || "Failed to update volunteer. Please try again.");
            }}
            onDeleteSuccess={(result) => {
                console.log('Volunteer deleted successfully:', result);
                toast.success(result.msg || "Volunteer deleted successfully!");
            }}
            onDeleteError={(error) => {
                console.error('Error deleting volunteer:', error);
                toast.error(error.data?.msg || "Failed to delete volunteer. Please try again.");
            }}
        />
        </div>
    );
}