"use client";
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserCheck, Loader2 } from "lucide-react";
import { useRegisterHackathonMemberMutation } from "@/service/Api/hackathon/attending"; 

export default function ManualMemberAttendingPage() {
  const [memberUUID, setMemberUUID] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberAttending] = useRegisterHackathonMemberMutation();

  const handleMemberAttending = async () => {
    if (!memberUUID.trim()) {
      toast.error("Please enter member UUID");
      return;
    }

    setLoading(true);
    try {
      await memberAttending({ member_id: Number(memberUUID) }).unwrap();

      toast.success("Member attended successfully", {
        description: `Member ${memberUUID} has been attended.`,
      });
      setMemberUUID("");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.data?.msg || err?.message || "Operation failed";
      toast.error("Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manual Member Attending
          </h1>
          <p className="text-muted-foreground">
            Enter the member UUID to mark attendance
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            {/* Input Field */}
            <div className="space-y-2">
              <label
                htmlFor="uuid"
                className="text-sm font-medium text-foreground"
              >
                Member UUID
              </label>
              <Input
                id="uuid"
                placeholder="Enter UUID (e.g., 7469)"
                value={memberUUID}
                onChange={(e) => setMemberUUID(e.target.value)}
                className="text-center font-mono"
                disabled={loading}
              />
            </div>

            {/* Action Button */}
            <div>
              <Button
                onClick={handleMemberAttending}
                disabled={loading}
                className="h-12 text-base w-full"
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
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Make sure the member UUID is correct before marking attendance
          </p>
        </div>
      </div>
    </div>
  );
}
