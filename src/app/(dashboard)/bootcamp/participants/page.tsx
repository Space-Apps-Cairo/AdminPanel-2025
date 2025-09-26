"use client";

import React, { useState, useCallback } from "react";
import {
  ActionConfig,
  ColumnVisibilityConfig,
  SearchConfig,
} from "@/types/table";
import DataTable from "../../../../components/table/data-table";
import {
  getParticipantsFields,
  participantColumns,
} from "./_components/coulmns";
import Loading from "../../../../components/loading/loading";
import CrudForm from "../../../../components/crud-form";
import {
  ParticipantFormValues,
  participantValidationSchema,
} from "@/validations/participantSchema";
import {
  useAddNewParticipantMutation,
  useGetAllParticipantsQuery,
} from "@/service/Api/participants";
import { Participant, ParticipantRequest } from "@/types/participants";
import { EducationalLevel, useGetAllEducationalLevelsQuery } from "@/service/Api/educationalLevels";
import { FieldOfStudy, useGetAllFieldsOfStudyQuery } from "@/service/Api/fieldsOfStudy";
import { Skill, useGetAllSkillsQuery } from "@/service/Api/skills";
import { FieldOption } from "@/app/interface";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllWorkshopsQuery } from "@/service/Api/workshops";
import { Workshop } from "@/types/workshop";
import { FieldValues } from "react-hook-form";

export default function ParticipantsPage() {
  const { toast } = useToast(); //  هنا جوه الـ component

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }
    params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage]);

  const {
    data: participantsData,
    isLoading,
    error,
  } = useGetAllParticipantsQuery(buildQueryString());

  const [isOpen, setIsOpen] = useState(false);


  const { data: eduLevelsData } = useGetAllEducationalLevelsQuery();
  const { data: fieldsData } = useGetAllFieldsOfStudyQuery();
  const { data: skillsData } = useGetAllSkillsQuery();

  const educationalLevelOptions: FieldOption[] =
    eduLevelsData?.data?.map((lvl: EducationalLevel) => ({
      value: lvl.id.toString(),
      label: lvl.name,
    })) ?? [];

  const fieldOfStudyOptions: FieldOption[] =
    fieldsData?.data?.map((f: FieldOfStudy) => ({
      value: f.id.toString(),
      label: f.name,
    })) ?? [];

  const skillsOptions: FieldOption[] =
    skillsData?.data?.map((s: Skill) => ({
      value: s.id.toString(),
      label: s.name,
    })) ?? [];

  const { data: workshopsData } = useGetAllWorkshopsQuery();

  const workshopOptions: FieldOption[] =
    workshopsData?.data?.map((w: Workshop) => ({
      value: w.id.toString(),
      label: w.title,
    })) ?? [];

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by Name, National ID, Email or Phone or UUID",
    searchKeys: ["national_id", "email", "phone_number", "name_en", "name_ar", "uuid"],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    addButtonText: "Add Participant",
    showExport: true,
    onAdd: () => setIsOpen(true),
  };

  const columnVisibilityConfig: ColumnVisibilityConfig = {
    enableColumnVisibility: true,
    invisibleColumns: [
      "is_have_team",
      "field_of_study_id",
      "birth_date",
      "governorate",
      "graduation_year",
      "current_occupation",
    ],
  };
  const [addParticipant] = useAddNewParticipantMutation();

  const handleAddParticipant = async (
    data: ParticipantFormValues,
    formData: FormData
  ) => {
    try {
      const result = await addParticipant(formData as unknown as ParticipantRequest).unwrap();

      if (result.data) {
        // setParticipants((prev: Participant[]) => [...prev, result.data]);

        //  Toast للنجاح
        toast({
          title: "Participant added",
          description: "The participant was added successfully ",
        });
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error adding participant:", error);

      //  Toast للخطأ
      toast({
        title: "Error",
        description: "Something went wrong while adding participant ",
        variant: "destructive",
      });
    }
  };

  const backendPagination = {
    enabled: true,
    currentPage: participantsData?.current_page || 1,
    totalPages: participantsData?.total_pages || 1,
    pageSize: Number(participantsData?.per_page) || 10,
    totalCount: participantsData?.count || 0,
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
    },
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading participants</div>;

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-6">Participants</h1>

      <DataTable<Participant>
        data={participantsData?.data || []}
        columns={participantColumns}
        searchConfig={searchConfig}
        actionConfig={actionConfig}
        enableBulkEmail={true}
        enableSelection={true}
        columnVisibilityConfig={columnVisibilityConfig}
        backendPagination={backendPagination}
        // allowTrigger={true}
      />

      {isOpen && (
        <CrudForm
          fields={getParticipantsFields(
            undefined,
            educationalLevelOptions,
            fieldOfStudyOptions,
            skillsOptions,
            workshopOptions
          )}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={participantValidationSchema}
          onSubmit={handleAddParticipant as unknown as (data: FieldValues, formData?: FormData) => Promise<void>}
          steps={[1, 2, 3, 4]}
        />
      )}
    </div>
  );
}
