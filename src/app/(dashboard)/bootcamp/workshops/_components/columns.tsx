import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { Workshop } from "@/types/workshop";
import { workshopValidationSchema } from "@/validations/workshop";
import { ColumnDef } from "@tanstack/react-table";

export const getWorkshopsFields = (userData?: Workshop): Field[] => [
    {
        name: "title",
        type: "text",
        label: "Title",
        ...(userData?.title && { defaultValue: userData.title }),
        step: 1,
    },
    {
        name: "description",
        type: "text",
        label: "Description",
        ...(userData?.description && { defaultValue: userData.description }),
        step: 1,
    },
    {
        name: "start_date",
        type: "date",
        label: "Start Date",
        placeholder: 'Workshop start date',
        ...(userData?.start_date && { defaultValue: userData.start_date }),
        step: 1,
    },
    {
        name: "end_date",
        type: "date",
        label: "End Date",
        placeholder: 'Workshop end date',
        ...(userData?.end_date && { defaultValue: userData.end_date }),
        step: 1,
    },
];

export const workshopColumns: ColumnDef<Workshop>[] = [
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("title")}</div>
        ),
        size: 180,
        enableHiding: false,
    },
    {
        header: "Description",
        accessorKey: "description",
        size: 220,
    },
    {
        header: "Start Date",
        accessorKey: "start_date",
        size: 180,
    },
    {
        header: "End Date",
        accessorKey: "end_date",
        size: 180,
    },
    {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <RowsActions
                rowData={row.original}
                // steps={[1]}
                isDelete={true}
                fields={getWorkshopsFields(row.original)}
                validationSchema={workshopValidationSchema}
            />
        ),
        size: 150,
        enableHiding: false,
    },
];