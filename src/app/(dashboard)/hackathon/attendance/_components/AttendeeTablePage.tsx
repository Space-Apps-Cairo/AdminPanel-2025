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
  maleCnt?: number;
  femaleCnt?: number;
  attendeesMembersFirstDay?: number;
  attendeesMembersSecondDay?: number;
}

export default function AttendeeTablePage<T>({
  title,
  columns,
  useQuery,
  searchPlaceholder = "Search for attendee",
  activeTab,
  value,
  showQuickInsights = false,
  maleCnt,
  femaleCnt,
  attendeesMembersFirstDay,
  attendeesMembersSecondDay,
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
    params.append("limit", pageSize.toString());
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
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Total Attendees
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      {data?.count || 0} Members
                    </Badge>
                  </div>

                  {/* {data.insights.male_attended !== undefined && ( */}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Male Members
                    </span>
                    {/* <span className="font-semibold">{data.insights.male_attended}</span> */}
                    <span className="font-semibold">{maleCnt || 0}</span>
                  </div>
                  {/* )} */}

                  {/* {data.insights.female_attended !== undefined && ( */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Female Members
                    </span>
                    {/* <span className="font-semibold">{data.insights.female_attended}</span> */}
                    <span className="font-semibold">{femaleCnt || 0}</span>
                  </div>

                  {/* )} */}

                  {/* {data.insights.day1_attendees !== undefined && ( */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Total Day1 Attendees
                    </span>
                    {/* <span className="font-semibold">{data.insights.day1_attendees}</span> */}
                    <span className="font-semibold">
                      {attendeesMembersFirstDay || 0}
                    </span>
                  </div>
                  {/* )} */}

                  {/* {data.insights.day2_attendees !== undefined && ( */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Total Day2 Attendees
                    </span>
                    {/* <span className="font-semibold">{data.insights.day2_attendees}</span> */}
                    <span className="font-semibold">
                      {attendeesMembersSecondDay || 0}
                    </span>
                  </div>
                  {/* )} */}

                  {/* عرض insights إضافية إذا كانت موجودة */}
                  {/* {Object.entries(data.insights).map(([key, value]) => {
                    // تجاهل الحقول التي تم عرضها بالفعل
                    if (['male_attended', 'female_attended', 'day1_attendees', 'day2_attendees'].includes(key)) {
                      return null;
                    }
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm sm:text-base capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    );
                  })} */}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
