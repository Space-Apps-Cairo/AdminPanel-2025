"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetWorkshopScheduleQuery } from "@/service/Api/workshops";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table"; 
import { PriorityParticipant } from "@/types/workshop";
import PriorityTab from "./_components/tabs";

export default function WorkshopPriorityPage() {
  const { id } = useParams();
  const router = useRouter();
  const workshopId = String(id);

  // -------------------- Workshop Data --------------------
  const { data: workshopData, isLoading, error } = useGetWorkshopScheduleQuery(workshopId);

  // -------------------- Extract Priorities --------------------
const getPriorityParticipants = (data: any, key: string): PriorityParticipant[] => {
  return (data?.data?.[key] ?? []).map((p: PriorityParticipant) => ({
    id: p.id,
    name_en: p.name_en,
    name_ar: p.name_ar,
    email: p.email,
  }));
};

const firstPriority = getPriorityParticipants(workshopData, "first_priority_bootcamp_participants");
const secondPriority = getPriorityParticipants(workshopData, "second_priority_bootcamp_participants");
const thirdPriority = getPriorityParticipants(workshopData, "third_priority_bootcamp_participants");


  // -------------------- Tabs --------------------
  const tabs = [
  {
    label: "First Priority",
    value: "first",
    component: <PriorityTab data={firstPriority} title="First Priority Participants" />,
  },
  {
    label: "Second Priority",
    value: "second",
    component: <PriorityTab data={secondPriority} title="Second Priority Participants" />,
  },
  {
    label: "Third Priority",
    value: "third",
    component: <PriorityTab data={thirdPriority} title="Third Priority Participants" />,
  },
];


  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">Error loading workshop data</div>;

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>

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
