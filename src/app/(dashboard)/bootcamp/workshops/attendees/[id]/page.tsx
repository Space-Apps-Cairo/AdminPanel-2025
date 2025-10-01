"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { attendeesColumns } from "./_components/columns";
import DataTable from "@/components/table/data-table";
import { useGetWorkshopAttendeesQuery } from "@/service/Api/workshops";
import { WorkshopAttendee } from "@/types/workshop";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Attendees() {
    const router = useRouter();
    const params = useParams();
    const scheduleId = params.id as string;

    // Pagination and search state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // Build query string for backend pagination and search
    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams();

        if (searchTerm) {
        params.append("search", searchTerm);
        }

        params.append("limit", pageSize.toString());
        params.append("page", currentPage.toString());

        return params.toString() ? `?${params.toString()}` : "";
    }, [searchTerm, pageSize, currentPage]);

    // Fetch attendees with query string
    const {
        data: attendeesData,
        isLoading,
        error,
    } = useGetWorkshopAttendeesQuery(`${scheduleId}${buildQueryString()}`);

    const attendees: WorkshopAttendee[] = attendeesData?.data || [];

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Search by participant name...",
        searchKeys: ["participant.name"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: false, // Read-only table
    };

    // Backend pagination config for DataTable
    const backendPagination = {
        enabled: true,
        currentPage: attendeesData?.current_page || 1,
        totalPages: attendeesData?.total_pages || 1,
        pageSize: pageSize,
        totalCount: attendeesData?.count || 0,
        onPageChange: (page: number) => {
        setCurrentPage(page);
        },
        onPageSizeChange: (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
        },
        onSearchChange: (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
        },
        loading: isLoading,
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
                    Unable to load workshop attendees. Please try again later.
                </p>
                </div>
            </div>
        );
  }

    return (
        <div className="space-y-6 px-8 py-7">
            <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                <p>Go Back</p>
            </Button>

            <h1 className="text-2xl font-bold tracking-tight">Workshop Attendees</h1>

            <DataTable
                data={attendees}
                columns={attendeesColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                backendPagination={backendPagination}
                enableSorting={true}
                enableSelection={false}
            />
        </div>
    );
}
