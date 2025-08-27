import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteVolunteerMutation, useUpdateVolunteerMutation } from "@/service/Api/materials";
import { Volunteer } from "@/types/materials";
import { volunteerValidationSchema } from "@/validations/volunteer";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from 'sonner';

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

    return (
        <RowsActions
            rowData={rowData}
            isDelete={true}
            isUpdate={true}
            isPreview={true}
            fields={getVolunteerFields(rowData)}
            validationSchema={volunteerValidationSchema}
            updateMutation={async (payload: { id: string | number; data: any }) => {
                console.log('Update payload:', payload);
                try {
                    const result = await updateVolunteer(payload).unwrap();
                    console.log('Update result:', result);
                    return result;
                } catch (error) {
                    console.error('Update error:', error);
                    throw error;
                }
            }}
            deleteMutation={async (id: string | number) => {
                console.log('Delete ID:', id);
                try {
                    const result = await deleteVolunteer(id).unwrap();
                    console.log('Delete result:', result);
                    return result;
                } catch (error) {
                    console.error('Delete error:', error);
                    throw error;
                }
            }}
            onUpdateSuccess={(result) => {
                console.log('Volunteer updated successfully:', result);
                toast.success(result.msg || "Volunteer updated successfully!");
            }}
            onUpdateError={(error) => {
                console.error('Error updating volunteer:', error);
                toast.error(error.data.msg || "Failed to update volunteer. Please try again.");
            }}
            onDeleteSuccess={(result) => {
                console.log('Volunteer deleted successfully:', result);
                toast.success(result.msg || "Volunteer deleted successfully!");
            }}
            onDeleteError={(error) => {
                console.error('Error deleting volunteer:', error);
                toast.error(error.data.msg || "Failed to delete volunteer. Please try again.");
            }}
        />
    );
}