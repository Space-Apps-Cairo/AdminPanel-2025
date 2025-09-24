"use client"
import { useGetAllTeamsQuery } from "@/service/Api/teams";
import { ChevronLeft } from "lucide-react";
import DataTable from "@/components/table/data-table";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";
import { useParams, useRouter } from "next/navigation";
import { Member } from "@/types/hackthon/specialMember";
import {useGetSpecialCasesQuery} from "@/service/Api/hackthon/specialcase";
import Loading from "@/components/loading/loading";
import {getSpecialCasesColumns} from "./columns"
import { Button } from "@/components/ui/button";
export default function SpecialCase() {
  
      const router = useRouter();
  
  const {
    data: memberData,
    isLoading: isLoadingMemeber,
    isError: MemberError,
  } = useGetSpecialCasesQuery();
const { data: teamsResponse } = useGetAllTeamsQuery();
const teamsData = teamsResponse?.data ?? [];
  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title",
    searchKeys: ["title"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false,
    showDelete: true,
   
  };
  if (isLoadingMemeber) return <Loading />;
  if (MemberError) return <Error />;

  return (
    
    
      <div className="container mx-auto py-6 px-8">
         <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                    <ChevronLeft />
                    <p>Go Back</p>
                </Button>
        <h1 className="text-2xl font-bold mb-6">Special Cases</h1>

        <DataTable<Member>
          data={memberData ?? []}
          columns={getSpecialCasesColumns(teamsData)} 
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
   
  );
}
