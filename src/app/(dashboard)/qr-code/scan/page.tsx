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
  useGetAllCollectionsQuery,
  useAssignCollectionMutation,
} from "@/service/Api/materials";
import {
  useGetBootcampsQuery,
  useRegisterBootcampAttendeeMutation,
} from "@/service/Api/bootcamp";
import { useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";

import { Collection } from "@/types/materials";
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
  | { type: "collection"; collection: Collection }
  | null;

export default function ScanQrCodePage() {
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scanFor, setScanFor] = useState<ScanType>(null);

  // Get user role from Redux store
  const userRole = useAppSelector((state) => state.auth.role) as UserRole;

  // Conditionally fetch data based on user role
  const shouldFetchCollections = userRole === 'Admin' || userRole === 'material';
  const shouldFetchBootcamps = userRole === 'Admin' || userRole === 'logistics' || userRole === 'registeration';
  const shouldShowWorkshops = userRole === 'Admin' || userRole === 'logistics' || userRole === 'registeration';

  const { data: collectionsData, isLoading: isLoadingCollections } =
    useGetAllCollectionsQuery(undefined, {
      skip: !shouldFetchCollections
    });
  const { data: bootcampsData, isLoading: isLoadingBootcamps } =
    useGetBootcampsQuery(undefined, {
      skip: !shouldFetchBootcamps
    });

  const [assignCollection] = useAssignCollectionMutation();
  const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
  const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();

  useEffect(() => setIsClient(true), []);

  const handleScanSuccess = async (scannedData: string) => {
    if (!scanFor) return;

    const participantUuid = String(scannedData).trim();

    try {
      let result;
      if (scanFor.type === "collection") {
        result = await assignCollection({
          user_id: participantUuid,
          collection_id: scanFor.collection.id,
        }).unwrap();
        toast.success(
          result.success ? "Assigned successfully" : "Assignment completed",
          {
            description:
              result.msg ||
              `Allowed: ${result.data?.allowed}, Current: ${result.data?.current_quantity}`,
          }
        );
      } else if (scanFor.type === "bootcamp") {
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
      if (scanFor?.type === "collection") {
        errorTitle = "Collection Assignment Failed";
      } else if (scanFor?.type === "bootcamp") {
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

  const isLoading = (shouldFetchCollections && isLoadingCollections) || (shouldFetchBootcamps && isLoadingBootcamps);

  if (isLoading) {
    return <Loading />;
  }

  const collections = collectionsData?.data ?? [];

  return (
    <div className="space-y-6 py-8 px-8">
      <h1 className="text-3xl font-bold mb-8">Scan QR Code</h1>

      {/* Bootcamp Section - Only for Admin, Logistics, Registration */}
      {shouldFetchBootcamps && bootcampsData && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Bootcamp</h2>
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
          </div>
        </section>
      )}

      {/* Workshops Section - Only for Admin, Logistics, Registration */}
      {shouldShowWorkshops && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Workshop Card */}
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
          </div>
        </section>
      )}

      {/* Collections Section - Only for Admin, Material */}
      {shouldFetchCollections && collectionsData && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, idx) => (
              <Card key={collection.id}>
                <CardHeader>
                  <CardTitle>Collection {idx + 1}</CardTitle>
                  <CardDescription>{collection.collection_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Total: {collection.total_quantity}</p>
                  <p>Max Per User: {collection.max_per_user}</p>
                  <p>Used: {collection.used_quantity}</p>
                  <p>
                    Materials:{" "}
                    {collection.materials.map((m) => m.material_name).join(", ")}
                  </p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 max-[450px]:grid-cols-1">
                  <Button
                    onClick={() =>
                      openScanner({ type: "collection", collection })
                    }
                  >
                    <QrCode className="mr-2 h-4 w-4" /> Scan
                  </Button>
                  <Link
                    className="w-full"
                    href={`/materials/collections/${collection.id}`}
                  >
                    <Button className="w-full" variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      <p>Registrants</p>
                      <ChevronRight />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
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
