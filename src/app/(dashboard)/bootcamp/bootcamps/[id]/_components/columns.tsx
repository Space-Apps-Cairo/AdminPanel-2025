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
        header: "Category",
        accessorKey: "category",
        size: 100,
    },
    {
        accessorKey: "attendance_status",
        header: "Status",
        cell: ({ row }) => (
            <Badge 
                variant={row.getValue("attendance_status") === "attended" ? "outline" : "default"} 
                className="py-1 px-2"
            >
                {row.getValue("attendance_status")}
            </Badge>
        ),
        size: 120,
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