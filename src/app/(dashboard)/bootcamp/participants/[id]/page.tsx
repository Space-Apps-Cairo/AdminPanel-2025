"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import CrudForm from "@/components/crud-form";
import { Button } from "@/components/ui/button";
import { Cake, ChevronLeft, IdCard, Mail, Phone } from "lucide-react";
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
import {
  useAddNewParticipantMutation,
  useGetParticipantDetailsQuery,
} from "@/service/Api/participants";
import InfoCard from "./_components/InfoCard";
import DocumentCard from "./_components/DocumentCard";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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

  // Details
  const {
    data: participantDetails,
    isLoading: isLoadingParticipantDetails,
    isError: isErrorParticipantDetails,
  } = useGetParticipantDetailsQuery(participantId);

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

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="flex gap-5">
          <TabsTrigger value="details" className="px-5">
            Details
          </TabsTrigger>
          <TabsTrigger value="preferences" className="px-5">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="assignments" className="px-5">
            Assignments
          </TabsTrigger>
        </TabsList>

        {/* Partipant Details */}
        <TabsContent value="details" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Participant Details</h1>

            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary">
                    {/* <Image
                      src={participantDetails?.personal_photo}
                      alt="Profile photo"
                      fill
                      className="object-cover"
                      // Remove if you have proper image optimization setup
                    /> */}
                  </div>
                  <h2 className="text-xl font-semibold">
                    {participantDetails?.name_en}
                  </h2>
                  <p className="text-gray-600">{participantDetails?.name_ar}</p>
                </div>
              </div>

              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    label="Email"
                    value={participantDetails?.email}
                    icon={<Mail className="w-5 h-5" />}
                  />
                  <InfoCard
                    label="Phone"
                    value={participantDetails?.phone_number}
                    icon={<Phone className="w-5 h-5" />}
                  />
                  <InfoCard
                    label="Birth Date"
                    value={formatDate(participantDetails?.birth_date)}
                    icon={<Cake className="w-5 h-5" />}
                  />
                  <InfoCard
                    label="National ID"
                    value={participantDetails?.national_id}
                    icon={<IdCard className="w-5 h-5" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    label="Nationality"
                    value={participantDetails?.nationality}
                  />
                  <InfoCard
                    label="Governorate"
                    value={participantDetails?.governorate}
                  />
                </div>
              </div>
            </div>

            {/* ID Documents Section */}
            <Section title="Identification Documents">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard
                  title="National ID Front"
                  url={participantDetails?.national_id_front}
                />
                <DocumentCard
                  title="National ID Back"
                  url={participantDetails?.national_id_back}
                />
              </div>
            </Section>

            {/* Educational Information Section */}
            <Section title="Educational Background">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  label="Institute"
                  value={participantDetails?.educational_institute}
                />
                <InfoCard
                  label="Graduation Year"
                  value={participantDetails?.graduation_year}
                />
                <InfoCard
                  label="Educational Level"
                  value={participantDetails?.educational_level_id}
                />
                <InfoCard
                  label="Field of Study"
                  value={participantDetails?.field_of_study_id}
                />
              </div>
            </Section>

            {/* Participation Details Section */}
            <Section title="Participation Information">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard
                  label="Current Occupation"
                  value={participantDetails?.current_occupation}
                />
                <InfoCard
                  label="Participation Status"
                  value={participantDetails?.participation_status}
                />
                <InfoCard
                  label="Participated Years"
                  value={participantDetails?.participated_years}
                />
                <InfoCard
                  label="Has Team"
                  value={
                    participantDetails?.is_have_team === "individual"
                      ? "No"
                      : "Yes"
                  }
                />
                <InfoCard
                  label="Attending Workshop"
                  value={participantDetails?.attend_workshop ? "Yes" : "No"}
                />
                <InfoCard label="Year" value={participantDetails?.year} />
              </div>
            </Section>

            {/* Skills Section */}
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {participantDetails?.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant={
                      skill.type === "Technical" ? "default" : "secondary"
                    }
                    className="px-3 py-1 text-sm"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </Section>

            {/* Additional Information Section */}
            <Section title="Additional Information">
              <div className="space-y-4">
                <div>
                  <Label>Why this workshop?</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {participantDetails?.why_this_workshop}
                  </p>
                </div>
                <div>
                  <Label>Comments</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {participantDetails?.comment}
                  </p>
                </div>
              </div>
            </Section>
          </div>
        </TabsContent>
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
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 pb-2 border-b">{title}</h3>
      {children}
    </div>
  );
}
