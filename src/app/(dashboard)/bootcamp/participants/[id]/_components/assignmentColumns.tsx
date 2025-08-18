
import { Assignment } from "@/types/preference";
import { ColumnDef } from "@tanstack/react-table";
import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { AssignmentSchema } from "@/validations/assignment";
import { useDeleteAssignmentMutation, useUpdateAssignmentMutation } from "@/service/Api/assignment";

export const getAssignmentFields = (assignmentData?: Assignment): Field[] => [
  {
    name: "attendance_status",
    type: "select",
    label: "Attendance Status",
    placeholder: "Select status",
    options: [
      { value: "assigned", placeholder: "Assigned" },
      { value: "attended", placeholder: "Attended" },
      { value: "absent", placeholder: "Absent" },
    ],
    ...(assignmentData?.attendance_status && { defaultValue: assignmentData.attendance_status }),
  },
  {
    name: "check_in_time",
    type: "text",
    label: "Check In Time",
    placeholder: "Enter check-in time",
    ...(assignmentData?.check_in_time && { defaultValue: assignmentData.check_in_time }),
  },
 {
  name: "workshop_schedule_id", 
  type: "number",
  label: "Schedule ID",
  defaultValue: assignmentData?.schedule?.id ?? undefined, 
}
];

export const assignmentColumns: ColumnDef<Assignment>[] = [
  {
    header: "Workshop Title",
    accessorFn: (row) => row.schedule?.workshop_title ?? "Not assigned",
    size: 200,
  },
  {
    header: "Date",
    accessorFn: (row) => new Date(row.schedule?.date ?? "").toLocaleDateString(),
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
      updateMutation={updateAssignment} 
      deleteMutation={deleteAssignment} 
      onUpdateSuccess={(result) => console.log("Assignment updated:", result)}
      onUpdateError={(error) => console.error("Error updating assignment:", error)}
      onDeleteSuccess={(result) => console.log("Assignment deleted:", result)}
      onDeleteError={(error) => console.error("Error deleting assignment:", error)}
    />
  );
}
