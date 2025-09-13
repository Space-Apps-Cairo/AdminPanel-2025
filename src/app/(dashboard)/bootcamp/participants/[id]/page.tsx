"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../../../../components/loading/loading";

import { Button } from "../../../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FieldValues } from "react-hook-form";

import {
  useGetPreferencesByParticipantQuery,
  useAddNewPreferenceMutation,
} from "@/service/Api/preferences";

import { Workshop } from "@/types/workshop";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../components/ui/tabs";
import { useGetAllWorkshopsQuery } from "@/service/Api/workshops";
import { FieldOption } from "@/app/interface";

import {
  useGetAssignmentsByParticipantQuery,
  useAddNewAssignmentMutation,
} from "@/service/Api/assignment";
import { assignmentColumns } from "./_components/columns/assignmentColumns";
import { useGetParticipantDetailsQuery } from "@/service/Api/participants";

import { formatDate } from "@/lib/utils";
import PreferencesTab from "./_components/tabs/preferences";
import AssignmentsTab from "./_components/tabs/assignments";
import DetailsTab from "./_components/tabs/details";
import { toast } from "sonner";
import Error from "@/components/Error/page";
export default function ParticipantPreferencesPage() {
  const { id } = useParams();
  const router = useRouter();
  const participantId = Number(id);

  // -------------------- Preferences --------------------
  const {
    data: prefData = [],
    isLoading: prefLoading,
    error: prefError,
  } = useGetPreferencesByParticipantQuery(participantId, {
    skip: !participantId,
  });
  const [isPrefFormOpen, setIsPrefFormOpen] = useState(false);
  const [addNewPreference] = useAddNewPreferenceMutation();

  // -------------------- Assignments --------------------
  const {
    data: assignData = [],
    isLoading: assignLoading,
    error: assignError,
  } = useGetAssignmentsByParticipantQuery(participantId, {
    skip: !participantId,
  });

  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [addNewAssignment] = useAddNewAssignmentMutation();
  const { data: workshopsData, isLoading: isLoadingWorkshopData } =
    useGetAllWorkshopsQuery();

  // -------------------- Details --------------------
  const {
    data: participantDetails,
    isLoading: isLoadingParticipantDetails,
    isError: isErrorParticipantDetails,
  } = useGetParticipantDetailsQuery(participantId);

  if (
    prefLoading ||
    assignLoading ||
    isLoadingParticipantDetails ||
    isLoadingWorkshopData
  )
    return <Loading />;
  if (assignError || prefError) return <Error />;
  // -------------------- Workshops Options --------------------
  const workshopOptions: FieldOption[] =
    workshopsData?.data?.map((w: Workshop) => ({
      value: w.id.toString(),
      label: w.title ?? "",
    })) ?? [];

  // -------------------- Handlers --------------------
  const handleAddPreference = async (formData: FieldValues) => {
    try {
      const payload = {
        bootcamp_participant_id: participantId,
        workshop_id: Number(formData.workshop_id),
        preference_order: Number(formData.preference_order),
      };

      await addNewPreference(payload as any).unwrap();
      setIsPrefFormOpen(false);
      toast.success("Preference created successfully");
    } catch (error) {
      const err = error as any;
      toast.error("Failed to add preference. Please try again.", {
        description: err?.message || err?.data?.message || "Unexpected error",
      });
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

      await addNewAssignment(payload as any).unwrap();
      setIsAssignFormOpen(false);
      toast.success("Assignment has been added successfully.");
    } catch (error) {
      const err = error as any;
      toast.error("Failed to add assignment. Please try again.", {
        description: err?.message || err?.data?.message || "Unexpected error",
      });
    }
  };

  //------------------tabs------------
  const tabs = [
    {
      label: "Details",
      value: "details",
      component: (
        <DetailsTab
          participantDetails={participantDetails}
          formatDate={formatDate}
        />
      ),
    },
    {
      label: "Preferences",
      value: "preferences",
      component: (
        <PreferencesTab
          prefData={prefData}
          workshopOptions={workshopOptions}
          handleAddPreference={handleAddPreference}
        />
      ),
    },
    {
      label: "Assignments",
      value: "assignments",
      component: (
        <AssignmentsTab
          assignData={assignData}
          assignmentColumns={assignmentColumns}
          handleAddAssignment={handleAddAssignment}
        />
      ),
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6 px-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
       Go Back
      </Button>
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
