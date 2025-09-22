"use client";

import { useState } from "react";
import {
  useGetAllFieldsOfStudyQuery,
  useAddNewFieldOfStudyMutation,
  useDeleteFieldOfStudyMutation,
} from "@/service/Api/fieldsOfStudy";

import { FieldOfStudyType } from "@/types/fieldOfStudy";

import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";
import DataTable from "@/components/table/data-table";
import { FieldOfStudySchema } from "@/validations/field-of-study";
import { toast } from "sonner";
import {
  fieldOfStudyColumns,
  getFieldOfStudyFields,
} from "./_components/coulmns";

export default function FieldOfStudyPage() {
  const { data, isLoading, error } = useGetAllFieldsOfStudyQuery();
  const [isOpen, setIsOpen] = useState(false);
  const fieldsOfStudy = data?.data ?? [];

  const [addFieldOfStudy] = useAddNewFieldOfStudyMutation();
  const [deleteFieldOfStudy] = useDeleteFieldOfStudyMutation();

  const handleAddSubmit = async (values: Partial<FieldOfStudyType>) => {
    const payload = {
      title: values.name,
    };
    try {
      await addFieldOfStudy(payload).unwrap();
      setIsOpen(false);
      toast.success("Field of study created successfully");
    } catch (err) {
      toast.error("Failed to add field of study", {
        description: err.message,
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 p-4">Error fetching fields of study</div>
    );

  return (
    <div className="mx-auto py-6 px-8">
      {isOpen && (
        <CrudForm
          fields={getFieldOfStudyFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog
          validationSchema={FieldOfStudySchema}
          onSubmit={handleAddSubmit}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Fields of Study</h1>

      <DataTable<FieldOfStudyType>
        data={fieldsOfStudy}
        columns={fieldOfStudyColumns}
        searchConfig={{
          enabled: true,
          placeholder: "Search by name",
          searchKeys: ["name"],
        }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Field of Study",
          onAdd: () => setIsOpen(true),
        }}
        onDeleteRows={deleteFieldOfStudy}
      />
    </div>
  );
}
