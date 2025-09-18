"use client";

import React, { useEffect, useState } from "react";
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
import { useGetAllEducationalLevelsQuery } from "@/service/Api/educationalLevels";
import { useGetAllFieldsOfStudyQuery } from "@/service/Api/fieldsOfStudy";
import { useGetAllSkillsQuery } from "@/service/Api/skills";
import { FieldOption } from "@/app/interface";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllWorkshopsQuery } from "@/service/Api/workshops";

export default function ParticipantsPage() {
  const { toast } = useToast(); //  هنا جوه الـ component

  const {
    data: participantsData,
    isLoading,
    error,
  } = useGetAllParticipantsQuery();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (participantsData?.data) {
      setParticipants(participantsData.data);
    }
  }, [participantsData]);

  const { data: eduLevelsData } = useGetAllEducationalLevelsQuery();
  const { data: fieldsData } = useGetAllFieldsOfStudyQuery();
  const { data: skillsData } = useGetAllSkillsQuery();

  const educationalLevelOptions: FieldOption[] =
    eduLevelsData?.data?.map((lvl: any) => ({
      value: lvl.id.toString(),
      label: lvl.name,
    })) ?? [];

  const fieldOfStudyOptions: FieldOption[] =
    fieldsData?.data?.map((f: any) => ({
      value: f.id.toString(),
      label: f.name,
    })) ?? [];

  const skillsOptions: FieldOption[] =
    skillsData?.data?.map((s: any) => ({
      value: s.id.toString(),
      label: s.name,
    })) ?? [];

  const { data: workshopsData } = useGetAllWorkshopsQuery();

  const workshopOptions: FieldOption[] =
    workshopsData?.data?.map((w: any) => ({
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
      const result = await addParticipant(formData).unwrap();

      if (result.data) {
        setParticipants((prev) => [...prev, result.data]);

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

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading participants</div>;

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-6">Participants</h1>

      <DataTable<Participant>
        data={participants}
        columns={participantColumns}
        searchConfig={searchConfig}
        actionConfig={actionConfig}
        onDataChange={setParticipants}
        enableBulkEmail={true}
        enableSelection={true}
        columnVisibilityConfig={columnVisibilityConfig}
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
          onSubmit={handleAddParticipant as any}
          steps={[1, 2, 3, 4, 5]}
        />
      )}
    </div>
  );
}
