"use client";

import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import {
  useAddNationalityMutation,
  useGetAllNationalitiesQuery,
  useDeleteNationalityMutation,
} from "@/service/Api/registration";
import { Nationality } from "@/types/registration";
import { ActionConfig, StatusConfig, SearchConfig } from "@/types/table";
import { nationalityValidationSchema } from "@/validations/nationality";
import { getNationalityFields, nationalityColumns } from "./_components/columns";

export default function NationalitiesPage() {
  const {
    data: nationalitiesData,
    isLoading: isLoadingNationalities,
    error: nationalitiesError,
  } = useGetAllNationalitiesQuery();

  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteNationality] = useDeleteNationalityMutation();

  useEffect(() => {
    if (
      nationalitiesData &&
      !isLoadingNationalities &&
      !nationalitiesError
    ) {
      setNationalities(nationalitiesData.data);
    }
  }, [nationalitiesData, isLoadingNationalities, nationalitiesError]);

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
        addButtonText: "Add Nationality",
        onAdd: () => {
            setIsOpen(true);
        },
    };

  const [addNationality] = useAddNationalityMutation();

  const handleAddNationalitySubmit = async (data: FieldValues) => {
    try {
      const result = await addNationality(data as Nationality).unwrap();
      toast.success(result.message || "Nationality added successfully!");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Failed to add nationality."
      );
      throw error;
    }
  };

  if (isLoadingNationalities) return <Loading />;

  if (nationalitiesError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading nationalities</div>
      </div>
    );
  }

  return (
    <React.Fragment>

      {isOpen && (
        <CrudForm
          fields={getNationalityFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={nationalityValidationSchema}
          onSubmit={handleAddNationalitySubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">

        <h1 className="text-2xl font-bold mb-6">Nationalities</h1>

        <DataTable<Nationality>
            data={nationalities}
            columns={nationalityColumns}
            actionConfig={actionConfig}
            searchConfig={searchConfig}
            statusConfig={statusConfig}
            bulkDeleteMutation={deleteNationality as any}
        />

      </div>
    </React.Fragment>
  );
}
