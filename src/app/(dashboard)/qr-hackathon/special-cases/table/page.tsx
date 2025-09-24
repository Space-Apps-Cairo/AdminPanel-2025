"use client"
import { useGetSpecialCasesQuery } from "@/service/Api/hackthon/specialcase"

import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import DataTable from "@/components/table/data-table";

import {specialCasesColumns} from "./columns";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import Error from "@/components/Error/page";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";
import { Member } from "@/types/hackthon/specialMember";

export default function SpecialCase() {
  const {
    data: memberData,
    isLoading: isLoadingMentorship,
    isError: mentorshipError,
  } = useGetSpecialCasesQuery();

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
//   if (Loading) return <Loading />;
//   if (isError) return <Error />;

  return (
      <div className="container mx-auto py-6 px-8">
        <h1 className="text-2xl font-bold mb-6">Special Cases</h1>

        <DataTable<Member>
          data={memberData?.data??[]}
          columns={specialCasesColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
        />
      </div>
   
  );
}
