"use client";

import { CollectionUser } from "@/types/materials";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CollectionUser>[] = [
    {
        accessorKey: "user_info.name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.user_info.name;
            const email = row.original.user_info.email;
            return <div>{name || email}</div>;
        },
    },
    {
        accessorKey: "user_info.email",
        header: "Email",
    },
    {
        accessorKey: "user_type",
        header: "User Type",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
];
