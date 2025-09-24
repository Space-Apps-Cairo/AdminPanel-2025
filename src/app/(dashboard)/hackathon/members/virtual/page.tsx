"use client";

import React from "react";
import { useParams } from "next/navigation";
import Loading from "../../../../../components/loading/loading";
import { useGetFilteredMemberQuery } from "@/service/Api/filtretions/member"; 
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../components/ui/tabs";

import Tab from "../onsite/_components/tabs"; 

export default function VirtualMembersPage() {
  const { id } = useParams();

  const { data: virtualTeams, isLoading: isLoadingVirtual } =
    useGetFilteredMemberQuery({ status: "", type: "virtual" });

  const { data: acceptedTeams, isLoading: isLoadingAccepted } =
    useGetFilteredMemberQuery({ status: "accepted", type: "virtual" });

  const { data: rejectedTeams, isLoading: isLoadingRejected } =
    useGetFilteredMemberQuery({ status: "rejected", type: "virtual" });

  if (isLoadingAccepted || isLoadingVirtual || isLoadingRejected)
    return <Loading />;

  //------------------tabs------------
  const tabs = [
    {
      label: "Virtual",
      value: "virtual",
      component: (
        <Tab title="Virtual Members" data={virtualTeams?.data ?? []} />
      ),
    },
    {
      label: "Accepted",
      value: "accepted",
      component: (
        <Tab title="Accepted Virtual Members" data={acceptedTeams?.data ?? []} />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <Tab title="Rejected Virtual Members" data={rejectedTeams?.data ?? []} />
      ),
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6 px-8">
      <Tabs defaultValue="virtual" className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
