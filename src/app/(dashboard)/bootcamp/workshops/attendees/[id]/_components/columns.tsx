"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WorkshopAttendee } from "@/types/workshop";
import { Badge } from "@/components/ui/badge";

export const attendeesColumns: ColumnDef<WorkshopAttendee>[] = [
    {
        header: "Name",
        accessorKey: "participant.name",
        size: 100,
    },
    {
        accessorKey: "attendance_status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.getValue("attendance_status") === "attended" ? "outline" : "default"} className="py-1 px-2">
                {row.getValue("attendance_status")}
            </Badge>
        ),
        size: 100,
    },
    {
        accessorKey: "check_in_time_date",
        header: "Check-In Date",
        cell: ({ row }) => {
            return (
                <p>{row.original.check_in_time.split(" ")[0].split("-").reverse().join("-")}</p>
            );
        },
        size: 100,
    },
    {
        accessorKey: "check_in_time",
        header: "Check-In Time",
        cell: ({ row }) => {
            return (
                <p>{row.original.check_in_time.split(" ")[1]}</p>
            );
        },
        size: 100,
    },
];
