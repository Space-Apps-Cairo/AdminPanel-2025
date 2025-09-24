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

import Tab from "./_components/tabs"; 

export default function MemberOnsitePage() {
  const { id } = useParams();

  const { data: onsiteMembers, isLoading: isLoadingOnsite } =
    useGetFilteredMemberQuery({ status: "", type: "onsite" });

  const { data: acceptedMembers, isLoading: isLoadingAccepted } =
    useGetFilteredMemberQuery({ status: "accepted", type: "onsite" });

  const { data: rejectedMembers, isLoading: isLoadingRejected } =
    useGetFilteredMemberQuery({ status: "rejected", type: "onsite" });

  if (isLoadingAccepted || isLoadingOnsite || isLoadingRejected)
    return <Loading />;

  //------------------tabs------------
  const tabs = [
    {
      label: "Onsite",
      value: "onsite",
      component: (
        <Tab title="Onsite Members" data={onsiteMembers?.data ?? []} />
      ),
    },
    {
      label: "Accepted",
      value: "accepted",
      component: (
        <Tab
          title="Accepted Members"
          data={acceptedMembers?.data ?? []}
        />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <Tab
          title="Rejected Members"
          data={rejectedMembers?.data ?? []}
        />
      ),
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6 px-8">
      <Tabs defaultValue="onsite" className="w-full">
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
