"use client";

import DataTable from "@/components/table/data-table";
import {
  useAddVolunteerMutation,
  useGetAllVolunteersQuery,
  useImportVolunteersFileMutation,
  useDeleteVolunteerMutation,
} from "@/service/Api/material/materials";
import { Volunteer } from "@/types/material/materials";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import React, { useState, useCallback } from "react";
import { getVolunteerFields, volunteerColumns } from "./_components/columns";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import { volunteerValidationSchema } from "@/validations/material/volunteer";
import { toast } from "sonner";
import ImportButton from "@/components/import/ImportButton";
import Error from "@/components/Error/page";

export default function Volunteers() {
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    // Handle "all" case - use -1 to represent "all"
    if (pageSize === -1) {
      params.append("limit", "all");
    } else {
      params.append("limit", pageSize.toString());
    }

    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, pageSize, currentPage]);

  const {
    data: volunteersData,
    isLoading: isLoadingVolunteers,
    error: VolunteersError,
  } = useGetAllVolunteersQuery(buildQueryString());

  const [isOpen, setIsOpen] = useState(false);

  // Import Volunteers Mutation
  const [importVolunteers] = useImportVolunteersFileMutation();

  // Delete mutation for bulk operations
  const [deleteVolunteer] = useDeleteVolunteerMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name and email",
    searchKeys: ["full_name", "email"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Volunteer",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // Backend pagination configuration
  const backendPagination = {
    enabled: true,
    currentPage: volunteersData?.current_page || 1,
    totalPages: volunteersData?.total_pages || 1,
    pageSize: pageSize,
    totalCount: volunteersData?.count || 0,
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      if (size === -1) {
        setPageSize(-1);
      } else {
        setPageSize(size);
      }
      setCurrentPage(1);
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
    },
    loading: isLoadingVolunteers,
  };

  // ====== CSV Upload Functions ====== //

  function formatVolunteersPayload(rows: Record<string, unknown>[]) {
    return {
      volunteers: rows.map((row) => ({
        full_name: (row.full_name as string) ?? "N/A",
        email: (row.email as string) ?? "N/A",
        phone: (row.phone as string) ?? "N/A",
        team: (row.team as string) ?? "",
        volunteering_year: Number(
          (row.volunteering_year as string) ??
            new Date().getFullYear().toString() ??
            "N/A"
        ),
      })),
    };
  }

  async function submitVolunteers(
    payload: ReturnType<typeof formatVolunteersPayload>
  ) {
    const res = await importVolunteers(payload).unwrap();
    toast.success(res.msg || "Volunteers imported successfully!");
  }

  // ... inside the header actions where you had the upload button:

  // ====== add-volunteer ====== //

  const [addVolunteer] = useAddVolunteerMutation();

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

  const handleAddVolunteerSubmit = async (
    data: FieldValues,
    formData?: FormData
  ) => {
    try {
      console.log("Submitting volunteer data:", data);
      console.log(
        "Form data:",
        formData ? [...formData.entries()] : "No form data"
      );

      const volunteerData: Omit<Volunteer, "id" | "created_at" | "schedules"> =
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          team: data.team,
          volunteering_year: data.volunteering_year,
        };

      const result = await addVolunteer(volunteerData as Volunteer).unwrap();
      console.log("Volunteer added successfully:", result);
      toast.success(result.msg || "Volunteer added successfully!");
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error(
        getApiErrorMessage(error) ||
          "Failed to add volunteer. Please try again."
      );
      throw error;
    }
  };

  if (VolunteersError) return <Error />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getVolunteerFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={volunteerValidationSchema}
          onSubmit={handleAddVolunteerSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <div className="w-full flex flex-wrap item-center justify-between">
          <h1 className="text-2xl font-bold mb-6">Volunteers</h1>

          <ImportButton
            label="Import Volunteers File"
            accept="both"
            title="Import Volunteers File"
            description="Upload a CSV or Excel file to import multiple volunteers."
            // variant="default"
            // size="default"
            // parseOptions={{ headerRow: 0, sheetIndex: 0 }}
            formatPayload={formatVolunteersPayload}
            onSubmit={submitVolunteers}
            onSuccess={() => setCurrentPage(1)}
          />
        </div>

        <DataTable<Volunteer>
          data={volunteersData?.data || []}
          columns={volunteerColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteVolunteer}
          backendPagination={backendPagination}
          emailTemplateType="volunteers"
          enableBulkEmail={true}
        />
      </div>
    </React.Fragment>
  );
}
