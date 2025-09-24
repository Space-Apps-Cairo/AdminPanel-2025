"use client";

import DataTable from "@/components/table/data-table";
import {MemberColumns } from "./columns";

interface TabProps {
  title: string;     
  data: any[];     
}

export default function Tab({ title, data }: TabProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold py-5">{title}</h1>

      <DataTable
        data={data }
        columns={MemberColumns }
        searchConfig={{ enabled: false }}
        statusConfig={{ enabled: false }}
        actionConfig={{
          enabled: true,
          showAdd: false,
          showDelete: true,
        }}
      />
    
    </div>
  );
}