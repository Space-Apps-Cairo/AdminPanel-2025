import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteScheduleMutation,
  useUpdateScheduleMutation,
} from "@/service/Api/workshops";
import { Schedule } from "@/types/workshop";
import { scheduleValidationSchema } from "@/validations/schedule";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const getScheduleFields = (ScheduleData?: Schedule): Field[] => [
  {
    name: "date",
    type: "date",
    label: "Date",
    placeholder: "Select schedule date",
    ...(ScheduleData?.date && {
      defaultValue: new Date(ScheduleData.date).toISOString().split("T")[0],
    }),
  },

  {
    name: "start_time",
    type: "time", // 👈 use time input
    label: "Start Time",
    placeholder: "Pick start time",
    ...(ScheduleData?.start_time && {
      defaultValue: ScheduleData.start_time.split(":").slice(0, 2).join(":"), // gives HH:MM
    }),
  },

  {
    name: "end_time",
    type: "time", // 👈 use time input
    label: "End Time",
    placeholder: "Pick end time",
    ...(ScheduleData?.end_time && {
      defaultValue: ScheduleData.end_time.split(":").slice(0, 2).join(":"), // gives HH:MM
    }),
  },

  {
    name: "capacity",
    type: "number",
    label: "Capacity",
    placeholder: "Enter total capacity",
    ...(ScheduleData?.capacity && { defaultValue: ScheduleData.capacity }),
  },

  // {
  //   name: "available_slots",
  //   type: "number",
  //   label: "Available Slots",
  //   placeholder: "Enter available slots",
  //   ...(ScheduleData?.available_slots && {
  //     defaultValue: ScheduleData.available_slots,
  //   }),
  // },

  // {
  //   name: "available_slots_on_site",
  //   type: "number",
  //   label: "Available Slots On Site",
  //   placeholder: "Enter on-site available slots",
  //   ...(ScheduleData?.available_slots_on_site && {
  //     defaultValue: ScheduleData.available_slots_on_site,
  //   }),
  // },
];

export const scheduleColumns: ColumnDef<Schedule>[] = [
  {
    header: "Date",
    accessorKey: "date",
    size: 120,
    enableHiding: false,
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
    cell: ({ row }) => <ScheduleRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function ScheduleRowActions({ rowData }: { rowData: Schedule }) {
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();
  const params = useParams();
  const workshopId = params?.id;
  function handleScheduleUpdate(data: any) {
    const scheduleData = {
      workshop_id: parseInt(workshopId),
      date:
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date,
      start_time: `${data.start_time}:00`,
      end_time: `${data.end_time}:00`,
      capacity: parseInt(data.capacity.toString()),
      // available_slots: parseInt(data.available_slots.toString()),
      // available_slots_on_site: parseInt(
      //   data.available_slots_on_site.toString()
      // ),
    };

    return updateSchedule({
      id: rowData.id,
      data: scheduleData,
    }).unwrap();
  }

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getScheduleFields(rowData)}
      validationSchema={scheduleValidationSchema}
      updateMutation={handleScheduleUpdate}
      deleteMutation={deleteSchedule}
      onUpdateSuccess={() => {
        toast.success("Schedule updated successfully");
      }}
      onUpdateError={(error) => {
        console.error("Update error:", error);

        toast.error("Falid to update schedule", {
          description: error?.data?.meesage,
        });
      }}
      onDeleteSuccess={() => {
        toast.success("Schedule deleted successfully");
      }}
      onDeleteError={(error) => {
        toast.error("Falid to delete schedule", {
          description: error?.data?.meesage,
        });
      }}
    />
  );
}
