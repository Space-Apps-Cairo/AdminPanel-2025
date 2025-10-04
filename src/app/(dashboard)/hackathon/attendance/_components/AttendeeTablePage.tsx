"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import Loading from "@/components/loading/loading";
import Error from "@/components/Error/page";
import DataTable from "@/components/table/data-table";
import { SearchConfig, StatusConfig, ActionConfig } from "@/types/table";
import { DataTableSkeleton } from "@/components/skeletons/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HackathonInsightsData } from "@/types/hackthon/insights";

interface AttendeeTablePageProps<T> {
  title: string;
  columns: any;
  useQuery: (
    query: string,
    options?: { skip?: boolean }
  ) => {
    data?: any;
    isLoading: boolean;
    isError: boolean;
  };
  searchPlaceholder?: string;
  activeTab: string;
  value: string;
  showQuickInsights?: boolean;
  memberInsights?: HackathonInsightsData;
}

export default function AttendeeTablePage<T>({
  title,
  columns,
  useQuery,
  searchPlaceholder = "Search for attendee",
  activeTab,
  value,
  showQuickInsights = false,
  memberInsights,
}: AttendeeTablePageProps<T>) {
  const router = useRouter();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (pageSize === -1) {
      params.append("limit", "all");
    } else {
      params.append("limit", pageSize.toString());
    }
    params.append("page", currentPage.toString());
    return `?${params.toString()}`;
  }, [searchTerm, pageSize, currentPage]);

  // Fetch data via passed hook
  const { data, isLoading, isError } = useQuery(buildQueryString(), {
    skip: activeTab !== value, // only fetch when this tab is active
  });

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: searchPlaceholder,
    searchKeys: ["name", "email", "national"],
  };

  const statusConfig: StatusConfig = { enabled: false };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: false,
    showDelete: false,
    showExport: true,
  };

  const backendPagination = {
    enabled: true,
    currentPage: data?.current_page || 1,
    totalPages: data?.total_pages || 1,
    pageSize,
    totalCount: data?.count || 0,
    onPageChange: (page: number) => setCurrentPage(page),
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    onSearchChange: (search: string) => {
      setSearchTerm(search);
      setCurrentPage(1);
    },
    loading: isLoading,
  };

  // if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <div className="mx-auto py-7">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {isLoading ? (
        <DataTableSkeleton rows={10} columns={5} />
      ) : (
        <div className={showQuickInsights ? "grid grid-cols-10 gap-5" : ""}>
          <div className={showQuickInsights ? "col-span-7" : ""}>
            <DataTable<T>
              data={data?.data ?? []}
              columns={columns}
              searchConfig={searchConfig}
              statusConfig={statusConfig}
              actionConfig={actionConfig}
              backendPagination={backendPagination}
            />
          </div>
          {showQuickInsights && (
            <div className="col-span-3">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Layout className="w-5 h-5 text-primary flex-shrink-0" />
                    Quick Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-start gap-2.5">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Day 1 Attendees
                    </span>
                    <div className="flex gap-3 items-center flex-wrap">
                      <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200">
                        {memberInsights?.attendeesMembersFirstDay || 0} Total
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                        {memberInsights?.day1Male || 0} Male
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-pink-100 text-pink-800 border border-pink-200">
                        {memberInsights?.day1Female || 0} Female
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2.5">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Day 2 Attendees
                    </span>
                    <div className="flex gap-3 items-center flex-wrap">
                      <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200">
                        {memberInsights?.attendeesMembersSecondDay || 0} Total
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                        {memberInsights?.day2Male || 0} Male
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-pink-100 text-pink-800 border border-pink-200">
                        {memberInsights?.day2Female || 0} Female
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-800 border border-green-200">
                        {memberInsights?.day2Onsite || 0} Onsite
                      </Badge>
                      <Badge className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200">
                        {memberInsights?.day2Virtual || 0} Virtual
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
