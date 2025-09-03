"use client";

import { Workshop } from "@/types/workshop";
import React, { useEffect, useState } from "react";
import {
  ActionConfig,
  ColumnVisibilityConfig,
  SearchConfig,
  StatusConfig,
} from "@/types/table";
import DataTable from "../../../../components/table/data-table";
import { getWorkshopsFields, workshopColumns } from "./_components/columns";
import Loading from "../../../../components/loading/loading";
import CrudForm from "../../../../components/crud-form";
import { workshopValidationSchema } from "@/validations/workshop";
import {
  useAddNewWorkshopMutation,
  useGetAllWorkshopsQuery,
} from "@/service/Api/workshops";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export default function Workshops() {
  const {
    data: workshopsData,
    isLoading: isLoadingWorkshops,
    error: workshopsError,
  } = useGetAllWorkshopsQuery();

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      workshopsData &&
      workshopsData.data &&
      !isLoadingWorkshops &&
      !workshopsError
    ) {
      setWorkshops(workshopsData.data);
    }
  }, [workshopsData, isLoadingWorkshops, workshopsError]);

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
    addButtonText: "Add workshop",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // ====== add-new-workshop ====== //

  const [addWorkshop] = useAddNewWorkshopMutation();

  const handleAddWorkshopSubmit = async (
    data: FieldValues,
    formData?: FormData
  ) => {
    try {
      console.log("Submitting workshop data:", data);
      console.log(
        "Form data:",
        formData ? [...formData.entries()] : "No form data"
      );

      const workshopData: Omit<Workshop, "id" | "created_at" | "schedules"> = {
        title: data.title,
        description: data.description,
        workshop_details: data.workshop_details,
        start_date:
          data.start_date instanceof Date
            ? data.start_date.toISOString().split("T")[0]
            : data.start_date,
        end_date:
          data.end_date instanceof Date
            ? data.end_date.toISOString().split("T")[0]
            : data.end_date,
      };

      const result = await addWorkshop(workshopData as Workshop).unwrap();

      toast.success("Workshop created successfully");

      // Update local state with new workshop
      if (result.data) {
        setWorkshops((prev) => [...prev, result.data]);
      }
    } catch (error) {
      const err = error as any;
      toast.error("Failed to add workshop. Please try again.", {
        description: err?.message || err?.data?.message || "Unexpected error",
      });
      throw error;
    }
  };

  if (isLoadingWorkshops) return <Loading />;

  if (workshopsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading workshops</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Workshop</h1>

        <DataTable<Workshop>
          data={workshops}
          columns={workshopColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          onDataChange={setWorkshops}
          allowTrigger={true}
        />

        {isOpen && (
          <CrudForm
            fields={getWorkshopsFields()}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            operation={"add"}
            asDialog={true}
            validationSchema={workshopValidationSchema}
            onSubmit={handleAddWorkshopSubmit}
          />
        )}
      </div>
    </React.Fragment>
  );
}
