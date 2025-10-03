"use client";

import DataTable from "@/components/table/data-table";
import {
  useGetGuestsQuery,
  useAddGuestMutation,
  useImportGuestsFileMutation,
  useDeleteGuestMutation,
} from "@/service/Api/crew/guest";
import { Guest } from "@/types/crew/guest";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useState } from "react";
import { getGuestFields, guestColumns } from "./columns";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import { guestValidationSchema } from "@/validations/crew/guest";
import { toast } from "sonner";
import ImportButton from "@/components/import/ImportButton";
import Error from "@/components/Error/page";

export default function Guests() {
  const {
    data: guestsData,
    isLoading: isLoadingGuests,
    error: guestsError,
  } = useGetGuestsQuery(); 

  const [isOpen, setIsOpen] = useState(false);

  const [addGuest] = useAddGuestMutation();
  const [importGuests] = useImportGuestsFileMutation();
  const [deleteGuest] = useDeleteGuestMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by full name, national id or organization",
    searchKeys: ["full_name", "national_id", "organization"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Guest",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // ===== Import Guests Functions ===== //

  function formatGuestsPayload(rows: Record<string, unknown>[]) {
    return {
      guests: rows.map((row) => ({
        full_name: (row.full_name as string) ?? "N/A",
        organization: (row.organization as string) ?? null,
        national: (row.national as string) ?? "N/A",
        free_space: (row.free_space as string) ?? null,
      })),
    };
  }

  async function submitGuests(
    payload: ReturnType<typeof formatGuestsPayload>
  ) {
    const res = await importGuests(payload).unwrap();
    toast.success(res.msg || "Guests imported successfully!");
  }

  // Helper for API error
  function getApiErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null) {
      if ("data" in err) {
        const data = (err as { data?: { message?: string; msg?: string } })
          .data;
        return data?.message || data?.msg || "Operation failed";
      }
      if (
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        return (err as { message: string }).message;
      }
    }
    return "Operation failed";
  }

  const handleAddGuestSubmit = async (
    data: FieldValues,
    formData?: FormData
  ) => {
    try {
      console.log("Submitting guest data:", data);
      const guestData: Omit<Guest, "id" | "created_at" | "updated_at"> = {
        full_name: data.full_name,
        organization: data.organization || null,
        national: data.national,
        free_space: data.free_space || null,
      };

      const result = await addGuest(guestData as Guest).unwrap();
      toast.success(result.msg || "Guest added successfully!");
    } catch (error) {
      console.error("Error adding guest:", error);
      toast.error(
        getApiErrorMessage(error) || "Failed to add guest. Please try again."
      );
      throw error;
    }
  };

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getGuestFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={guestValidationSchema}
          onSubmit={handleAddGuestSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <div className="w-full flex flex-wrap item-center justify-between">
          <h1 className="text-2xl font-bold mb-6">Guests</h1>

          <ImportButton
            label="Import Guests File"
            accept="both"
            title="Import Guests File"
            description="Upload a CSV or Excel file to import multiple guests."
            formatPayload={formatGuestsPayload}
            onSubmit={submitGuests}
          />
        </div>

        <DataTable<Guest>
          data={guestsData?.data || []}
          columns={guestColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
         enableBulkEmail={true}
        />
      </div>
    </React.Fragment>
  );
}
