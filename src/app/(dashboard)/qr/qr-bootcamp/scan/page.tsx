"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
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
  useGetBootcampsQuery,
  useRegisterBootcampAttendeeMutation,
} from "@/service/Api/bootcamp";
import { useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";

import { BootcampType } from "@/types/bootcamp";
import Loading from "@/components/loading/loading";
import Link from "next/link";
import { useAppSelector } from "@/service/store/store";
import { UserRole } from "@/types/auth.types";

const QrScanner = dynamic(() => import("@/components/scanner/QrScanner"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-64 w-64 rounded-xl bg-gray-700" />
        <div className="text-white text-xl">Loading scanner...</div>
      </div>
    </div>
  ),
});

type ScanType =
  | { type: "bootcamp"; bootcamp: BootcampType }
  | { type: "workshop" }
  | null;

export default function ScanQrCodePage() {
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scanFor, setScanFor] = useState<ScanType>(null);

  // Get user role from Redux store
  const userRole = useAppSelector((state) => state.auth.role) as UserRole;

  // Conditionally fetch data based on user role
  const shouldFetchBootcamps = userRole === 'Admin' || userRole === 'logistics' || userRole === 'registeration';
  const shouldShowWorkshops = userRole === 'Admin' || userRole === 'logistics' || userRole === 'registeration';

  const { data: bootcampsData, isLoading: isLoadingBootcamps } =
    useGetBootcampsQuery(undefined, {
      skip: !shouldFetchBootcamps
    });

  const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
  const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();

  useEffect(() => setIsClient(true), []);

  const handleScanSuccess = async (scannedData: string) => {
    if (!scanFor) return;

    const participantUuid = String(scannedData).trim();

    try {
      let result;
      if (scanFor.type === "bootcamp") {
        result = await registerBootcampAttendee({
          bootcamp_details_id: Number(scanFor.bootcamp.id),
          bootcamp_participant_uuid: participantUuid,
          category: "1",
          attendance_status: "attended",
        }).unwrap();
        toast.success("Bootcamp registration successful", {
          description: "Participant has been registered for the bootcamp.",
        });
      } else if (scanFor.type === "workshop") {
        result = await checkInWorkshopParticipant({
          bootcamp_participant_uuid: participantUuid,
        }).unwrap();
        toast.success("Workshop check-in successful", {
          description: result.message || "Participant checked in successfully.",
        });
      }
    } catch (err: unknown) {
      const apiErr = err as { data?: { msg?: string; message?: string } };
      const errorMessage =
        apiErr?.data?.msg || apiErr?.data?.message || `An error occurred.`;

      let errorTitle = "Operation failed";
      if (scanFor?.type === "bootcamp") {
        errorTitle = "Bootcamp Registration Failed";
      } else if (scanFor?.type === "workshop") {
        errorTitle = "Workshop Check-in Failed";
      }

      toast.error(errorTitle, {
        description: errorMessage,
      });
    }
  };

  const handleScanError = (errorMessage: string) => {
    setShowScanner(false);
    toast.error("Scan error", {
      description: errorMessage,
    });
  };

  const openScanner = (scanType: ScanType) => {
    setScanFor(scanType);
    setShowScanner(true);
  };

  if (isLoadingBootcamps) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 py-8 px-8">
      <h1 className="text-3xl font-bold mb-8">Bootcmap & Workshops Scan QR</h1>

      {/* Bootcamp Section - Only for Admin, Logistics, Registration */}
      {shouldFetchBootcamps && bootcampsData && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bootcamp Card */}
            {bootcampsData?.data.map((bootcamp, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>Bootcamp</CardTitle>
                  <CardDescription>{bootcamp.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Total Capacity: {bootcamp.total_capacity}</p>
                  <p>Date: {new Date(bootcamp.date).toLocaleDateString()}</p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 max-[450px]:grid-cols-1">
                  <Button
                    className="w-full"
                    onClick={() => openScanner({ type: "bootcamp", bootcamp })}
                  >
                    <QrCode className="mr-2 h-4 w-4" /> Scan
                  </Button>
                  <Link
                    className="w-full"
                    href={`/bootcamp/bootcamps/${bootcamp.id}`}
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
            {/* Workshop Card */}
            {shouldShowWorkshops && (
              <Card>
                <CardHeader>
                  <CardTitle>Workshop</CardTitle>
                  <CardDescription>
                    Scan QR code for workshop attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Click the button to start scanning participant QR codes for the
                    workshops.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => openScanner({ type: "workshop" })}
                  >
                    <QrCode className="mr-2 h-4 w-4" /> Scan
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </section>
      )}

      {isClient && showScanner && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onError={handleScanError}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
