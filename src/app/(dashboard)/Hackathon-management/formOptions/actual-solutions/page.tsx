"use client";

import { useState } from "react";
import { useGetActualSolutionsQuery } from "@/service/Api/hackathon/actualSolutions";
import { ActualSolution } from "@/types/hackathon/actualSolutions";
import { columns } from "./_components/columns";
import CrudForm from "@/components/crud-form";
import { fields } from "./_components/fields";
import { actualSolutionsSchema } from "@/validations/hackathon/actualSolutionsSchema";
import DataTable from "@/components/table/data-table";

export default function ActualSolutionsPage() {
  const { data, isLoading } = useGetActualSolutionsQuery();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Actual Solutions</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Solution
      </button>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        onAdd={() => setIsOpen(true)}
      />

      <CrudForm
        operation="add"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fields={fields}
        validationSchema={actualSolutionsSchema}
        onSubmit={(values) => console.log("submit", values)}
      />
    </div>
  );
}
