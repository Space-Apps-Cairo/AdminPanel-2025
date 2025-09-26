"use client";
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";
import Error from "@/components/Error/page";

import {
  participationMethodColumns,
  getParticipationMethodFields,
} from "./columns";
import {
 useGetParticipationMethodQuery,
  useAddParticipationMethodMutation,
} from "@/service/Api/hackathon/form-options/participationMethod";

import { ParticipationMethod } from "@/types/hackthon/form-options/participationMethod";
import { participationMethodValidationSchema } from "@/validations/hackthon/form-options/participationMethod";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";

export default function ParticipationMethods() {
  const {
    data: methodsData,
    isLoading: isLoadingMethods,
    error: methodsError,
  } = useGetParticipationMethodQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [addMethod] = useAddParticipationMethodMutation();

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
    addButtonText: "Add Participation Method",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const handleAddMethodSubmit = async (data: FieldValues) => {
    try {
      const result = await addMethod(data).unwrap();
      console.log("Participation method added successfully:", result);
      toast.success("Participation method added successfully!");
    } catch (error) {
      console.error("Error adding participation method:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add participation method. Please try again."
      );
      throw error;
    }
  };

  if (isLoadingMethods) return <Loading />;
  if (methodsError) return <Error />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getParticipationMethodFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={participationMethodValidationSchema}
          onSubmit={handleAddMethodSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Participation Methods</h1>

        <DataTable<ParticipationMethod>
          data={methodsData?.data ?? []}
          columns={participationMethodColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
    </React.Fragment>
  );
}
