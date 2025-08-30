// import { ColumnDef } from "@tanstack/react-table";
// import { BootcampType } from "@/types/bootcamp";
// import RowsActions from "../../../../../../components/table/rows-actions";
// import { Field } from "@/app/interface";
// import { BootcampSchema } from "@/validations/bootcamp";
// import {
//   useDeleteBootcampMutation,
//   useUpdateBootcampMutation,
// } from "@/service/Api/bootcamp";
// import { toast } from "sonner";

// export const getBootcampFields = (bootcampData?: BootcampType): Field[] => [
//   {
//     name: "name",
//     type: "text",
//     label: "Name",
//     placeholder: "Enter bootcamp name",
//     ...(bootcampData?.name && { defaultValue: bootcampData.name }),
//     // step: 1,
//   },
//   {
//     name: "date",
//     type: "date",
//     label: "Date",
//     placeholder: "Pick up a date",
//     ...(bootcampData?.date && { defaultValue: bootcampData.date }),
//     // step: 1,
//   },
//   {
//     name: "total_capacity",
//     type: "number",
//     label: "Total Capacity",
//     placeholder: "Enter total capacity",
//     ...(bootcampData?.total_capacity && {
//       defaultValue: String(bootcampData.total_capacity),
//     }),
//     // step: 2,
//   },
// ];

// export const bootcampColumns: ColumnDef<BootcampType>[] = [
//   {
//     header: "Name",
//     accessorKey: "name",
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("name")}</div>
//     ),
//   },
//   {
//     header: "Date",
//     accessorKey: "date",
//     cell: ({ row }) => <div>{row.getValue("date")}</div>,
//   },
//   {
//     header: "Capacity",
//     accessorKey: "total_capacity",
//     cell: ({ row }) => <div>{row.getValue("total_capacity")}</div>,
//   },
//   {
//     id: "actions",
//     header: () => <span>Actions</span>,
//     cell: ({ row }) => <BootcampRowActions rowData={row.original} />,
//   },
// ];

// function BootcampRowActions({ rowData }: { rowData: BootcampType }) {
//   const [updateBootcamp] = useUpdateBootcampMutation();
//   const [deleteBootcamp] = useDeleteBootcampMutation();

//   return (
//     <RowsActions
//       rowData={rowData}
//       isDelete={true}
//       fields={getBootcampFields(rowData)}
//       validationSchema={BootcampSchema}
//       updateMutation={(data) => updateBootcamp({ data, id: rowData.id })}
//       deleteMutation={deleteBootcamp}
//       onUpdateSuccess={(result) =>
//         toast.success("Bootcamp updated successfully")
//       }
//       onUpdateError={(error) =>
//         toast.error("Falid to update bootcamp:", error?.data?.message)
//       }
//       onDeleteSuccess={(result) =>
//         toast.success("Bootcamp deleted successfully")
//       }
//       onDeleteError={(error) =>
//         toast.error("Falid to delete bootcamp:", error?.data?.message)
//       }
//     />
//   );
// }
