"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../../../../components/loading/loading";
import DataTable from "../../../../../components/table/data-table";
import CrudForm from "../../../../../components/crud-form";
import { Button } from "../../../../../components/ui/button";
import { Cake, ChevronLeft, IdCard, Mail, Phone } from "lucide-react";
import { FieldValues } from "react-hook-form";

import {
  useGetPreferencesByParticipantQuery,
  useAddNewPreferenceMutation,
} from "@/service/Api/preferences";
import {
  preferenceColumns,
  getPreferenceFields,
} from "./_components/columns/preferenceColumns";

import { ParticipantPreferenceSchema } from "@/validations/preference";
import { Workshop } from "@/types/workshop";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../components/ui/tabs";
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
} from "./_components/columns/assignmentColumns";
import {
  useAddNewParticipantMutation,
  useGetParticipantDetailsQuery,
} from "@/service/Api/participants";
import InfoCard from "./_components/InfoCard";
import DocumentCard from "./_components/DocumentCard";
import Image from "next/image";
import { Label } from "../../../../../components/ui/label";
import { Badge } from "../../../../../components/ui/badge";
import { formatDate } from "@/lib/utils";
import PreferencesTab from "./_components/tabs/preferences";
import AssignmentsTab from "./_components/tabs/assignments";
import DetailsTab from "./_components/tabs/details";
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

  // -------------------- Details --------------------
  const {
    data: participantDetails,
    isLoading: isLoadingParticipantDetails,
    isError: isErrorParticipantDetails,
  } = useGetParticipantDetailsQuery(participantId);

  // -------------------- Workshops Options --------------------
  const { data: workshopsData } = useGetAllWorkshopsQuery();
  const workshopOptions: FieldOption[] =
    workshopsData?.data?.map((w: Workshop) => ({
      value: w.id.toString(),
      placeholder: w.title ?? "",
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

      await addNewAssignment(payload as any).unwrap();
      setIsAssignFormOpen(false);
    } catch (error) {
      console.error("Error adding assignment:", error);
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

  if (prefLoading || assignLoading || isLoadingParticipantDetails)
    return <Loading />;
  if (prefError)
    return <div className="text-red-500">Error loading preferences</div>;
  if (assignError)
    return <div className="text-red-500">Error loading assignments</div>;

  console.log(participantDetails);
  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
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
// function Section({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold mb-3 pb-2 border-b">{title}</h3>
//       {children}
//     </div>
//   );
// }
