"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import AttendeeTablePage from "./_components/AttendeeTablePage";
import { attendedMembersColumns } from "./_components/columns/columns";
import { useGetAttendedMembersQuery } from "@/service/Api/hackathon/attending";
import { SectionCards } from "@/components/sectionCards/page";
import { Users, UserCheck, Star, UserCog, Crown, UserPlus } from "lucide-react";

const tabs = [
  {
    label: "Members",
    value: "member",
    title: "Attended Members",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
  {
    label: "Volunteers",
    value: "volunteer",
    title: "Attended Volunteers",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
  {
    label: "Judges",
    value: "judge",
    title: "Attended Judges",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
  {
    label: "Mentors",
    value: "mentor",
    title: "Attended Mentors",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
  {
    label: "Vips",
    value: "vip",
    title: "Attended VIPs",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
  {
    label: "Guests",
    value: "guest",
    title: "Attended Guests",
    columnsSchema: attendedMembersColumns,
    useQuery: useGetAttendedMembersQuery,
  },
];

// Component that uses useSearchParams
function AttendenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "member");

  // 👇 Change active tab when there's a hash
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="container mx-auto py-6 px-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
        <p>Go Back</p>
      </Button>

      <SectionCards
        data={[
          {
            title: "Members",
            value: 120,
            color: "bg-blue-500",
            icon: <Users />,
          },
          {
            title: "Volunteers",
            value: 45,
            color: "bg-purple-500",
            icon: <UserCheck />,
          },
          {
            title: "Judges",
            value: 12,
            color: "bg-red-500",
            icon: <UserCog />,
          },
          {
            title: "Mentors",
            value: 20,
            color: "bg-green-500",
            icon: <Star />,
          },
          { title: "VIP", value: 8, color: "bg-yellow-500", icon: <Crown /> },
          {
            title: "Guests",
            value: 30,
            color: "bg-pink-500",
            icon: <UserPlus />,
          },
        ]}
      />

      {/* <SummaryCards workshop={workshopData?.data} /> */}
      {/* <h1 className="text-3xl font-bold mb-6">{workshopData?.data?.name}</h1> */}

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          // 👇 update query param without scroll
          router.replace(`?tab=${val}`, { scroll: false });
        }}
        className="w-full mt-5"
      >
        <TabsList className="w-full flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap scrollbar-hide">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm sm:text-base whitespace-nowrap"
            >
              {tab.label}
              {tab?.count !== undefined && (
                <Badge variant="default" className="ml-2">
                  {tab?.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="relative">
            <AttendeeTablePage
              title={tab.title}
              columns={tab.columnsSchema}
              useQuery={tab.useQuery}
              activeTab={activeTab}
              value={tab.value}
              showQuickInsights={true}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="container mx-auto py-6 px-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Attendence() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AttendenceContent />
    </Suspense>
  );
}

