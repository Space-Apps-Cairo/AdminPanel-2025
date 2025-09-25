"use client";

import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";

import {
  actualSolutionColumns,
  getActualSolutionFields,
} from "./columns";

import {
  useGetActualSolutionsQuery,
  useAddActualSolutionMutation,
} from "@/service/Api/hackathon/form-options/actualSolutions";
import { ActualSolution } from "@/types/hackthon/form-options/actualSolution";
import { actualSolutionValidationSchema } from "@/validations/hackthon/form-options/actualSolution";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";

export default function ActualSolutions() {
  const {
    data: actualSolutionsData,
    isLoading,
    error,
  } = useGetActualSolutionsQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [addActualSolution] = useAddActualSolutionMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title",
    searchKeys: ["title", "description"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Solution",
    onAdd: () => setIsOpen(true),
  };

  const handleAddActualSolutionSubmit = async (data: FieldValues) => {
    try {
      const result = await addActualSolution(data).unwrap();
      console.log("Solution added successfully:", result);
      toast.success("Solution added successfully!");
    } catch (error) {
      console.error("Error adding solution:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add solution. Please try again."
      );
      throw error;
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getActualSolutionFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={actualSolutionValidationSchema}
          onSubmit={handleAddActualSolutionSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Actual Solutions</h1>

        <DataTable<ActualSolution>
          data={actualSolutionsData?.data ?? []}
          columns={actualSolutionColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
    </React.Fragment>
  );
}
