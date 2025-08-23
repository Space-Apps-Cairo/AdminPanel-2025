"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetWorkshopDetailsQuery } from "@/service/Api/workshops";
import { Button } from "../../../../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../../components/ui/tabs";
import Loading from "../../../../../../components/loading/loading";
import PriorityTab from "./_components/tabs";
import { PriorityParticipant } from "@/types/workshop";
import CardsGrid from "../../../../../../components/cards/CardsGrid";
import { Card, CardTitle } from "../../../../../../components/ui/card";
import { ServerInsertedMetadataContext } from "next/dist/shared/lib/server-inserted-metadata.shared-runtime";

export default function WorkshopPriorityPage() {
  const { id } = useParams();
  const router = useRouter();
  const workshopId = String(id);

  // -------------------- Workshop Data --------------------
  const {
    data: workshopData,
    isLoading,
    error,
  } = useGetWorkshopDetailsQuery(workshopId);

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

  // -------------------- Tabs --------------------
  const tabs = [
    {
      label: "First Priority",
      value: "first",
      component: (
        <PriorityTab data={firstPriority} title="First Priority Participants" />
      ),
      data: firstPriority,
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
    },
    {
      label: "Third Priority",
      value: "third",
      component: (
        <PriorityTab data={thirdPriority} title="Third Priority Participants" />
      ),
      data: thirdPriority,
    },
  ];

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500">Error loading workshop data</div>;

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-6">
        {tabs.map((tab, index) => {
          const colors = [
            "bg-emerald-500 text-white",
            "bg-amber-500 text-white",
            "bg-rose-500 text-white",
          ];
          return (
            <Card
              key={index}
              className="flex flex-row items-center justify-between gap-2 px-6"
            >
              <div>
                <CardTitle className="text-lg font-medium gap-2 flex flex-col">
                  <div className="text-2xl font-bold">{tab.data.length}</div>
                  {tab.label}
                </CardTitle>
              </div>
              <div>
                <div
                  className={`flex items-center justify-center rounded-full h-14 w-14 ${colors[index]}`}
                >
                  {index + 1}st
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <h1 className="text-2xl font-bold py-5">Partipants Per Priority</h1>
      <Tabs defaultValue="first" className="w-full">
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
