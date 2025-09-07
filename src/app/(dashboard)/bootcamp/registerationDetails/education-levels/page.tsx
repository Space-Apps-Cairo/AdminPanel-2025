"use client";

import { useState } from "react";
import {
  useGetAllEducationalLevelsQuery,
  useAddNewEducationalLevelMutation,
  useDeleteEducationalLevelMutation,
  EducationalLevel,
} from "@/service/Api/educationalLevels";

import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";
import DataTable from "@/components/table/data-table";
import { EducationLevelSchema } from "@/validations/education-level";
import { toast } from "sonner";
import {
  educationLevelColumns,
  getEducationLevelFields,
} from "./_components/coulmns";

export default function EducationLevelsPage() {
  const { data, isLoading, error } = useGetAllEducationalLevelsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const educationLevels = data?.data ?? [];

  const [addEducationLevel] = useAddNewEducationalLevelMutation();
  const [deleteEducationLevel] = useDeleteEducationalLevelMutation();

  const handleAddSubmit = async (values: Partial<EducationalLevel>) => {
    const payload = {
      title: values.name,
    };
    try {
      await addEducationLevel(payload).unwrap();
      setIsOpen(false);
      toast.success("Education level created successfully");
    } catch (err) {
      toast.error("Failed to add education level", {
        description: err.message,
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 p-4">Error fetching education levels</div>
    );

  return (
    <div className="py-6 px-8">
      {isOpen && (
        <CrudForm
          fields={getEducationLevelFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog
          validationSchema={EducationLevelSchema}
          onSubmit={handleAddSubmit}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Education Levels</h1>

      <DataTable<EducationalLevel>
        data={educationLevels}
        columns={educationLevelColumns}
        searchConfig={{
          enabled: true,
          placeholder: "Search by name",
          searchKeys: ["name"],
        }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Education Level",
          onAdd: () => setIsOpen(true),
        }}
        onDeleteRows={deleteEducationLevel}
      />
    </div>
  );
}
