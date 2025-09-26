"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import {
  useAddBootcampDetailsMutation,
  useGetAllBootcampDetailsQuery,
  useDeleteBootcampDetailsMutation,
} from "@/service/Api/bootcampDetails";
import {
  BootcampDetailsRequest,
  BootcampDetailsType,
} from "@/types/bootcampDetails";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useEffect, useState } from "react";
import {
  getBootcampDetailsFields,
  bootcampDetailsColumns,
} from "./_components/bootcampDetailsColumns";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import { bootcampDetailsValidationSchema } from "@/validations/bootcampDetails";
import { toast } from "sonner";

export default function Bootcamps() {
  const {
    data: bootcampsData,
    isLoading: isLoadingBootcamps,
    error: bootcampsError,
  } = useGetAllBootcampDetailsQuery();

  const [isOpen, setIsOpen] = useState(false);

  // Delete mutation for bulk operations
  const [deleteBootcampDetails] = useDeleteBootcampDetailsMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name",
    searchKeys: ["name"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    showExport: true,
    addButtonText: "Add Bootcamp",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // ====== add-new-bootcamp ====== //

  const [addBootcampDetails] = useAddBootcampDetailsMutation();

  const handleAddBootcampSubmit = async (
    data: FieldValues,
    formData?: FormData
  ) => {
    try {
      console.log("Submitting bootcamp data:", data);
      console.log(
        "Form data:",
        formData ? [...formData.entries()] : "No form data"
      );

      // Format the date correctly
      const formattedDate = data.date
        ? new Date(data.date).toISOString().slice(0, 19).replace("T", " ")
        : null;

      const bootcampData = {
        name: data.name,
        date: formattedDate,
        total_capacity: data.total_capacity,
      };

      const result = await addBootcampDetails(
        bootcampData as BootcampDetailsRequest
      ).unwrap();

      console.log("Bootcamp added successfully:", result);
      toast.success(result.message || "Bootcamp added successfully!");
    } catch (error) {
      console.error("Error adding bootcamp:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add bootcamp. Please try again."
      );
      throw error;
    }
  };

  if (isLoadingBootcamps) return <Loading />;

  if (bootcampsError) {
    return (
      <div className="mx-auto py-6">
        <div className="text-red-500">Error loading bootcamps</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getBootcampDetailsFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={bootcampDetailsValidationSchema}
          onSubmit={handleAddBootcampSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Bootcamps</h1>

        <DataTable<BootcampDetailsType>
          data={bootcampsData?.data || []}
          columns={bootcampDetailsColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteBootcampDetails}
        />
      </div>
    </React.Fragment>
  );
}
