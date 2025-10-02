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
} from "@/service/Api/hackathon/form-options/mentorShipNeeded";
import { MentorShipNeeded } from "@/types/hackthon/form-options/mentorShipNeeded";
import { mentorshipValidationSchema } from "@/validations/hackthon/form-options/mentorship";
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
    className: "sm:w-50  mb-9 sm:mb-9"
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
  if (mentorshipError) {
  const status = (mentorshipError as any)?.status || 500;
  const message =
    (mentorshipError as any)?.data?.message ||
    "Failed to fetch mentorships. Please try again.";
  return <Error status={status} message={message} />;
}

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

         <div className="px-3 py-2 sm:px-5 sm:py-9">
        <h1 className="text-2xl font-bold mb-4">Mentorships</h1>

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
