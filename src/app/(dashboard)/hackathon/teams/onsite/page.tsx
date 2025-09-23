"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../../../../components/loading/loading";

import { Button } from "../../../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FieldValues } from "react-hook-form";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../components/ui/tabs";
import { FieldOption } from "@/app/interface";
import { teamColumns} from "./_components/columns/acceptcolumns";

import { formatDate } from "@/lib/utils";
import AcceptTab from "./_components/tabs/accepttab";
import RejectTab from "./_components/tabs/rejecttab";
import { toast } from "sonner";
import Error from "@/components/Error/page";
import OnsiteTab from "./_components/tabs/onsitetab";
export default function ParticipantPreferencesPage() {
  const { id } = useParams();
  const router = useRouter();
  const participantId = Number(id);

  //------------------tabs------------
  const tabs = [
    {
      label: "Onsite",
      value: "onsite",
      component: (
      <OnsiteTab/>
      ),
    },
    {
      label: "Accepted",
      value: "accepted",
      component: (
        <AcceptTab />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      component: (
        <RejectTab
        />
      ),
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto py-6 px-8">
      {/* <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft />
       Go Back
      </Button> */}
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