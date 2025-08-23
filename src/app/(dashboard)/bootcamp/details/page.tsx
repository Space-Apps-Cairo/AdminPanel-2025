"use client";

import { useState } from "react";
import {
  useGetBootcampsQuery,
  useAddBootcampMutation,
} from "@/service/Api/bootcamp";

import { BootcampType, BootcampRequest } from "@/types/bootcamp";
import {
  bootcampColumns,
  getBootcampFields,
} from "./_components/columns/columns";
import DataTable from "../../../../components/table/data-table";
import CrudForm from "../../../../components/bootcamp/bootcamp-crud-form";
import Loading from "../../../../components/loading/loading";
import { BootcampSchema } from "@/validations/bootcamp";

export default function BootcampPage() {
  // const { data = [], isLoading, error } = useGetBootcampsQuery(); // The Error ❌
  const { data, isLoading, error } = useGetBootcampsQuery(); // The Error ❌
  const bootcamps = data?.data ?? []; // The right one
  const [addBootcamp] = useAddBootcampMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleAddSubmit = async (values: BootcampRequest) => {
    try {
      await addBootcamp(values).unwrap();
      setIsOpen(false);
      console.log("Bootcamp created successfully");
    } catch (err) {
      console.error("Failed to add bootcamp:", err);
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 p-4">Error fetching bootcamps</div>;

  return (
    <div className="container mx-auto py-6">
      {isOpen && (
        <CrudForm
          fields={getBootcampFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog
          validationSchema={BootcampSchema}
          // steps={[1, 2]}
          onSubmit={handleAddSubmit}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Bootcamps</h1>

      <DataTable<BootcampType>
        data={bootcamps}
        columns={bootcampColumns}
        searchConfig={{
          enabled: true,
          placeholder: "Search by name or date",
          searchKeys: ["name", "date"],
        }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Bootcamp",
          onAdd: () => setIsOpen(true),
        }}
        onDataChange={() => {}}
      />
    </div>
  );
}
