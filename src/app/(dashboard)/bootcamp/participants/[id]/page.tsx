"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FieldValues } from "react-hook-form";

import {
  useGetPreferencesByParticipantQuery,
  useAddNewPreferenceMutation,
} from "@/service/Api/preferences";
import {
  preferenceColumns,
  getPreferenceFields,
} from "./_components/preferenceColumns";

import { ParticipantPreferenceSchema } from "@/validations/preference";
import { Workshop } from "@/types/workshop";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetAllWorkshopsQuery } from "@/service/Api/workshops";
import { FieldOption } from "@/app/interface";

import { AssignmentSchema } from "@/validations/assignment";
import {
  useGetAssignmentsByParticipantQuery,
  useAddNewAssignmentMutation,
} from "@/service/Api/assignment";
import {
  assignmentColumns,
  getAssignmentFields,
} from "./_components/assignmentColumns";

export default function ParticipantPreferencesPage() {
  const { id } = useParams();
  const router = useRouter();
  const participantId = Number(id);

  // -------------------- Preferences --------------------
  const {
    data: prefData,
    isLoading: prefLoading,
    error: prefError,
  } = useGetPreferencesByParticipantQuery(participantId, {
    skip: !participantId,
  });
  const [preferences, setPreferences] = useState<any[]>([]);
  const [isPrefFormOpen, setIsPrefFormOpen] = useState(false);
  const [addNewPreference] = useAddNewPreferenceMutation();

  // -------------------- Assignments --------------------
  const {
    data: assignData,
    isLoading: assignLoading,
    error: assignError,
  } = useGetAssignmentsByParticipantQuery(participantId, {
    skip: !participantId,
  });
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [addNewAssignment] = useAddNewAssignmentMutation();

  // // -------------------- Workshops Options --------------------
  // const { data: workshopsData } = useGetAllWorkshopsQuery();
  // const workshopOptions: FieldOption[] =
  //   workshopsData?.data?.map((w: Workshop) => ({
  //     value: w.id.toString(),
  //     placeholder: w.id.toString(),
  //   })) ?? [];

  // -------------------- Effects --------------------
  useEffect(() => {
    if (prefData) setPreferences(prefData);
  }, [prefData]);

  useEffect(() => {
    if (assignData) setAssignments(assignData);
  }, [assignData]);

  // -------------------- Handlers --------------------
  const handleAddPreference = async (formData: FieldValues) => {
    try {
      const payload = {
        bootcamp_participant_id: participantId,
        workshop_id: Number(formData.workshop_id),
        preference_order: Number(formData.preference_order),
      };

      const result = await addNewPreference(payload as any).unwrap();
      setPreferences((prev) => [...prev, result]);
      setIsPrefFormOpen(false);
    } catch (error) {
      console.error("Error adding preference:", error);
    }
  };

  const handleAddAssignment = async (formData: FieldValues) => {
    try {
      const payload = {
        bootcamp_participant_id: participantId,
        workshop_schedule_id: Number(formData.workshop_schedule_id),
        attendance_status: formData.attendance_status,
        check_in_time: formData.check_in_time,
      };

      const result = await addNewAssignment(payload as any).unwrap();
      setAssignments((prev) => [...prev, result]);
      setIsAssignFormOpen(false);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  if (prefLoading || assignLoading) return <Loading />;
  if (prefError)
    return <div className="text-red-500">Error loading preferences</div>;
  if (assignError)
    return <div className="text-red-500">Error loading assignments</div>;

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <h1 className="text-2xl font-bold mb-6">Participant Preferences</h1>
          <DataTable
            data={preferences}
            columns={preferenceColumns}
            searchConfig={{ enabled: false }}
            statusConfig={{ enabled: false }}
            actionConfig={{
              enabled: true,
              showAdd: true,
              showDelete: true,
              addButtonText: "Add Preference",
              onAdd: () => setIsPrefFormOpen(true),
            }}
            onDataChange={setPreferences}
          />

          {isPrefFormOpen && (
            <CrudForm
              fields={getPreferenceFields()}
              isOpen={isPrefFormOpen}
              setIsOpen={setIsPrefFormOpen}
              operation="add"
              asDialog={true}
              validationSchema={ParticipantPreferenceSchema}
              onSubmit={handleAddPreference}
            />
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <h1 className="text-2xl font-bold mb-6">Participant Assignments</h1>
          <DataTable
            data={assignments}
            columns={assignmentColumns}
            searchConfig={{ enabled: false }}
            statusConfig={{ enabled: false }}
            actionConfig={{
              enabled: true,
              showAdd: true,
              showDelete: true,
              addButtonText: "Add Assignment",
              onAdd: () => setIsAssignFormOpen(true),
            }}
            onDataChange={setAssignments}
          />

          {isAssignFormOpen && (
            <CrudForm
              fields={getAssignmentFields()}
              isOpen={isAssignFormOpen}
              setIsOpen={setIsAssignFormOpen}
              operation="add"
              asDialog={true}
              validationSchema={AssignmentSchema}
              onSubmit={handleAddAssignment}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
