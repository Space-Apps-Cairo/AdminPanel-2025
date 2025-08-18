

// src/app/participants/page.tsx

"use client";

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/table/data_table";
import { columns } from "@/components/table/columns";
import { Participant } from "@/types/table";
import { useGetParticipantsQuery } from "@/store/api/participantsApi";
import { Button } from "@/components/ui/button";
import CrudForm from "@/components/crud-form";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function ParticipantsPage() {
  const { data, isLoading, error, refetch } = useGetParticipantsQuery();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (data) {
      setParticipants(data);
    }
  }, [data]);

  return (
    <div className="p-4">
      {/* العنوان وزر الإضافة */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Participants</h1>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button>Add Participant</Button>
          </DialogTrigger>
          <DialogContent>
            <CrudForm
              formType="create"
              onSuccess={() => {
                refetch();
                setOpenAdd(false);
              }}
              onClose={() => setOpenAdd(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* الجدول */}
      <DataTable
        columns={columns}
        data={participants}
        onDataChange={setParticipants}
        isLoading={isLoading} // ن TypeScript يعرفها
        statusConfig={{
          enabled: true,
          columnKey: "status", // لازم يطابق accessorKey في columns
          title: "Status",
        }}
        error={error ? "Failed to fetch participants" : null}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showExport: true,
          addButtonText: "Add",
          onAdd: () => setOpenAdd(true),
        }}
      />
    </div>
  );
}
