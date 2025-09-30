"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BootcampAttendee } from "@/types/bootcamp";
import { Badge } from "@/components/ui/badge";

export const bootcampAttendeesColumns: ColumnDef<BootcampAttendee>[] = [
    {
        header: "Name",
        accessorKey: "bootcamp_participant.name_en",
        size: 150,
    },
    {
        header: "Email",
        accessorKey: "bootcamp_participant.email",
        size: 200,
    },
    {
        header: "National ID",
        accessorKey: "bootcamp_participant.national_id",
        size: 150,
    },
    {
        accessorKey: "check_in_time_date",
        header: "Check-In Date",
        cell: ({ row }) => {
            const checkInTime = row.original.check_in_time;
            return (
                <p>{checkInTime.split(" ")[0].split("-").reverse().join("-")}</p>
            );
        },
        size: 120,
    },
    {
        accessorKey: "check_in_time",
        header: "Check-In Time",
        cell: ({ row }) => {
            const checkInTime = row.original.check_in_time;
            return (
                <p>{checkInTime.split(" ")[1]}</p>
            );
        },
        size: 120,
    },
];