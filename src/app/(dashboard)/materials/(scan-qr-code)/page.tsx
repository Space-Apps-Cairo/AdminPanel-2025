"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

import { useGetAllCollectionsQuery, useAssignCollectionMutation } from "@/service/Api/materials";
import { useGetBootcampsQuery, useRegisterBootcampAttendeeMutation } from "@/service/Api/bootcamp";
import { useGetAllWorkshopsQuery, useCheckInWorkshopParticipantMutation } from "@/service/Api/workshops";

import { Collection } from "@/types/materials";
import { BootcampType } from "@/types/bootcamp";
import { Workshop } from "@/types/workshop";
import Loading from "@/components/loading/loading";

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
    | { type: 'bootcamp'; bootcamp: BootcampType }
    | { type: 'workshop'; workshop: Workshop }
    | { type: 'collection'; collection: Collection }
    | null;

export default function ScanQrCodePage() {
    const [showScanner, setShowScanner] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [scanFor, setScanFor] = useState<ScanType>(null);

    const { data: collectionsData, isLoading: isLoadingCollections } = useGetAllCollectionsQuery();
    const { data: bootcampsData, isLoading: isLoadingBootcamps } = useGetBootcampsQuery();
    const { data: workshopsData, isLoading: isLoadingWorkshops } = useGetAllWorkshopsQuery();

    const [assignCollection] = useAssignCollectionMutation();
    const [registerBootcampAttendee] = useRegisterBootcampAttendeeMutation();
    const [checkInWorkshopParticipant] = useCheckInWorkshopParticipantMutation();

    useEffect(() => setIsClient(true), []);

    const handleScanSuccess = async (scannedData: string) => {
        setShowScanner(false);
        if (!scanFor) return;

        const participantUuid = String(scannedData).trim();

        try {
            let result;
            if (scanFor.type === 'collection') {
                result = await assignCollection({
                    user_id: participantUuid,
                    collection_id: scanFor.collection.id,
                }).unwrap();
                toast.success(result.success ? "Assigned successfully" : "Assignment completed", {
                    description: result.msg || `Allowed: ${result.data?.allowed}, Current: ${result.data?.current_quantity}`,
                });
            } else if (scanFor.type === 'bootcamp') {
                result = await registerBootcampAttendee({
                    bootcamp_details_id: Number(scanFor.bootcamp.id),
                    bootcamp_participant_uuid: participantUuid,
                    category: 'participant',
                    attendance_status: 'attended'
                }).unwrap();
                 toast.success("Bootcamp registration successful", {
                    description: "Participant has been registered for the bootcamp.",
                });
            } else if (scanFor.type === 'workshop') {
                result = await checkInWorkshopParticipant({
                    bootcamp_participant_uuid: participantUuid
                }).unwrap();
                toast.success("Workshop check-in successful", {
                    description: result.message || "Participant checked in successfully.",
                });
            }
        } catch (err: unknown) {
            const apiErr = err as { data?: { msg?: string, message?: string } };
            toast.error("Operation failed", {
                description: apiErr?.data?.msg || apiErr?.data?.message || `An error occurred.`,
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
    }

    const isLoading = isLoadingCollections || isLoadingBootcamps || isLoadingWorkshops;

    if (isLoading) {
        return <Loading />;
    }

    const bootcamp = bootcampsData?.data?.[0];
    const workshop = workshopsData?.data?.[0];
    const collections = collectionsData?.data ?? [];

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Scan QR Code</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bootcamp Card */}
                {bootcamp && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bootcamp</CardTitle>
                            <CardDescription>{bootcamp.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Total Capacity: {bootcamp.total_capacity}</p>
                            <p>Date: {new Date(bootcamp.date).toLocaleDateString()}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => openScanner({ type: 'bootcamp', bootcamp })}>
                                <QrCode className="mr-2 h-4 w-4" /> Scan
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Workshop Card */}
                {workshop && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Workshop</CardTitle>
                            <CardDescription>{workshop.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <p>From: {new Date(workshop.start_date).toLocaleDateString()}</p>
                             <p>To: {new Date(workshop.end_date).toLocaleDateString()}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => openScanner({ type: 'workshop', workshop })}>
                                <QrCode className="mr-2 h-4 w-4" /> Scan
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Collection Cards */}
                {collections.map((collection) => (
                    <Card key={collection.id}>
                        <CardHeader>
                            <CardTitle>Collection</CardTitle>
                            <CardDescription>{collection.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Total: {collection.total_quantity}</p>
                            <p>Used: {collection.current_quantity}</p>
                            <p>Materials: {collection.materials.map(m => m.name).join(', ')}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => openScanner({ type: 'collection', collection })}>
                                <QrCode className="mr-2 h-4 w-4" /> Scan
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

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
