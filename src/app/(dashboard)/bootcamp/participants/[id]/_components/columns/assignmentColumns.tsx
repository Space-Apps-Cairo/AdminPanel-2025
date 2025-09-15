import { Assignment } from "@/types/preference";
import { ColumnDef } from "@tanstack/react-table";
import { Field } from "@/app/interface";
import RowsActions from "../../../../../../../components/table/rows-actions";
import { AssignmentSchema } from "@/validations/assignment";
import {
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/service/Api/assignment";
import { toast } from "sonner";

export const getAssignmentFields = (assignmentData?: Assignment): Field[] => [
  {
    name: "attendance_status",
    type: "select",
    label: "Attendance Status",
    placeholder: "Select status",
    options: [
      { value: "assigned", label: "Assigned" },
      { value: "attended", label: "Attended" },
      { value: "absent", label: "Absent" },
    ],
    ...(assignmentData?.attendance_status && {
      defaultValue: assignmentData.attendance_status,
    }),
  },
  {
    name: "check_in_time",
    type: "text",
    label: "Check In Time",
    defaultValue:
      assignmentData?.check_in_time ??
      new Date()
        .toLocaleString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", ""),
    disabled: true,
  },
  {
    name: "workshop_schedule_id",
    type: "number",
    label: "Schedule",
    placeholder: "Enter schedule ",
    defaultValue: assignmentData?.schedule?.id ?? undefined,
  },
];

export const assignmentColumns: ColumnDef<Assignment>[] = [
  {
    header: "Workshop Title",
    accessorFn: (row) => row.schedule?.workshop_title ?? "Not assigned",
    size: 200,
  },
  {
    header: "Date",
    accessorFn: (row) =>
      new Date(row.schedule?.date ?? "").toLocaleDateString(),
    size: 120,
  },
  {
    header: "Attendance Status",
    accessorKey: "attendance_status",
    size: 150,
  },
  {
    header: "Check In Time",
    accessorKey: "check_in_time",
    size: 150,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <AssignmentRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function AssignmentRowActions({ rowData }: { rowData: Assignment }) {
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      fields={getAssignmentFields(rowData)}
      validationSchema={AssignmentSchema}
      updateMutation={(data: Assignment) => {
        const formattedData = {
          ...data,
        };
        return updateAssignment({
          id: rowData.id,
          data: formattedData,
        });
      }}
      deleteMutation={deleteAssignment}
      onUpdateSuccess={(result) => {
        toast.success(result.message || "Assignment updated successfully!");
      }}
      onUpdateError={(error) => {
        toast.error(
          error.data?.message ||
            "Failed to update Assignment. Please try again."
        );
      }}
      onDeleteSuccess={(result) => {
        toast.success(result.message || "Assignment deleted successfully!");
      }}
      onDeleteError={(error) => {
        toast.error(
          error.data?.message ||
            "Failed to delete Assignment. Please try again."
        );
      }}
    />
  );
}
