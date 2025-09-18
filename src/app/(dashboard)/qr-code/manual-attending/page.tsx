"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import CrudForm from "@/components/crud-form";
import { z } from "zod";
import { Field } from "@/app/interface";
import {
  useGetAllParticipantsQuery,
} from "@/service/Api/participants";
import {
  useGetBootcampsQuery,
  useRegisterBootcampAttendeeMutation,
} from "@/service/Api/bootcamp";
import { useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

// Validation schema
const manualAttendingSchema = z.object({
  participant_uuid: z.string().min(1, "Please select a participant"),
  registration_type: z.string().min(1, "Please select registration type"),
});

export default function ManualAttendingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false); // Closed by default

  // Queries and mutations
  const { data: participantsData } = useGetAllParticipantsQuery();
  const { data: bootcampsData } = useGetBootcampsQuery();
  const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
  const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();

  // Form fields
  const fields: Field[] = [
    {
      name: "participant_uuid",
      type: "command" as any,
      label: "Select Participant",
      placeholder: "Search by UUID...",
      options: participantsData?.data?.map((participant) => ({
        value: participant.uuid,
        label: `${participant.name_en}`,
        searchableText: participant.uuid, // Search by UUID only
      })) || [],
    },
    {
      name: "registration_type",
      type: "select",
      label: "Registration Type",
      placeholder: "Select registration type",
      options: [
        { value: "bootcamp", label: "Bootcamp Registration" },
        { value: "workshop", label: "Workshop Registration" },
      ],
    },
  ];

  const handleFormSubmit = async (data: any) => {
    try {
      const { participant_uuid, registration_type } = data;

      if (registration_type === "bootcamp") {
        // Bootcamp registration
        if (!bootcampsData?.data || bootcampsData.data.length === 0) {
          toast.error("No bootcamps available");
          return;
        }

        const firstBootcamp = bootcampsData.data[0];
        await registerBootcampAttendee({
          bootcamp_details_id: Number(firstBootcamp.id),
          bootcamp_participant_uuid: participant_uuid,
          category: "1",
          attendance_status: "attended",
        }).unwrap();

        toast.success("Bootcamp registration successful", {
          description: "Participant has been registered for the bootcamp.",
        });
      } else if (registration_type === "workshop") {
        // Workshop registration
        await checkInWorkshopParticipant({
          bootcamp_participant_uuid: participant_uuid,
        }).unwrap();

        toast.success("Workshop registration successful", {
          description: "Participant has been registered for the workshop.",
        });
      }
    } catch (err: any) {
      const errorMessage = err?.data?.msg || err?.data?.message || "Registration failed";
      toast.error("Registration Failed", {
        description: errorMessage,
      });
      throw err; // Re-throw to prevent form from closing
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Manual Attending
        </h1>
        <p className="text-muted-foreground">
          Search for a participant by UUID and select registration type
        </p>
      </div>

      {/* Manual Attendee Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Manual Attendee
        </Button>
      </div>

      {/* Form */}
      <CrudForm
        fields={fields}
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        operation="add"
        asDialog={true} // Show as dialog
        validationSchema={manualAttendingSchema}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
