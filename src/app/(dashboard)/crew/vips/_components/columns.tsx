import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Vip } from "@/types/crew/vips";
import {
  useDeleteVipMutation,
  useUpdateVipMutation,
} from "@/service/Api/crew/vips";
import { vipValidationSchema } from "@/validations/crew/vips";

// local validation


export const getVipFields = (vipData?: Vip): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    ...(vipData?.name && { defaultValue: vipData.name }),
    step: 1,
    placeholder: "Enter full name",
  },
  {
    name: "organization",
    type: "text",
    label: "Organization",
    ...(vipData?.organization && { defaultValue: vipData.organization }),
    step: 1,
    placeholder: "Enter organization",
  },
  {
    name: "role",
    type: "text",
    label: "Role",
    ...(vipData?.role && { defaultValue: vipData.role }),
    step: 1,
    placeholder: "Enter role",
  },
];

export const vipColumns: ColumnDef<Vip>[] = [
  {
    header: "UUID",
    accessorKey: "uuid",
    size: 140,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    size: 200,
    enableHiding: false,
  },
  {
    header: "Organization",
    accessorKey: "organization",
    size: 220,
  },
  {
    header: "Role",
    accessorKey: "role",
    size: 200,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <VipRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function VipRowActions({ rowData }: { rowData: Vip }) {
  const [updateVip] = useUpdateVipMutation();
  const [deleteVip] = useDeleteVipMutation();

  return (
    <RowsActions
      rowData={rowData}
      isDelete={true}
      isUpdate={true}
      isPreview={true}
      fields={getVipFields(rowData)}
      validationSchema={vipValidationSchema}
      updateMutation={(data: Vip) =>
        updateVip({ id: rowData.id, data }).unwrap()
      }
      deleteMutation={deleteVip}
      onUpdateSuccess={(result) => {
        toast.success(result?.message || "VIP updated successfully!");
      }}
      onUpdateError={(error) => {
        toast.error(error?.data?.message || "Failed to update VIP");
      }}
      onDeleteSuccess={(result) => {
        toast.success(result?.message || "VIP deleted successfully!");
      }}
      onDeleteError={(error) => {
        toast.error(error?.data?.message || "Failed to delete VIP");
      }}
    />
  );
}