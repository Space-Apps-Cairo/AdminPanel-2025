"use client";

import { EmailColumns } from "./_components/coulmns";
import DataTable from "../../../../components/table/data-table";

import Loading from "../../../../components/loading/loading";

import { toast } from "sonner";
import { useState } from "react";
import { any } from "zod";
import { useRouter } from "next/navigation";

export default function EmailPage() {
  const router = useRouter();
  const testData = [
    { id: 1, name: "Welcome Email", template: "WelcomeTemplate" },
    { id: 2, name: "Reminder Email", template: "ReminderTemplate" },
    { id: 3, name: "Follow-up Email", template: "FollowUpTemplate" },
  ];
  return (
    <div className="container mx-auto py-6 px-8">
      <h1 className="text-2xl font-bold mb-6">Recent emails</h1>

      <DataTable<any>
        data={testData}
        columns={EmailColumns}
        searchConfig={{
          enabled: true,
          placeholder: "Search by name or template",
          searchKeys: ["name", "template"],
        }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Create an email",
          onAdd: () => router.push("/bootcamp/email-templates/new"),
        }}
        // onDeleteRows={deleteBootcamp}
      />
    </div>
  );
}
