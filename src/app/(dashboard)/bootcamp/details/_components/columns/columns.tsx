 
import { ColumnDef } from "@tanstack/react-table";
import { BootcampType } from "@/types/bootcamp";
import RowsActions from "@/components/table/rows-actions";
import { Field } from "@/app/interface";
import { BootcampSchema } from "@/validations/bootcamp";

export const getBootcampFields = (bootcampData?: BootcampType): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    ...(bootcampData?.name && { defaultValue: bootcampData.name }),
    step: 1,
  },
  {
    name: "date",
    type: "text",
    label: "Date",
    ...(bootcampData?.date && { defaultValue: bootcampData.date }),
    step: 1,
  },
  {
    name: "total_capacity",
    type: "number",
    label: "Total Capacity",
    ...(bootcampData?.total_capacity && {
      defaultValue: String(bootcampData.total_capacity),   }),
    step: 2,
  },
];

export const bootcampColumns: ColumnDef<BootcampType>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    header: "Capacity",
    accessorKey: "total_capacity",
    cell: ({ row }) => <div>{row.getValue("total_capacity")}</div>,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <RowsActions
        rowData={row.original}
        steps={[1, 2]}
        isDelete={true}
        fields={getBootcampFields(row.original)}
        validationSchema={BootcampSchema}
      />
    ),
  },
];
