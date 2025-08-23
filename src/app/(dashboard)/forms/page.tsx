"use client";

import React, { useState } from "react";
import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";
import {
  useCreateFormMutation,
  useGetAllFormsQuery,useGetFormModelByIdQuery
} from "@/service/Api/forms";

import { Form } from "@/types/forms";
import { getFormFields, formColumns } from "./_components/columns";
import { FormSchema } from "@/validations/forms";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { FieldValues } from "react-hook-form";

export default function Forms() {
  const {
    data: formsData,
    isLoading: isLoadingForms,
    error: formsError,
    refetch,
  } = useGetAllFormsQuery();
const { data:formabledata, isLoading } = useGetFormModelByIdQuery();
const [selectedFormableType, setSelectedFormableType] = useState<number | null>(null);
const filteredFormableIds = selectedFormableType
  ? formabledata?.data.find((fd: { formable_type_id: { toString: () => number; }; }) => fd.formable_type_id.toString() === selectedFormableType)?.data ?? []
  : [];
  const [isOpen, setIsOpen] = useState(false);

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title or description",
    searchKeys: ["title", "description"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Form",
    onAdd: () => setIsOpen(true),
  };

  const [addForm, { isLoading: isAddingForm }] = useCreateFormMutation();

  const handleAddFormSubmit = async (data: FieldValues, formsData?: FormData) => {
    try {
      const formPayload: Omit<Form, "id" | "created_at"> = {
        title: data.title,
        description: data.description,
        formable_type_id: data.formable_type_id,
        formable_id: Number(data.formable_id),
        is_active: Boolean(data.is_active),
      };

      const result = await addForm(formPayload as Form).unwrap();

      console.log("Form added successfully:", result);
      await refetch();

      setIsOpen(false);
    } catch (error) {
      console.error("Error adding form:", error);
      throw error;
    }
  };

  if (isLoadingForms) return <Loading />;

  if (formsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">
          Error loading forms: {JSON.stringify(formsError)}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Forms</h1>

        <DataTable<Form>
          data={formsData?.data ?? []}
          columns={formColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
         
        />

        {isOpen && (
          <CrudForm
            fields={getFormFields(undefined, formabledata?.data,)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            operation="add"
            asDialog={true}
            validationSchema={FormSchema}
            onSubmit={handleAddFormSubmit}
          />
        )}
      </div>
    </React.Fragment>
  );
}
