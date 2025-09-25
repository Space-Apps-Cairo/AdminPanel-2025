
"use client";
import { attendedMembersColumns, AttendedMember } from "./columns";
import DataTable from "@/components/table/data-table";
import { useGetMembersQuery } from "@/service/Api/hackathon/attending"
import Loading from "@/components/loading/loading";
import Error from "@/components/Error/page";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
export default function AttendedMembersPage() {
  const { data, isLoading, isError } = useGetMembersQuery();

      const router = useRouter();
  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Search by name or email",
    searchKeys: ["name", "email", "national"],
  };

  const statusConfig: StatusConfig = { enabled: false };

  const actionConfig: ActionConfig = {
    enabled: true, 
    showAdd: false,
    showDelete: false,
    showExport:true,
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div className="container mx-auto py-6 px-8">
         <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                          <ChevronLeft />
                          <p>Go Back</p>
                      </Button>
      <h1 className="text-2xl font-bold mb-6">Attended Members</h1>

      <DataTable<any>
        data={data ?? []}
        columns={attendedMembersColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
      />
    </div>
  );
}
