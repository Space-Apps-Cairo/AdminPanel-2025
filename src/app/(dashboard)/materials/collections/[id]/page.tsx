"use client";

import { useParams, useRouter } from "next/navigation";
import { columns } from "./_components/columns";
import DataTable from "@/components/table/data-table";
import { useGetCollectionUsersQuery } from "@/service/Api/material/materials";
import { CollectionUser } from "@/types/material/materials";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Page() {

    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };

    const {
        data: usersData,
        isLoading,
        error,
    } = useGetCollectionUsersQuery(id);

    const users: CollectionUser[] = usersData?.data || [];

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Search by name or email...",
        searchKeys: ["user_info.name", "user_info.email"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: false,
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error loading registrants
                </h3>
                <p className="text-gray-500">
                    Unable to load collection registrants. Please try again later.
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

            <h1 className="text-2xl font-bold tracking-tight">
                Collection Registrants
            </h1>

            <DataTable
                data={users}
                columns={columns}
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
