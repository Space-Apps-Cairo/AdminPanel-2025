"use client";

import React, { useState, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserCheck, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// import RTK mutations
import {
  useRegisterHackathonGuestMutation,
  useRegisterHackathonJudgeMutation,
  useRegisterHackathonMemberMutation,
  useRegisterHackathonMentorMutation,
  useRegisterHackathonVipMutation,
  useRegisterHackathonVolunteerMutation,
} from "@/service/Api/hackathon/attending";

const tabs = [
  {
    label: "Members",
    value: "member",
    title: "Attended Members",
    useMutation: useRegisterHackathonMemberMutation,
  },
  {
    label: "Volunteers",
    value: "volunteer",
    title: "Attended Volunteers",
    useMutation: useRegisterHackathonVolunteerMutation,
  },
  {
    label: "Judges",
    value: "judge",
    title: "Attended Judges",
    useMutation: useRegisterHackathonJudgeMutation,
  },
  {
    label: "Mentors",
    value: "mentor",
    title: "Attended Mentors",
    useMutation: useRegisterHackathonMentorMutation,
  },
  {
    label: "Vips",
    value: "vip",
    title: "Attended VIPs",
    useMutation: useRegisterHackathonVipMutation,
  },
  {
    label: "Guests",
    value: "guest",
    title: "Attended Guests",
    useMutation: useRegisterHackathonGuestMutation,
  },
];

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Component that uses useSearchParams - wrapped in Suspense
function ManualMemberAttendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "member");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-8 sm:py-12 w-full max-w-4xl">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            router.replace(`?tab=${val}`, { scroll: false });
          }}
          className="w-full"
        >
          {/* Responsive Tabs */}
          <TabsList className="w-full flex gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap justify-center">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6 sm:mt-8">
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Component
                  view={tab.value}
                  title={tab.title}
                  useMutation={tab.useMutation}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ManualMemberAttendingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ManualMemberAttendingContent />
    </Suspense>
  );
}

interface ComponentProps {
  view: string;
  title: string;
  useMutation: () => any; // RTK mutation hook
}

function Component({ view, title, useMutation }: ComponentProps) {
  const [memberUUID, setMemberUUID] = useState("");
  const [loading, setLoading] = useState(false);

  const [mutateFn] = useMutation();

  const handleMemberAttending = async () => {
    if (!memberUUID.trim()) {
      toast.error("Please enter UUID");
      return;
    }

    setLoading(true);
    try {
      await mutateFn({ uuid: Number(memberUUID) }).unwrap();

      toast.success("Success", {
        description: `${title} → ${memberUUID} has been attended.`,
      });
      setMemberUUID("");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.msg ||
        err?.message ||
        "Operation failed";
      toast.error("Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Enter the UUID to mark attendance for {view}
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-4 sm:p-6 shadow-lg max-w-lg mx-auto">
        <div className="space-y-6 max-w-lg">
          {/* Input Field */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="uuid"
              className="font-medium text-foreground capitalize"
            >
              {view} UUID
            </label>
            <Input
              id="uuid"
              placeholder={`Enter ${view} UUID (e.g., 7469)`}
              value={memberUUID}
              onChange={(e) => setMemberUUID(e.target.value)}
              className="text-center font-mono text-sm sm:text-base"
              disabled={loading}
            />
          </div>

          {/* Action Button */}
          <div>
            <Button
              onClick={handleMemberAttending}
              disabled={loading}
              className="h-11 sm:h-12 text-sm sm:text-base w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              Mark Attendance
            </Button>
          </div>
        </div>
      </Card>

      {/* Help Text */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Make sure the {view} UUID is correct before marking attendance
        </p>
      </div>
    </div>
  );
}
