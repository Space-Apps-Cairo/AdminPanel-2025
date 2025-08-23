"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardTitle } from "../../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../components/ui/tabs";
import Loading from "../../../../../components/loading/loading";
import Error from "@/components/Error/page";
// --- Priority imports ---
import { useGetWorkshopDetailsQuery } from "@/service/Api/workshops";
import { PriorityParticipant } from "@/types/workshop";

import { Badge } from "../../../../../components/ui/badge";
import PriorityTab from "./_components/priorites/tabs";
import SchedulesTab from "./_components/schedules/page";
import WorkshopDetailsTab from "./_components/details/page";

export default function WorkshopPage() {
  const { id } = useParams();
  const router = useRouter();
  const workshopId = String(id);

  const [activeTab, setActiveTab] = useState("details");

  // 👇 Change active tab when there's a hash
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      setActiveTab(hash);
    }
  }, []);

  // -------------------- Workshop Data --------------------
  const {
    data: workshopData,
    isLoading: isLoadingWorkshop,
    error: workshopError,
  } = useGetWorkshopDetailsQuery(workshopId);

  // -------------------- Loading States --------------------
  if (isLoadingWorkshop) return <Loading />;
  if (workshopError)
    return <Error/>;

  // -------------------- Extract Priorities --------------------
  const getPriorityParticipants = (
    data: any,
    key: string
  ): PriorityParticipant[] => {
    return (data?.data?.[key] ?? []).map((p: PriorityParticipant) => ({
      id: p.id,
      name_en: p.name_en,
      name_ar: p.name_ar,
      email: p.email,
    }));
  };

  const firstPriority = getPriorityParticipants(
    workshopData,
    "first_priority_bootcamp_participants"
  );
  const secondPriority = getPriorityParticipants(
    workshopData,
    "second_priority_bootcamp_participants"
  );
  const thirdPriority = getPriorityParticipants(
    workshopData,
    "third_priority_bootcamp_participants"
  );

  console.log("workshop-schudels:", workshopData?.data?.schedules);
  const tabs = [
    {
      label: "Details",
      value: "details",
      component: <WorkshopDetailsTab workshop={workshopData?.data} />,
    },
    {
      label: "Schedules",
      value: "schedules",
      component: (
        <SchedulesTab
          workshopId={workshopId}
          schedules={workshopData?.data?.schedules ?? []}
        />
      ),
    },
    {
      label: "First Priority",
      value: "first",
      component: (
        <PriorityTab data={firstPriority} title="First Priority Participants" />
      ),
      data: firstPriority,
      count: firstPriority.length,
    },
    {
      label: "Second Priority",
      value: "second",
      component: (
        <PriorityTab
          data={secondPriority}
          title="Second Priority Participants"
        />
      ),
      data: secondPriority,
      count: secondPriority.length,
    },
    {
      label: "Third Priority",
      value: "third",
      component: (
        <PriorityTab data={thirdPriority} title="Third Priority Participants" />
      ),
      data: thirdPriority,
      count: thirdPriority.length,
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>
      <SummaryCards workshop={workshopData?.data} />
      <h1 className="text-3xl font-bold mb-6">{workshopData?.data?.name}</h1>

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          router.replace(`#${val}`); // updates the hash in URL
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="relative">
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="default" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="relative">
            <h1 className="text-2xl py-2 font-bold">Workshop {tab.label}</h1>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SummaryCards({ workshop }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-5">
      {[
        {
          title: "First Priority",
          count: workshop.first_priority_bootcamp_participants?.length || 0,
          color: "bg-emerald-500",
        },
        {
          title: "Second Priority",
          count: workshop.second_priority_bootcamp_participants?.length || 0,
          color: "bg-amber-500",
        },
        {
          title: "Third Priority",
          count: workshop.third_priority_bootcamp_participants?.length || 0,
          color: "bg-rose-500",
        },
      ].map((item, index) => (
        <Card
          key={index}
          className="flex flex-row items-center justify-between p-6"
        >
          <div>
            <CardTitle className="text-lg font-medium">
              <div className="text-2xl font-bold">{item.count}</div>
              {item.title}
            </CardTitle>
          </div>
          <div>
            <div
              className={`flex items-center justify-center rounded-full h-14 w-14 ${item.color} text-white`}
            >
              {index + 1}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
