"use client";

import DataTable from "@/components/table/data-table";
import {
  useGetAllJudgeQuery,
  useAddJudgeMutation,
  useImportJudgeFileMutation,
  useDeleteJudgeMutation,
} from "@/service/Api/crew/judge";
import { Judge } from "@/types/crew/judge";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useState, useCallback } from "react";
import { getJudgeFields, judgeColumns } from "./columns";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import { judgeValidationSchema } from "@/validations/crew/judge";
import { toast } from "sonner";
import ImportButton from "@/components/import/ImportButton";
import Error from "@/components/Error/page";

export default function JudgesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (pageSize === -1) params.append("limit", "all");
    else params.append("limit", pageSize.toString());
    params.append("page", currentPage.toString());
    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage]);

  const { data: judgesData, isLoading, error } = useGetAllJudgeQuery(
    buildQueryString()
  );

  const [addJudge] = useAddJudgeMutation();
  const [importJudges] = useImportJudgeFileMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name, email, or expertise",
    searchKeys: ["name", "email", "expertise"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Judge",
    onAdd: () => setIsOpen(true),
  };

  const backendPagination = {
    enabled: true,
    pageSize: pageSize,

    onPageChange: setCurrentPage,
    onPageSizeChange: (size: number) => {
      setPageSize(size === -1 ? -1 : size);
      setCurrentPage(1);
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1);
    },
    loading: isLoading,
  };

  function formatJudgesPayload(rows: Record<string, unknown>[]) {
    return {
      judges: rows.map((row) => ({
        name: (row.name as string) || "N/A",
        expertise: (row.expertise as string) || "N/A",
        title: (row.title as string) || "",
        email: (row.email as string) || "",
        linkedIn: (row.linkedIn as string) || "",
        phone: (row.phone as string) || "",
        judging_area: (row.judging_area as string) || "",
        reached_out_by_call: Boolean(row.reached_out_by_call),
        confirmed_status: Boolean(row.confirmed_status),
        response_status: (row.response_status as string) || "pending",
        jude_before_at: row.jude_before_at
        ? new Date(row.jude_before_at as string).toISOString().split("T")[0]
        : null,
      })),
    };
  }

  async function submitJudges(
    payload: ReturnType<typeof formatJudgesPayload>
  ) {
    const res = await importJudges(payload).unwrap();
    toast.success(res.msg || "Judges imported successfully!");
  }

  function getApiErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null) {
      if ("data" in err) {
        const data = (err as { data?: { message?: string; msg?: string } }).data;
        return data?.message || data?.msg || "Operation failed";
      }
      if ("message" in err && typeof (err as { message?: string }).message === "string") {
        return (err as { message: string }).message;
      }
    }
    return "Operation failed";
  }

  const handleAddJudgeSubmit = async (data: FieldValues) => {
    try {
      const judgeData: Omit<Judge, "uuid" | "created_at" | "updated_at"> = {
        name: data.name,
        expertise: data.expertise,
        title: data.title,
        email: data.email,
        linkedIn: data.linkedIn,
        phone: data.phone,
        judging_area: data.judging_area,
        reached_out_by_call: data.reached_out_by_call,
        confirmed_status: data.confirmed_status,
        response_status: data.response_status,
       jude_before_at: data.jude_before_at,
      };
      const result = await addJudge(judgeData as Judge).unwrap();
      toast.success(result.msg || "Judge added successfully!");
    } catch (err) {
      toast.error(getApiErrorMessage(err) || "Failed to add judge.");
      throw err;
    }
  };


  return (
    <>
      {isOpen && (
        <CrudForm
          fields={getJudgeFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={judgeValidationSchema}
          onSubmit={handleAddJudgeSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <div className="w-full flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold mb-6">Judges</h1>

          <ImportButton
            label="Import Judges File"
            accept="both"
            title="Import Judges File"
            description="Upload a CSV or Excel file to import multiple judges."
            formatPayload={formatJudgesPayload}
            onSubmit={submitJudges}
            onSuccess={() => setCurrentPage(1)}
          />
        </div>

        <DataTable<Judge>
          data={judgesData?.data || []}
          columns={judgeColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          backendPagination={backendPagination}
          enableBulkEmail={true}
        />
      </div>
    </>
  );
}
