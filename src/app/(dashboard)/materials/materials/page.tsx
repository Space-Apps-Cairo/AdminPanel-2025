"use client"

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useAddMaterialMutation, useGetAllMaterialsQuery } from '@/service/Api/materials';
import { Material } from '@/types/materials';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useEffect, useState } from 'react'
import { getMaterialFields, materialColumns } from './_components/columns';
import { FieldValues } from 'react-hook-form';
import CrudForm from '@/components/crud-form';
import { materialValidationSchema } from '@/validations/material';
import { toast } from 'sonner';

export default function Materials() {

    const {
        data: materialsData,
        isLoading: isLoadingMaterials,
        error: materialsError,
    } = useGetAllMaterialsQuery();

    const [materials, setMaterials] = useState<Material[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (
            materialsData &&
            !isLoadingMaterials &&
            !materialsError
        ) {
            setMaterials(materialsData.data);
        }
    }, [materialsData, isLoadingMaterials, materialsError]);

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by name",
        searchKeys: ["material_name"],
    };
    
    const statusConfig: StatusConfig = {
        enabled: false,
    };
    
    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add Material",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    // ====== add-new-material ====== //
    
    const [addMaterial] = useAddMaterialMutation();

    const handleAddMaterialSubmit = async (data: FieldValues, formData?: FormData) => {

        try {
            console.log("Submitting material data:", data);
            console.log("Form data:", formData ? [...formData.entries()] : "No form data");

            const materialData: Omit<Material, "id" | "created_at" | "schedules"> = {
                material_name: data.material_name,
                total_quantity: data.total_quantity,
            };

            const result = await addMaterial(materialData as Material).unwrap();

            console.log("Material added successfully:", result);
            toast.success(result.msg || "Material added successfully!");

        } catch (error) {
            console.error("Error adding material:", error);
            toast.error((error as any).data.msg || "Failed to add material. Please try again.");
            throw error;
        }

    };

    if (isLoadingMaterials) return <Loading />;

    if (materialsError) {
        return (
            <div className="container mx-auto py-6">
                <div className="text-red-500">
                Error loading materials
                </div>
            </div>
        );
    }

    return <React.Fragment>

        {isOpen && (
            <CrudForm
            fields={getMaterialFields()}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            operation={"add"}
            asDialog={true}
            validationSchema={materialValidationSchema}
            onSubmit={handleAddMaterialSubmit}
            />
        )}

        <div className="container mx-auto py-6">

            <h1 className="text-2xl font-bold mb-6">Materials</h1>

            <DataTable<Material>
                data={materials}
                columns={materialColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                // onDataChange={setMaterials}
            />

        </div>

    </React.Fragment>

}
