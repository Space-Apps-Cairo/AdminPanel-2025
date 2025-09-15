"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "@/components/table/data-table";
import { useGetBootcampAttendeesQuery } from "@/service/Api/bootcamp";
import { BootcampAttendee } from "@/types/bootcamp";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Loading from "@/components/loading/loading";
import { bootcampAttendeesColumns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BootcampAttendees() {

    const router = useRouter();

    const params = useParams();
    const bootcampId = params.id as string;

    const {
        data: attendeesData,
        isLoading,
        error,
    } = useGetBootcampAttendeesQuery(bootcampId);

    const attendees: BootcampAttendee[] = attendeesData?.data || [];

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Search by participant name or email...",
        searchKeys: ["bootcamp_participant.name_en", "bootcamp_participant.email"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: false, // Read-only table
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Error loading attendees
                    </h3>
                    <p className="text-gray-500">
                        Unable to load bootcamp attendees. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-8">

            <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                <p>Go Back</p>
            </Button>

            <h1 className="text-2xl font-bold tracking-tight">Bootcamp Attendees</h1>

            <DataTable
                data={attendees}
                columns={bootcampAttendeesColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                pageSize={10}
                enableSorting={true}
                enableSelection={false}
            />
        </div>
    );
}
