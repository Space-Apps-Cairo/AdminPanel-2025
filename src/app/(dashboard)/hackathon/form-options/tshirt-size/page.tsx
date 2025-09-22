"use client";

import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";

import { tshirtColumns ,getTShirtFields} from "./columns";

import {
  useGetTshirtsQuery,
  useAddTshirtMutation,
  useDeleteTShirtMutation,
} from "@/service/Api/tshirt";
import { TShirtSize } from "@/types/tshritSize";
import { tshirtValidationSchema } from "@/validations/tshirtSize";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";

export default function Tshirts() {
  const {
    data: tshirtsData,
    isLoading: isLoadingTshirts,
    error: tshirtsError,
  } = useGetTshirtsQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [addTshirt] = useAddTshirtMutation();


  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title ",
    searchKeys: ["title"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add T-shirt Size",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const handleAddTshirtSubmit = async (data: FieldValues) => {
    try {
      const result = await addTshirt(data).unwrap();
      console.log("T-shirt size added successfully:", result);
      toast.success("T-shirt size added successfully!");
    } catch (error) {
      console.error("Error adding T-shirt size:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add T-shirt size. Please try again."
      );
      throw error;
    }
  };

  if (isLoadingTshirts) return <Loading />;
  if (tshirtsError) {
    return (
     <Error/>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getTShirtFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={tshirtValidationSchema}
          onSubmit={handleAddTshirtSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">T-shirt Sizes</h1>

        <DataTable<TShirtSize>
           data={tshirtsData?.data ?? []}
          columns={tshirtColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
    </React.Fragment>
  );
}
