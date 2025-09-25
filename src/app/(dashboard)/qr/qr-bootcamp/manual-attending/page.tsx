"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserCheck, Calendar, Loader2 } from "lucide-react";
import {
  useGetBootcampsQuery,
  useRegisterBootcampAttendeeMutation,
} from "@/service/Api/bootcamp";
import { useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";

export default function ManualAttendingPage() {
  const [participantUUID, setParticipantUUID] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: bootcampsData } = useGetBootcampsQuery();
  const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
  const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();

  const handleBootcamp = async () => {
    if (!participantUUID.trim()) {
      toast.error("Please enter participant UUID");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      const firstBootcamp = bootcampsData?.data[0];
      await registerBootcampAttendee({
        bootcamp_details_id: Number(firstBootcamp?.id),
        bootcamp_participant_uuid: participantUUID,
        category: "1",
        attendance_status: "attended",
      }).unwrap();

      toast.success("Bootcamp registration successful", {
        description: `Participant ${participantUUID} has been attended for the bootcamp.`,
      });
      setParticipantUUID("");
    } catch (err: any) {
      const errorMessage =
        err?.data?.msg ||
        err?.data?.message ||
        err?.message ||
        "Registration failed";
      toast.error("Registration Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshop = async () => {
    if (!participantUUID.trim()) {
      toast.error("Please enter participant UUID");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await checkInWorkshopParticipant({
        bootcamp_participant_uuid: participantUUID,
      }).unwrap();

      toast.success("Workshop registration successful", {
        description: `Participant ${participantUUID} has been attended for the workshop.`,
      });
      setParticipantUUID("");
    } catch (err: any) {
      const errorMessage =
        err?.data?.msg || err?.data?.message || "Registration failed";
      toast.error("Registration Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manual Attending
          </h1>
          <p className="text-muted-foreground">
            Enter the participant UUID and select registration type
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            {/* Input Field */}
            <div className="space-y-2">
              <label
                htmlFor="uuid"
                className="text-sm font-medium text-foreground"
              >
                Participant UUID
              </label>
              <Input
                id="uuid"
                placeholder="Enter UUID (e.g., 3064)"
                value={participantUUID}
                onChange={(e) => setParticipantUUID(e.target.value)}
                className="text-center font-mono"
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleBootcamp}
                disabled={loading}
                className="h-12 text-base"
                variant="default"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                Register for Bootcamp
              </Button>

              <Button
                onClick={handleWorkshop}
                disabled={loading}
                className="h-12 text-base"
                variant="secondary"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Register for Workshop
              </Button>
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Make sure the participant UUID is correct before registration
          </p>
        </div>
      </div>
    </div>
  );
}
