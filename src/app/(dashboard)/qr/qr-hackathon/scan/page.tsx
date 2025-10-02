"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, QrCode, User } from "lucide-react";
import {
  useRegisterHackathonGuestMutation,
  useRegisterHackathonJudgeMutation,
  useRegisterHackathonMemberMutation,
  useRegisterHackathonMentorMutation,
  useRegisterHackathonVipMutation,
  useRegisterHackathonVolunteerMutation,
} from "@/service/Api/hackathon/attending";
import Loading from "@/components/loading/loading";
import Link from "next/link";
import { capitalize } from "@/lib/utils";

const QrScanner = dynamic(() => import("@/components/scanner/QrScanner"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-64 w-64 rounded-xl bg-gray-700 animate-pulse" />
        <div className="text-white text-xl">Loading scanner...</div>
      </div>
    </div>
  ),
});

const attendeeTypes = [
  "member",
  "volunteer",
  "judge",
  "mentor",
  "vip",
  "guest",
];

export default function HackathonScanPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [memberId, setMemberId] = useState<string>("");
  const [attendeeType, setAttendeeType] = useState<string>("");

  // hooks
  const [registerMember, { isLoading: memberLoading }] =
    useRegisterHackathonMemberMutation();
  const [registerVip, { isLoading: vipLoading }] =
    useRegisterHackathonVipMutation();
  const [registerJudge, { isLoading: judgeLoading }] =
    useRegisterHackathonJudgeMutation();
  const [registerMentor, { isLoading: mentorLoading }] =
    useRegisterHackathonMentorMutation();
  const [registerGuest, { isLoading: guestLoading }] =
    useRegisterHackathonGuestMutation();
  const [volunteerGuest, { isLoading: volunteerLoading }] =
    useRegisterHackathonVolunteerMutation();

  useEffect(() => setIsClient(true), []);

  // map attendeeType -> correct mutation fn
  const mutationMap: Record<string, (args: any) => Promise<any>> = {
    member: registerMember,
    volunteer: volunteerGuest, // ⚠️ you can create separate volunteer mutation if exists
    judge: registerJudge,
    mentor: registerMentor,
    vip: registerVip,
    guest: registerGuest,
  };

  const isLoading =
    memberLoading ||
    vipLoading ||
    judgeLoading ||
    mentorLoading ||
    guestLoading ||
    volunteerLoading;

  const handleScanSuccess = async (scannedData: string) => {
    const scannedId = Number(scannedData.trim());
    if (isNaN(scannedId)) {
      toast.error(`${attendeeType} ID must be a number`);
      return;
    }

    try {
      const mutateFn = mutationMap[attendeeType.toLowerCase()];
      if (!mutateFn) {
        toast.error("Unknown attendee type");
        return;
      }

      await mutateFn({ uuid: scannedId }).unwrap();

      toast.success(`${capitalize(attendeeType)} attended successfully`, {
        description: `${capitalize(
          attendeeType
        )} ID ${scannedId} has been marked for the hackathon.`,
      });

      setShowScanner(false);
      setMemberId("");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.data?.msg || "Registration failed";
      toast.error("Hackathon Attendance Failed", { description: errorMessage });
    }
  };

  const handleScanError = (errorMessage: string) => {
    setShowScanner(false);
    toast.error("Scan error", { description: errorMessage });
  };

  return (
    <div className="space-y-6 py-8 px-8">
      <h1 className="text-3xl font-bold mb-8">Hackathon QR Scan</h1>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendeeTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="capitalize">Hackathon {type}</CardTitle>
                <CardDescription>Scan QR code to mark </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Click the button below to start scanning {type} QR codes.</p>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 max-[450px]:grid-cols-1">
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowScanner(true);
                    setAttendeeType(type);
                  }}
                  disabled={isLoading}
                >
                  <QrCode className="mr-2 h-4 w-4" /> Scan
                </Button>

                <Link
                  className="w-full"
                  href={`/hackathon/attendance?b=${type}`}
                >
                  <Button className="w-full" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    <p>Attendees</p>
                    <ChevronRight />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {isClient && showScanner && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onError={handleScanError}
          onClose={() => setShowScanner(false)}
        />
      )}

      {isLoading && <Loading />}
    </div>
  );
}
