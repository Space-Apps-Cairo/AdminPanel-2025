"use client";

import DataTable from "@/components/table/data-table";
import React, { useCallback, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import ImportButton from "@/components/import/ImportButton";
import Error from "@/components/Error/page";
import { toast } from "sonner";

import {
  useAddVipMutation,
  useDeleteVipMutation,
  useGetAllVipsQuery,
  useImportVipsFileMutation,
} from "@/service/Api/crew/vips";
import { Vip } from "@/types/crew/vips";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import { getVipFields, vipColumns } from "./_components/columns";
import { vipValidationSchema } from "@/validations/crew/vips";

export default function VipsPage() {
  // pagination + search + filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [orgFilters, setOrgFilters] = useState<string[]>([]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    // search by name, uuid
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    // filters: role, organization
    if (roleFilters.length) params.append("role", roleFilters.join(","));
    if (orgFilters.length) params.append("organization", orgFilters.join(","));

    if (pageSize === -1) {
      params.append("limit", "all");
    } else {
      params.append("limit", pageSize.toString());
    }
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [searchTerm, roleFilters, orgFilters, pageSize, currentPage]);

  const {
    data: vipsRes,
    isLoading,
    error,
  } = useGetAllVipsQuery(buildQueryString());

  const [isOpen, setIsOpen] = useState(false);
  const [importVips] = useImportVipsFileMutation();
  const [deleteVip] = useDeleteVipMutation();
  const [addVip] = useAddVipMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Search by name or UUID",
    searchKeys: ["name", "uuid"],
  };

  // dynamic filter options from current page data
  const { roleOptions, orgOptions } = useMemo(() => {
    const setRole = new Set<string>();
    const setOrg = new Set<string>();
    (vipsRes?.data || []).forEach((v) => {
      if (v.role) setRole.add(v.role);
      if (v.organization) setOrg.add(v.organization);
    });
    return {
      roleOptions: Array.from(setRole).map((r, i) => ({ id: i, label: r })),
      orgOptions: Array.from(setOrg).map((o, i) => ({ id: i, label: o })),
    };
  }, [vipsRes?.data]);

  const statusConfig: StatusConfig = {
    enabled: false,
    filterOptions: [
      { title: "Role", queryKey: "role", options: roleOptions },
      { title: "Organization", queryKey: "organization", options: orgOptions },
    ],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add VIP",
    onAdd: () => setIsOpen(true),
  };

  const backendPagination = {
    enabled: true,
    currentPage: vipsRes?.current_page || 1,
    totalPages: vipsRes?.total_pages || 1,
    pageSize,
    totalCount: vipsRes?.count || 0,
    onPageChange: (page: number) => setCurrentPage(page),
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    onSearchChange: (q: string) => {
      setSearchTerm(q);
      setCurrentPage(1);
    },
    onFilterChange: (filters: Record<string, unknown>) => {
      const role = (filters["role"] as string[]) || [];
      const organization = (filters["organization"] as string[]) || [];
      setRoleFilters(role);
      setOrgFilters(organization);
      setCurrentPage(1);
    },
    loading: isLoading,
  };

  function formatVipsPayload(rows: Record<string, unknown>[]) {
    return {
      vips: rows.map((row) => ({
        name: (row.name as string) ?? "N/A",
        organization: (row.organization as string) ?? "N/A",
        role: (row.role as string) ?? "N/A",
      })),
    };
  }

  async function submitVips(payload: ReturnType<typeof formatVipsPayload>) {
    await importVips(payload).unwrap();
  }

  const handleAddVipSubmit = async (data: FieldValues) => {
    try {
      const vipData = {
        name: data.name as string,
        organization: data.organization as string,
        role: data.role as string,
      };
      const result = await addVip(vipData).unwrap();
      toast.success(result?.message || "VIP added successfully!");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add VIP");
      throw err;
    }
  };

  if (error) return <Error status={404} message="Error fetching VIPs" />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getVipFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          validationSchema={vipValidationSchema}
          onSubmit={handleAddVipSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <div className="w-full flex flex-wrap item-center justify-between">
          <h1 className="text-2xl font-bold mb-6">VIPs</h1>

          <ImportButton
            label="Import VIPs File"
            accept="both"
            title="Import VIPs File"
            description="Upload a CSV or Excel file to import multiple VIPs."
            formatPayload={formatVipsPayload}
            onSubmit={submitVips}
            onSuccess={() => setCurrentPage(1)}
          />
        </div>

        <DataTable<Vip>
          data={vipsRes?.data || []}
          columns={vipColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteVip}
          backendPagination={backendPagination}
          emailTemplateType="vips"
          enableBulkEmail={false}
        />
      </div>
    </React.Fragment>
  );
}