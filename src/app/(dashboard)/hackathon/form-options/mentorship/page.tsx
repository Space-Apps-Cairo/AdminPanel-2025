"use client";

import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";

import { mentorshipColumns, getMentorshipFields } from "./columns";
import {
  useAddMentorShipMutation,useGetMentorShipQuery,
} from "@/service/Api/mentorShipNeeded";
import { MentorShipNeeded } from "@/types/mentorShipNeeded";
import { mentorshipValidationSchema } from "@/validations/mentorship";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";

export default function Mentorships() {
  const {
    data: mentorshipData,
    isLoading: isLoadingMentorship,
    error: mentorshipError,
  } = useGetMentorShipQuery();

  const [isOpen, setIsOpen] = useState(false);

  const [addMentorship] =  useAddMentorShipMutation();

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
    addButtonText: "Add Mentorship",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const handleAddMentorshipSubmit = async (data: FieldValues) => {
    try {
      console.log("Submitting Mentorship data:", data);
      const result = await addMentorship(data).unwrap();

      console.log("Mentorship added successfully:", result);
      toast.success("Mentorship added successfully!");
    } catch (error) {
      console.error("Error adding mentorship:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add mentorship. Please try again."
      );
      throw error;
    }
  };

  if (isLoadingMentorship) return <Loading />;
  if (mentorshipError) return <Error />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getMentorshipFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={mentorshipValidationSchema}
          onSubmit={handleAddMentorshipSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Mentorships</h1>

        <DataTable<MentorShipNeeded>
          data={mentorshipData?.data ?? []}
          columns={mentorshipColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
    </React.Fragment>
  );
}
