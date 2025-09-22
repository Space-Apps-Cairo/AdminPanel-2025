"use client"

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useAddCollectionMutation, useGetAllCollectionsQuery, useDeleteCollectionMutation } from '@/service/Api/materials';
import { Collection, CreateCollectionRequest, MaterialsForCollections } from '@/types/materials';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useState } from 'react';
import { collectionColumns, useCollectionsFields } from './_components/columns';
import CrudForm from '@/components/crud-form';
import { collectionValidationSchema } from '@/validations/collection';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

export default function Collections() {

    const {
        data: collectionsData,
        isLoading: isLoadingCollections,
        error: collectionsError,
    } = useGetAllCollectionsQuery();

    const [isOpen, setIsOpen] = useState(false);

    const fields = useCollectionsFields();

    // Delete mutation for bulk operations
    const [deleteCollection] = useDeleteCollectionMutation();


    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by name",
        searchKeys: ["collection_name"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add collection",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    // ====== add-new-collection ====== //

    const [addCollection] = useAddCollectionMutation();

    const handleAddCollectionSubmit = async (data: FieldValues, formData?: FormData) => {
        try {
            console.log("Submitting collection data:", data);
            console.log(
                "Form data:",
                formData ? [...formData.entries()] : "No form data"
            );

            const collectionData: CreateCollectionRequest = {
                collection_name: data.collection_name,
                total_quantity: Number(data.total_quantity),
                max_per_user: Number(data.max_per_user),
                materials: data.materials.map((material: MaterialsForCollections) => ({
                    id: Number(material.id),
                    quantity_used: Number(material.quantity_used)
                }))
            };

            const result = await addCollection(collectionData as CreateCollectionRequest).unwrap();

            console.log("Collection added successfully:", result);
            toast.success(result.msg || "Collection added successfully!");
            setIsOpen(false);

        } catch (error) {
            console.error("Error adding collection:", error);
            toast.error((error as any).data.msg || "Failed to add collection. Please try again.");
            throw error;
        }
    };

    // ====== status ====== //

    if (isLoadingCollections) return <Loading />;

    if (collectionsError) {
        return (
        <div className="mx-auto py-6">
            <div className="text-red-500">
            Error loading collections
            </div>
        </div>
        );
    }


    return <React.Fragment>

        {isOpen && (
            <CrudForm
                fields={fields}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                operation={"add"}
                asDialog={true}
                validationSchema={collectionValidationSchema}
                steps={[1, 2]}
                onSubmit={handleAddCollectionSubmit}
            />
        )}

        <div className="mx-auto py-6 px-7">
        
            <h1 className="text-2xl font-bold mb-6">Collections</h1>

            <DataTable<Collection>
                data={collectionsData?.data || []}
                columns={collectionColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                bulkDeleteMutation={deleteCollection}
            />

        </div>

    </React.Fragment>

}
