"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WorkshopAttendee } from "@/types/workshop";

export const attendeesColumns: ColumnDef<WorkshopAttendee>[] = [
    {
        header: "Name",
        accessorKey: "participant.name",
        size: 150,
    },
    {
        header: "Email",
        accessorKey: "participant.email",
        size: 250,
    },
    {
        accessorKey: "check_in_time_date",
        header: "Check-In Date",
        cell: ({ row }) => {
            return (
                <p>{row.original.check_in_time.split(" ")[0]}</p>
            );
        },
        size: 150,
    },
    {
        accessorKey: "check_in_time",
        header: "Check-In Time",
        cell: ({ row }) => {
            return (
                <p>{row.original.check_in_time.split(" ")[1].split('.')[0]}</p>
            );
        },
        size: 100,
    },
];
