"use client";

import { useState } from "react";
import {
  useGetBootcampsQuery,
  useAddBootcampMutation,
  useDeleteBootcampMutation,
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
import { toast } from "sonner";

export default function BootcampPage() {
  // const { data = [], isLoading, error } = useGetBootcampsQuery(); // The Error ❌
  const { data, isLoading, error } = useGetBootcampsQuery(); // The Error ❌
  const [isOpen, setIsOpen] = useState(false);
  const bootcamps = data?.data ?? []; // The right one

  const [addBootcamp] = useAddBootcampMutation();
  const [deleteBootcamp] = useDeleteBootcampMutation();

  const handleAddSubmit = async (values: BootcampRequest) => {
    try {
      await addBootcamp(values).unwrap();
      setIsOpen(false);
      toast.success("Bootcamp created successfully");
      console.log("Bootcamp created successfully");
    } catch (err) {
      toast.error("Failed to add bootcamp", {
        description: err.message,
      });
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
        onDeleteRows={deleteBootcamp}
      />
    </div>
  );
}
