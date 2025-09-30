"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "@/components/table/data-table";
import { useGetBootcampAttendeesQuery } from "@/service/Api/bootcamp";
import { BootcampAttendee } from "@/types/bootcamp";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { bootcampAttendeesColumns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Error from "@/components/Error/page";

export default function BootcampAttendees() {

    const router = useRouter();
    const params = useParams();
    const bootcampId = params.id as string;

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
    } = useGetBootcampAttendeesQuery(`${bootcampId}${buildQueryString()}`);

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

    // Backend pagination config for DataTable
    const backendPagination = {
        enabled: true,
        currentPage: attendeesData?.current_page || 1,
        totalPages: attendeesData?.total_pages || 1,
        pageSize: Number(attendeesData?.per_page) || 10,
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

    if (error) {
        return <Error />
    }

    return (
        <div className="space-y-6 px-8 py-7">
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
                backendPagination={backendPagination}
                enableSorting={true}
                enableSelection={false}
            />
        </div>
  );
}
