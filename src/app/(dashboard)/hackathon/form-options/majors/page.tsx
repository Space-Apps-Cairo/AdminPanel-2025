"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import {
  useGetMajorsQuery,
  useDeleteMajorMutation,
  useAddMajorMutation,
} from "@/service/Api/hackathon/form-options/majors";
import { Major, MajorRequest } from "@/types/hackthon/form-options/majors";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useState } from "react";
import { getMajorFields, majorColumns } from "./_components/columns";
import CrudForm from "@/components/crud-form";
import { majorSchema } from "@/validations/hackthon/form-options/majors";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export default function MajorsPage() {
  const {
    data: majorsData,
    isLoading: isLoadingMajors,
    error: majorsError,
  } = useGetMajorsQuery();

  const [isOpen, setIsOpen] = useState(false);

  const fields = getMajorFields();

  // Delete mutation for bulk operations
  const [deleteMajor] = useDeleteMajorMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title",
    searchKeys: ["title"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Major",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // ====== add-new-major ====== //

  const [addMajor] = useAddMajorMutation();

  const handleAddMajorSubmit = async (data: FieldValues) => {
    try {
      console.log("Submitting major data:", data);

      const result = await addMajor(data).unwrap();

      console.log("Major added successfully:", result);
      toast.success(result.message || "Major added successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding major:", error);
      toast.error(
        (error as any).data?.message || "Failed to add major. Please try again."
      );
      throw error;
    }
  };

  // ====== status ====== //

  if (isLoadingMajors) return <Loading />;

  if (majorsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading majors</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={majorSchema}
          onSubmit={handleAddMajorSubmit}
        />
      )}

      <div className=" py-6 px-7">
        <h1 className="text-2xl font-bold mb-6">Hackathon Majors</h1>

        <DataTable<Major>
          data={majorsData}
          columns={majorColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteMajor}
        />
      </div>
    </React.Fragment>
  );
}
