import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { useDeleteMaterialMutation, useUpdateMaterialMutation } from "@/service/Api/materials";
import { Material } from "@/types/materials";
import { materialValidationSchema } from "@/validations/material";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from 'sonner';

export const getMaterialFields = (materialData?: Material, isUpdate: boolean = false): Field[] => [

    {
        name: "material_name",
        type: "text",
        label: "Material Name",
        ...(materialData?.material_name && { defaultValue: materialData.material_name }),
        step: 1,
    },

    {
        name: "total_quantity",
        type: "number",
        label: "Total Quantity",
        ...(materialData?.total_quantity && { defaultValue: materialData.total_quantity }),
        step: 1,
    },

    ...(isUpdate || materialData?.used_quantity !== undefined
        ? [{
            name: "used_quantity",
            type: "number",
            label: "Used Quantity",
            placeholder: "Enter the used quantity",
            ...(materialData?.used_quantity !== undefined && { defaultValue: materialData.used_quantity }),
            step: 1,
            }]
        : []
    ),

];

export const materialColumns: ColumnDef<Material>[] = [

    {
        header: "Name",
        accessorKey: "material_name",
        size: 220,
        enableHiding: false,
    },

    {
        header: "Total Quantity",
        accessorKey: "total_quantity",
        size: 180,
        enableHiding: false,
    },

    {
        header: "Used Quantity",
        accessorKey: "used_quantity",
        size: 180,
        enableHiding: false,
    },

    {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <MaterialRowActions rowData={row.original} />
        ),
        size: 100,
        enableHiding: false,
    },
];

function MaterialRowActions({ rowData }: { rowData: Material }) {

    const [updateMaterial] = useUpdateMaterialMutation();
    const [deleteMaterial] = useDeleteMaterialMutation();

    return (
        <RowsActions
            rowData={rowData}
            isDelete={true}
            isUpdate={true}
            isPreview={true}
            fields={getMaterialFields(rowData, true)}
            validationSchema={materialValidationSchema}
            updateMutation={async (payload: { id: string | number; data: any }) => {
                console.log('Update payload:', payload);
                console.log('start updating');
                try {
                    const result = await updateMaterial(payload).unwrap();
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
                    const result = await deleteMaterial(id).unwrap();
                    console.log('Delete result:', result);
                    return result;
                } catch (error) {
                    console.error('Delete error:', error);
                    throw error;
                }
            }}
            onUpdateSuccess={(result) => {
                console.log('Material updated successfully:', result);
                toast.success("Material updated successfully!");
            }}
            onUpdateError={(error) => {
                console.error('Error updating material:', error);
                toast.error("Failed to update material. Please try again.");
            }}
            onDeleteSuccess={(result) => {
                console.log('Material deleted successfully:', result);
                toast.success("Material deleted successfully!");
            }}
            onDeleteError={(error) => {
                console.error('Error deleting material:', error);
                toast.error("Failed to delete material. Please try again.");
            }}
        />
    );

}