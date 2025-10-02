"use client"
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";
import Loading from "@/components/loading/loading";
import CrudForm from "@/components/crud-form";

import { studyLevelColumns, getStudyLevelFields } from "./columns";
import {
  useGetstudylevelQuery,
  useAddStudtyLevelMutation,
  useDeleteStudtyLevelMutation,
} from "@/service/Api/hackathon/form-options/studyLevel";
import { StudyLevel } from "@/types/hackthon/form-options/studyLevels";
import { studyLevelValidationSchema } from "@/validations/hackthon/form-options/studylevel"
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";

export default function StudyLevels() {
  const {
    data: studyLevelsData,
    isLoading: isLoadingStudyLevels,
    error: studyLevelsError,
  } = useGetstudylevelQuery();

  const [isOpen, setIsOpen] = useState(false);

  const [deleteStudyLevel] = useDeleteStudtyLevelMutation();
  const [addStudyLevel] = useAddStudtyLevelMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title",
    searchKeys: ["title"],
  className: "sm:w-64 mb-9 sm:mb-9"
    
     
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Study Level",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  const handleAddStudyLevelSubmit = async (data: FieldValues) => {
    try {
      console.log("Submitting Study Level data:", data);
      const result = await addStudyLevel(data).unwrap();

      console.log("Study level added successfully:", result);
      toast.success("Study level added successfully!");
    } catch (error) {
      console.error("Error adding study level:", error);
      toast.error(
        (error as any).data?.message ||
          "Failed to add study level. Please try again."
      );
      throw error;
    }
  };

if (isLoadingStudyLevels) return <Loading />;

if (studyLevelsError) {
  const status = (studyLevelsError as any)?.status || 500;
  const message =
    (studyLevelsError as any)?.data?.message ||
    "Failed to fetch study levels. Please try again.";

  return <Error status={status} message={message} />;
}




  return (
    <React.Fragment>
       {isOpen && (
        <CrudForm
          fields={getStudyLevelFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={studyLevelValidationSchema}
          onSubmit={handleAddStudyLevelSubmit}
        />
      )}

      <div className="px-3 py-2 sm:px-5 sm:py-9">
        <h1 className="text-2xl font-bold mb-4">Study Levels</h1>

        <DataTable<StudyLevel>
          data={studyLevelsData?.data ?? []}
          columns={studyLevelColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteStudyLevel}
        />
      </div>
      
      
    </React.Fragment>
  );
}
