"use client";

import { useState } from "react";
import {
  useGetAllSkillsQuery,
  useAddNewSkillMutation,
  useDeleteSkillMutation,
} from "@/service/Api/skills";

import { Skill } from "@/types/skill";
import { SkillSchema } from "@/validations/skill";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";
import { getSkillFields, skillColumns } from "./_components/coulmns";
import DataTable from "@/components/table/data-table";

export default function SkillsPage() {
  const { data, isLoading, error } = useGetAllSkillsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const skills = data?.data ?? [];

  const [addSkill] = useAddNewSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const handleAddSubmit = async (values: Partial<Skill>) => {
    try {
      await addSkill(values).unwrap();
      setIsOpen(false);
      toast.success("Skill created successfully");
    } catch (err) {
      toast.error("Failed to add skill", {
        description: err.message,
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 p-4">Error fetching skills</div>;

  return (
    <div className="py-6 px-8">
      {isOpen && (
        <CrudForm
          fields={getSkillFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog
          validationSchema={SkillSchema}
          onSubmit={handleAddSubmit}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Skills</h1>

      <DataTable<Skill>

        data={skills}
        columns={skillColumns}
        searchConfig={{
          enabled: true,
          placeholder: "Search by name or type",
          searchKeys: ["name", "type"],
        }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Skill",
          onAdd: () => setIsOpen(true),
        }}
        onDeleteRows={deleteSkill}
      />
    </div>
  );
}
