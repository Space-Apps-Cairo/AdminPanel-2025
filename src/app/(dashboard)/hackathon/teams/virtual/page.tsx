"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../../../../components/loading/loading";
import { useGetFilteredTeamsQuery } from "@/service/Api/filtretions/team";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../components/ui/tabs";

import Error from "@/components/Error/page";
import OnsiteTab from "../onsite/_components/tabs/onsitetab";

  export default function VirtualPage() {
  const { id } = useParams();

  // ---------- API Calls ----------
  const { data: virtualTeams, isLoading: isLoadingVirtual } =
    useGetFilteredTeamsQuery({ status: "", type: "virtual" });

  const { data: acceptedTeams, isLoading: isLoadingAccepted } =
    useGetFilteredTeamsQuery({ status: "accepted", type: "virtual" });

  const { data: rejectedTeams, isLoading: isLoadingRejected } =
    useGetFilteredTeamsQuery({ status: "rejected", type: "virtual" });

  if (isLoadingVirtual || isLoadingAccepted || isLoadingRejected)
    return <Loading />;

  // ---------- Tabs ----------
  const tabs = [
    {
      label: "Virtual",
      value: "virtual",
      component: (
        <OnsiteTab title="Virtual Teams" data={virtualTeams?.data ?? []} />
      ),
    },
    {
      label: "Accepted",
      value: "accepted",
      component: (
        <OnsiteTab title="Accepted Virtual Teams" data={acceptedTeams?.data ?? []} />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <OnsiteTab title="Rejected Virtual Teams" data={rejectedTeams?.data ?? []} />
      ),
    },
  ];

  // ---------- Render ----------
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
  );}