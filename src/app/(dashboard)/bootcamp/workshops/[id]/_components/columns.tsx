import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteScheduleMutation, useUpdateScheduleMutation } from "@/service/Api/workshops";
import { Schedule } from "@/types/workshop";
import { scheduleValidationSchema } from "@/validations/schedule";
import { ColumnDef } from "@tanstack/react-table";

export const getScheduleFields = (ScheduleData?: Schedule): Field[] => [
    {
        name: "date",
        type: "date",
        label: "Date",
        placeholder: 'Schedule date',
        ...(ScheduleData?.date && { defaultValue: new Date(ScheduleData.date).toISOString().split('T')[0]  }),
    },
    {
        name: "start_time",
        type: "time",
        label: "Start Time",
        ...(ScheduleData?.start_time && { defaultValue: ScheduleData.start_time }),
    },
    {
        name: "end_time",
        type: "time",
        label: "End Time",
        ...(ScheduleData?.end_time && { defaultValue: ScheduleData.end_time }),
    },
    {
        name: "capacity",
        type: "number",
        label: "Capacity",
        ...(ScheduleData?.capacity && { defaultValue: ScheduleData.capacity }),
    },
    // {
    //     name: "available_slots",
    //     type: "number",
    //     label: "Available Slots",
    //     ...(ScheduleData?.available_slots && { defaultValue: ScheduleData.available_slots }),
    // },
    // {
    //     name: "available_slots_on_site",
    //     type: "number",
    //     label: "Available Slots On Site",
    //     ...(ScheduleData?.available_slots_on_site && { defaultValue: ScheduleData.available_slots_on_site }),
    // },
]

export const getScheduleColumns = (workshopId: string): ColumnDef<Schedule>[] => [
    {
        header: "Date",
        accessorKey: "date",
        size: 120,
        enableHiding: false
    },
    {
        header: "Start Time",
        accessorKey: "start_time",
        size: 120,
    },
    {
        header: "End Time",
        accessorKey: "end_time",
        size: 120,
    },
    {
        header: "Capacity",
        accessorKey: "capacity",
        size: 120,
    },
    {
        header: "Available Slots",
        accessorKey: "available_slots",
        size: 120,
    },
    {
        header: "Available Slots On Site",
        accessorKey: "available_slots_on_site",
        size: 180,
    },
    {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <ScheduleRowActions 
                rowData={row.original} 
                workshopId={workshopId} // مرر الـ workshop_id
            />
        ),
        size: 150,
        enableHiding: false,
    },
]

function ScheduleRowActions({ rowData, workshopId }: { rowData: Schedule; workshopId: string; }) {

    const [updateSchedule] = useUpdateScheduleMutation();
    const [deleteSchedule] = useDeleteScheduleMutation(); 

    const handleUpdateSchedule = ({ id, data }: { id: string; data: any }) => {

        const formattedData = {
            ...data,
            workshop_id: parseInt(workshopId),
            date: data.date instanceof Date 
                ? data.date.toISOString().split('T')[0] 
                : data.date,
            capacity: parseInt(data.capacity.toString()),
        };
        
        return updateSchedule({
            id: parseInt(id),
            data: formattedData
        }).unwrap();

    };

    return (
        <RowsActions
            rowData={rowData}
            isDelete={true}
            fields={getScheduleFields(rowData)}
            validationSchema={scheduleValidationSchema}
            updateMutation={handleUpdateSchedule}
            deleteMutation={deleteSchedule}
            onUpdateSuccess={(result) => {
                console.log('Schedule updated successfully:', result);
            }}
            onUpdateError={(error) => {
                console.error('Error updating schedule:', error);
            }}
            onDeleteSuccess={(result) => {
                console.log('Schedule deleted successfully:', result);
            }}
            onDeleteError={(error) => {
                console.error('Error deleting schedule:', error);
            }}
        />
    );

}