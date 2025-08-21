"use client";
import React from "react";
import DataTable from "../../../../../../../components/table/data-table";
import { PriorityParticipant } from "@/types/workshop";
import { priorityColumns } from "./columns";
import { SearchConfig } from "@/types/table";

interface PriorityTabProps {
  data: PriorityParticipant[];
  title: string;
}

export default function PriorityTab({ data, title }: PriorityTabProps) {
  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name or email",
    searchKeys: ["name_en", "name_ar", "email"],
  };
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">{title}</h1> */}
      <DataTable
        data={data}
        columns={priorityColumns}
        searchConfig={searchConfig}
        statusConfig={{ enabled: false }}
      />
    </div>
  );
}
