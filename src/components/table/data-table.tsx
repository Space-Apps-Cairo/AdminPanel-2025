"use client";

import { useRef, useId, useMemo, useState, useEffect } from "react";
import debounce from 'lodash.debounce';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  Mail as MailIcon,
  LoaderCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DataTableRow, DataTableProps } from "@/types/table";
import { exportToExcel, exportToPDF, exportToCSV } from "@/lib/exporter";
import { toast } from "sonner";
import {
  useGetEmailTemplatesQuery,
  useSendEmailsMutation,
} from "@/service/Api/emails/templates";
import { EmailRequest } from "@/types/emails/templates";
import Loading from "../loading/loading";

// Create a global filter function for multi-column search
const createGlobalFilterFn = <TData extends DataTableRow>(
  searchKeys: string[]
): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const searchableContent = searchKeys
      .map((key) => String(row.original[key] || ""))
      .join(" ")
      .toLowerCase();
    const searchTerm = (filterValue ?? "").toLowerCase();
    return searchableContent.includes(searchTerm);
  };
};

// Create a status filter function
const createStatusFilterFn = <
  TData extends DataTableRow
>(): FilterFn<TData> => {
  return (row, columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const status = row.getValue(columnId) as string;
    return filterValue.includes(status);
  };
};

export default function DataTable<TData extends DataTableRow  >({
  data,
  columns: baseColumns,
  
  searchConfig = { enabled: false, searchKeys: [] },
  statusConfig = { enabled: false, columnKey: "" },
  actionConfig = { enabled: false },
  onDeleteRows,
  bulkDeleteMutation, // New: single delete mutation hook
  error,
  pageSize = 10,
  enableSorting = true,
  enableSelection = true,
  allowTrigger = false,
  className,
  columnVisibilityConfig,
  enableBulkEmail = false,
  backendPagination = { enabled: false },
}:DataTableProps<TData>) {
  const id = useId();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    columnVisibilityConfig?.invisibleColumns?.forEach((key) => {
      initial[key] = false;
    });
    return initial;
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Add loading state for delete operation
  const [isDeleting, setIsDeleting] = useState(false);

  // NEW: bulk email dialog state
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined
  );

  // Add temporary search state for backend pagination
  const [tempSearchValue, setTempSearchValue] = useState("");

  // Add new state for managing multiple filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  // Add refs to track previous values
  const prevPaginationRef = useRef<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const prevGlobalFilterRef = useRef<string>("");
  const prevSortingRef = useRef<SortingState>([]);
  const prevColumnFiltersRef = useRef<ColumnFiltersState>([]);
  const backendPaginationRef = useRef(backendPagination);
  const prevActiveFiltersRef = useRef<Record<string, string[]>>({});

  // Update ref when backendPagination changes
  useEffect(() => {
    backendPaginationRef.current = backendPagination;
  }, [backendPagination]);

  // Handle backend pagination changes
  useEffect(() => {
    const currentBackendPagination = backendPaginationRef.current;
    const prevPagination = prevPaginationRef.current;

    if (!currentBackendPagination.enabled) {
      prevPaginationRef.current = pagination;
      return;
    }

    // Handle page size change
    if (prevPagination.pageSize !== pagination.pageSize && currentBackendPagination.onPageSizeChange) {
      currentBackendPagination.onPageSizeChange(pagination.pageSize);
    }

    // Handle page index change
    if (prevPagination.pageIndex !== pagination.pageIndex && currentBackendPagination.onPageChange) {
      currentBackendPagination.onPageChange(pagination.pageIndex + 1);
    }

    prevPaginationRef.current = pagination;
  }, [pagination]);

  // Handle backend search changes - modified to use search button
  useEffect(() => {
    const currentBackendPagination = backendPaginationRef.current;
    if (currentBackendPagination.enabled && currentBackendPagination.onSearchChange) {
      // Only trigger search when globalFilter changes (not tempSearchValue)
      const prevGlobalFilter = prevGlobalFilterRef.current;
      if (prevGlobalFilter !== globalFilter) {
        currentBackendPagination.onSearchChange(globalFilter);
      }
    }
    prevGlobalFilterRef.current = globalFilter;
  }, [globalFilter]);

  // Handle backend sorting changes
  useEffect(() => {
    const currentBackendPagination = backendPaginationRef.current;
    if (currentBackendPagination.enabled && currentBackendPagination.onSortChange) {
      const prevSorting = prevSortingRef.current;
      if (JSON.stringify(prevSorting) !== JSON.stringify(sorting)) {
        if (sorting.length > 0) {
          const sort = sorting[0];
          currentBackendPagination.onSortChange({
            field: sort.id,
            direction: sort.desc ? 'desc' : 'asc'
          });
        } else {
          currentBackendPagination.onSortChange(null);
        }
      }
    }
    prevSortingRef.current = sorting;
  }, [sorting]);

  // Handle backend filter changes
  useEffect(() => {
    const currentBackendPagination = backendPaginationRef.current;
    if (currentBackendPagination.enabled && currentBackendPagination.onFilterChange) {
      const prevColumnFilters = prevColumnFiltersRef.current;
      if (JSON.stringify(prevColumnFilters) !== JSON.stringify(columnFilters)) {
        const filters: Record<string, unknown> = {};
        columnFilters.forEach(filter => {
          filters[filter.id] = filter.value;
        });
        currentBackendPagination.onFilterChange(filters);
      }
    }
    prevColumnFiltersRef.current = columnFilters;
  }, [columnFilters]);

  // NEW: Handle custom filter changes for backend
  useEffect(() => {
    console.log('activeFilters changed:', activeFilters); // Debug log
    const currentBackendPagination = backendPaginationRef.current;
    if (currentBackendPagination.enabled && currentBackendPagination.onFilterChange) {
      const prevActiveFilters = prevActiveFiltersRef.current;
      console.log('prevActiveFilters:', prevActiveFilters); // Debug log
      if (JSON.stringify(prevActiveFilters) !== JSON.stringify(activeFilters)) {
        // Convert activeFilters to the format expected by backend
        const backendFilters: Record<string, unknown> = {};
        Object.entries(activeFilters).forEach(([queryKey, values]) => {
          if (values.length > 0) {
            backendFilters[queryKey] = values;
          }
        });
        console.log('Calling onFilterChange with:', backendFilters); // Debug log
        currentBackendPagination.onFilterChange(backendFilters);
      }
    }
    prevActiveFiltersRef.current = activeFilters;
  }, [activeFilters]);

  // Create columns with optional selection column
  const columns: ColumnDef<TData>[] = useMemo(() => {
    const cols: ColumnDef<TData>[] = [];

    // Add selection column if enabled
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Add base columns with filter functions
    const updatedBaseColumns = baseColumns.map((column) => {
      if (
        statusConfig.enabled &&
        "accessorKey" in column &&
        column.accessorKey === statusConfig.columnKey
      ) {
        return {
          ...column,
          filterFn: createStatusFilterFn<TData>(),
        };
      }
      return column;
    });

    cols.push(...updatedBaseColumns);
    return cols;
  }, [baseColumns, enableSelection, statusConfig]);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: backendPagination.enabled ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: backendPagination.enabled ? undefined : getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: backendPagination.enabled ? undefined : getFilteredRowModel(),
    getFacetedUniqueValues: backendPagination.enabled ? undefined : getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: searchConfig.enabled && !backendPagination.enabled
      ? createGlobalFilterFn(searchConfig.searchKeys ?? [])
      : undefined,
    enableSorting,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    // Backend pagination configuration
    manualPagination: backendPagination.enabled,
    manualSorting: backendPagination.enabled,
    manualFiltering: backendPagination.enabled,
    pageCount: backendPagination.enabled && backendPagination.totalCount 
      ? Math.ceil(backendPagination.totalCount / pagination.pageSize) 
      : -1,
  });

  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);


  useEffect(() => {
  const handler = debounce((value: string) => {
    setGlobalFilter(value);
    table.setPageIndex(0);
  }, 500);

  debouncedSearchRef.current = handler;

  return () => {
    handler.cancel(); // ✅ يلغي أي تايمر شغال
  };
}, [table]);

  // RTK: templates & send emails
  const {
    data: templatesResp,
    isLoading: isLoadingTemplates,
    isError: isTemplatesError,
  } = useGetEmailTemplatesQuery(undefined, {
    skip: !enableBulkEmail, // 👈 don't fetch until dialog is open
  });
  console.log(isTemplatesError);
  const [sendEmails, { isLoading: isSending }] = useSendEmailsMutation();

  // helper: template options for Select
  const templateOptions = useMemo(() => {
    return (
      templatesResp?.data?.map((t: { id: number; title: string; subject: string }) => ({
        value: String(t.id),
        label: t.title ?? t.subject ?? `Template ${t.id}`,
      })) ?? []
    );
  }, [templatesResp]);

  //handle Export
  const extractTeamData = (data: any[]) => {
    return data.map(item => {
      const onsiteMembersCount = item.members 
        ? item.members.filter((member: any) => member.participation_type === 1).length
        : 0;

      return {
        'UUID': item.uuid || 'N/A',
        'Team Name': item.team_name || 'N/A',
        'Challenge Name': item.challenge?.title || 'N/A',
        'Challenge Description': item.challenge?.description || 'N/A',
        'Team Leader Name': item.team_leader?.name || 'N/A',
        'Team Leader Email': item.team_leader?.email || 'N/A',
        'Limited Capacity': item.limited_capacity ? 'Yes' : 'No',
        'Member Count': item.members_count || 0,
        'Onsite Members Count': onsiteMembersCount,
        'Project Proposal': item.project_proposal_url || 'N/A',
        'Project Video': item.project_video_url || 'N/A',
        'Team Image': item.team_photo?.url || 'N/A',
        'Actual Solution': item.actual_solution || 'N/A',
        'Participation Method': item.participation_method?.title || 'N/A'
      };
    });
  };
  // استخدامها في دالة التصدير
  const handleExport = (type: string) => {
    const exportData = backendPagination.enabled 
      ? data
      : table.getFilteredRowModel().rows.map((r) => r.original);
    
    // استخراج البيانات المطلوبة فقط
    const filteredData = extractTeamData(exportData);
    
    if (type === "excel") exportToExcel(filteredData);
    else if (type === "pdf") exportToPDF(filteredData);
    else if (type === "csv") exportToCSV(filteredData);
  };

  // Get unique status values for status filter
  // const uniqueStatusValues = useMemo(() => {
  //   if (!statusConfig.enabled || !statusConfig.columnKey) return [];
  //   if (backendPagination.enabled) {
  //     // For backend pagination, we need to get unique values from the backend
  //     // This should be provided by the parent component
  //     return [];
  //   }
  //   const statusColumn = table.getColumn(statusConfig.columnKey);
  //   if (!statusColumn) return [];
  //   const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
  //   return values.sort();
  // }, [statusConfig.enabled, statusConfig.columnKey, table, backendPagination.enabled]);

  // const statusCounts = useMemo(() => {
  //   if (!statusConfig.enabled || !statusConfig.columnKey) return new Map();
  //   if (backendPagination.enabled) {
  //     // For backend pagination, status counts should be provided by the backend
  //     return new Map();
  //   }
  //   const statusColumn = table.getColumn(statusConfig.columnKey);
  //   if (!statusColumn) return new Map();
  //   return statusColumn.getFacetedUniqueValues();
  // }, [statusConfig.enabled, statusConfig.columnKey, table, backendPagination.enabled]);

  // const selectedStatuses = useMemo(() => {
  //   if (!statusConfig.enabled || !statusConfig.columnKey) return [];
  //   const filterValue = table
  //     .getColumn(statusConfig.columnKey)
  //     ?.getFilterValue() as string[];
  //   return filterValue ?? [];
  // }, [statusConfig.enabled, statusConfig.columnKey, table]);

  // const handleStatusChange = (checked: boolean, value: string) => {
  //   if (!statusConfig.enabled || !statusConfig.columnKey) return;

  //   const filterValue = table
  //     .getColumn(statusConfig.columnKey)
  //     ?.getFilterValue() as string[];
  //   const newFilterValue = filterValue ? [...filterValue] : [];

  //   if (checked) {
  //     newFilterValue.push(value);
  //   } else {
  //     const index = newFilterValue.indexOf(value);
  //     if (index > -1) {
  //       newFilterValue.splice(index, 1);
  //     }
  //   }

  //   table
  //     .getColumn(statusConfig.columnKey)
  //     ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  // };

  // Update the filter handling logic
  const handleFilterChange = (filterKey: string, checked: boolean, value: string) => {
    console.log('handleFilterChange called:', { filterKey, checked, value }); // Debug log
    setActiveFilters(prev => {
      const updated = { ...prev };
      
      if (checked) {
        // If checking, set only this value (remove any other values for this filter)
        updated[filterKey] = [value];
      } else {
        // If unchecking, remove this value
        const currentValues = prev[filterKey] || [];
        const newValues = currentValues.filter(v => v !== value);
        
        if (newValues.length === 0) {
          delete updated[filterKey];
        } else {
          updated[filterKey] = newValues;
        }
      }
      
      console.log('Updated activeFilters:', updated); // Debug log
      return updated;
    });
  };

  // Handle auto scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, right } = container.getBoundingClientRect();
      const threshold = 70;
      const scrollSpeed = 30;

      // horizontal scroll
      if (e.clientX < left + threshold) {
        container.scrollLeft -= scrollSpeed;
      } else if (e.clientX > right - threshold) {
        container.scrollLeft += scrollSpeed;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  // Bulk send submit handler
  const handleBulkSendConfirm = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("No rows selected");
      return;
    }
    if (!selectedTemplate) {
      toast.error("Please choose a template");
      return;
    }

    const ids = selectedRows.map((r) => r.original.id);
    const payload = {
      template_id: Number(selectedTemplate),
      ids,
    };

    try {
      await sendEmails(payload as EmailRequest).unwrap();
      toast.success(
        ids.length === 1
          ? "Email sent to 1 participant"
          : `Emails sent to ${ids.length} participants`
      );
      setBulkDialogOpen(false);
      table.resetRowSelection();
    } catch (err: unknown) {
      console.error("Bulk send error:", err);
      toast.error("Failed to send emails", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  // Add search handler function
  // const handleSearch = () => {
  //   if (backendPagination.enabled) {
  //     setGlobalFilter(tempSearchValue);
  //     // Reset to first page when searching
  //     table.setPageIndex(0);
  //   }
  // };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-6">
          {/* Search filter */}
          {searchConfig.enabled && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Input
                  id={`${id}-input`}
                  ref={inputRef}
                  className={cn(
                    "peer min-w-60 ps-9",
                    Boolean(backendPagination.enabled ? tempSearchValue : globalFilter) && "pe-9"
                  )}
                  value={backendPagination.enabled ? tempSearchValue : (globalFilter ?? "")}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (backendPagination.enabled) {
                      setTempSearchValue(value);
                      // Debounce the search execution
                      debouncedSearchRef.current?.(value);
                    } else {
                      setGlobalFilter(value);
                    }
                  }}
                  placeholder={searchConfig.placeholder || "Search..."}
                  type="text"
                  aria-label={searchConfig.placeholder || "Search"}
                  disabled={backendPagination.loading}
                  autoFocus={!!(backendPagination.enabled ? tempSearchValue : globalFilter)}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <ListFilterIcon size={16} aria-hidden="true" />
                </div>
                {Boolean(backendPagination.enabled ? tempSearchValue : globalFilter) && (
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Clear search"
                    onClick={() => {
                      if (backendPagination.enabled) {
                        setTempSearchValue("");
                        setGlobalFilter("");
                      } else {
                        setGlobalFilter("");
                      }
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    disabled={backendPagination.loading}
                  >
                    <CircleXIcon size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              
              {/* Search button for backend pagination */}
              {/* {backendPagination.enabled && (
                <Button
                  onClick={handleSearch}
                  disabled={backendPagination.loading}
                  size="sm"
                  className="px-3"
                >
                  <SearchIcon size={16} className="mr-1" />
                  Search
                </Button>
              )} */}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">

            {/* Status filter */}
            {statusConfig.enabled && statusConfig.filterOptions && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" disabled={backendPagination.loading}>
                    <FilterIcon className="-ms-1 opacity-60" size={16} />
                    <p className="opacity-60">Filters</p>
                    {Object.values(activeFilters).flat().length > 0 && (
                      <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                        {Object.values(activeFilters).flat().length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-64 p-3" align="start">
                  <div className="space-y-4">
                    {statusConfig.filterOptions.map((filterOption, index) => (
                      <div key={`${filterOption.queryKey}-${index}`} className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          {filterOption.title || filterOption.queryKey}
                        </div>
                        <div className="space-y-2">
                          {filterOption.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`${id}-${filterOption.queryKey}-${option.id}`}
                                checked={activeFilters[filterOption?.queryKey ?? '']?.includes(option.id.toString()) || false}
                                onCheckedChange={(checked: boolean) =>
                                  handleFilterChange(filterOption.queryKey ?? '', checked, option.id.toString())
                                }
                              />
                              <Label
                                htmlFor={`${id}-${filterOption.queryKey}-${option.id}`}
                                className="flex grow justify-between gap-2 font-normal"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {index < (statusConfig.filterOptions?.length ?? 0) - 1 && (
                          <div className="border-t mt-4 border-border/50" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Column visibility toggle */}
            {columnVisibilityConfig?.enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={backendPagination.loading}>
                    <Columns3Icon className="-ms-1 opacity-60" size={16} />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>

        </div>

        {/* Actions */}
        {actionConfig.enabled && (
          <div className="flex items-center gap-3">

            {/* Delete button */}

            {enableSelection &&
              actionConfig.showDelete &&
              (onDeleteRows || bulkDeleteMutation) &&
              table.getSelectedRowModel().rows.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="ml-auto" variant="outline" disabled={backendPagination.loading}>
                      <TrashIcon className="-ms-1 opacity-60" size={16} />
                      Delete
                      <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                        {table.getSelectedRowModel().rows.length}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <CircleAlertIcon className="opacity-80" size={16} />
                      </div>
                      <div>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete {table.getSelectedRowModel().rows.length}{" "}
                          selected{" "}
                          {table.getSelectedRowModel().rows.length === 1
                            ? "row"
                            : "rows"}
                          .
                        </AlertDialogDescription>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          // call delete handler
                          const handleDeleteRowsInternal = async () => {
                            const selectedRows =
                              table.getSelectedRowModel().rows;
                            const selectedIds = selectedRows.map(
                              (row) => row.original.id
                            );
                            const selectedCount = selectedIds.length;
                            setIsDeleting(true);
                            try {
                              if (bulkDeleteMutation) {
                                await Promise.all(
                                  selectedIds.map((id) =>
                                    bulkDeleteMutation(id).unwrap()
                                  )
                                );
                                toast.success(
                                  selectedCount === 1
                                    ? "Item deleted successfully"
                                    : `${selectedCount} items deleted successfully`
                                );
                              } else if (onDeleteRows) {
                                const updatedData = data.filter(
                                  (item) =>
                                    !selectedRows.some(
                                      (row) => row.original.id === item.id
                                    )
                                );
                                onDeleteRows(updatedData);
                                toast.success(
                                  selectedCount === 1
                                    ? "Item deleted successfully"
                                    : `${selectedCount} items deleted successfully`
                                );
                              }
                              table.resetRowSelection();
                            } catch (err) {
                              console.error("Bulk delete error:", err);
                              toast.error(
                                selectedCount === 1
                                  ? "Failed to delete item. Please try again."
                                  : `Failed to delete ${selectedCount} items. Please try again.`
                              );
                            } finally {
                              setIsDeleting(false);
                            }
                          };
                          handleDeleteRowsInternal();
                        }}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                      >
                        {isDeleting && (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 ml-auto">
              {/* NEW: Bulk Send Button (shows when selection > 0 & feature enabled) */}
              {enableBulkEmail &&
                enableSelection &&
                table.getSelectedRowModel().rows.length > 0 && (
                  <div>
                    <AlertDialog
                      open={bulkDialogOpen}
                      onOpenChange={setBulkDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="ml-2" disabled={backendPagination.loading}>
                          <MailIcon className="-ms-1 opacity-60" size={16} />
                          Send ({table.getSelectedRowModel().rows.length})
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Send Emails</AlertDialogTitle>
                          <AlertDialogDescription>
                            Choose a template to send to the selected
                            participants.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="mt-4">
                          <Label>Template</Label>
                          <Select
                            value={selectedTemplate}
                            onValueChange={(val) => setSelectedTemplate(val)}
                            disabled={isLoadingTemplates}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  isLoadingTemplates
                                    ? "Loading templates..."
                                    : "Select a template"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingTemplates ? (
                                <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                                  <LoaderCircle className="animate-spin" />
                                  Loading templates...
                                </div>
                              ) : (
                                templateOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleBulkSendConfirm}
                            disabled={!selectedTemplate || isSending}
                          >
                            {isSending ? "Sending..." : "Confirm & Send"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              {/* Export Button */}
              {actionConfig?.showExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={backendPagination.loading}>
                      Export
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("excel")}>
                      Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Add button */}
              {actionConfig.showAdd && (
                <Button
                  className="ml-auto"
                  variant="outline"
                  onClick={actionConfig.onAdd}
                  disabled={backendPagination.loading}
                >
                  <PlusIcon className="-ms-1 opacity-60" size={16} />
                  {actionConfig.addButtonText || "Add"}
                </Button>
              )}
            </div>

            {/* Custom actions */}
            {actionConfig.customActions}
          </div>
        )}
      </div>

      {/* Loading indicator for backend pagination */}
      {/* {backendPagination.loading && (
        <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center py-4 bg-black z-50">
          <LoaderCircle className="animate-spin mr-2" size={20} />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      )} */}

      {/* Table */}
      <Tabs defaultValue="table" className="w-full">
        {allowTrigger && (
          <TabsList>
            <TabsTrigger className="p-2.5 cursor-pointer" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="p-2.5 cursor-pointer" value="cards">
              Cards
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="table">
          <div
            ref={scrollRef}
            className="bg-background overflow-x-auto  max-w-full rounded-md border"
          >
            <Table className="table-fixed min-w-[1000px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            width: header.getSize()
                              ? `${header.getSize()}px`
                              : undefined,
                          }}
                          className="h-11"
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <div
                              className={cn(
                                header.column.getCanSort() &&
                                  "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              onKeyDown={(e) => {
                                if (
                                  header.column.getCanSort() &&
                                  (e.key === "Enter" || e.key === " ")
                                ) {
                                  e.preventDefault();
                                  header.column.getToggleSortingHandler()?.(e);
                                }
                              }}
                              tabIndex={
                                header.column.getCanSort() ? 0 : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}

                              <div className="flex flex-col">
                                <ChevronUpIcon
                                  className={cn(
                                    "shrink-0 transition-opacity",
                                    header.column.getIsSorted() === "asc"
                                      ? "opacity-100"
                                      : "opacity-30"
                                  )}
                                  size={12}
                                />
                                <ChevronDownIcon
                                  className={cn(
                                    "shrink-0 transition-opacity -mt-1",
                                    header.column.getIsSorted() === "desc"
                                      ? "opacity-100"
                                      : "opacity-30"
                                  )}
                                  size={12}
                                />
                              </div>
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="last:py-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="m-auto h-24 text-center"
                    >
                      {backendPagination.loading ? <Loading className="w-full !top-[93px] h-24 flex items-center justify-center" /> : "No results."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Card key={row.id}>
                  <CardHeader>
                    <CardTitle>
                      {flexRender(
                        row.getVisibleCells()[1]?.column.columnDef.cell,
                        row.getVisibleCells()[1]?.getContext()
                      )}
                    </CardTitle>
                    {row.getVisibleCells()[2] && (
                      <CardDescription>
                        {flexRender(
                          row.getVisibleCells()[2]?.column.columnDef.cell,
                          row.getVisibleCells()[2]?.getContext()
                        )}
                      </CardDescription>
                    )}
                    <CardAction>
                      {flexRender(
                        row.getVisibleCells()[0]?.column.columnDef.cell,
                        row.getVisibleCells()[0]?.getContext()
                      )}
                    </CardAction>
                  </CardHeader>
                  <div className="mx-5 border-t border-border/50"></div>
                  <CardContent className="flex flex-col gap-2.5">
                    {row
                      .getVisibleCells()
                      .slice(1, -1)
                      .map((cell) => (
                        <div
                          key={cell.id}
                          className="flex items-center gap-2.5"
                        >
                          <h3 className="text-sm font-medium">
                            {cell.column.id} :
                          </h3>
                          <CardDescription>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </CardDescription>
                        </div>
                      ))}
                  </CardContent>
                  <div className="mx-5 border-t border-border/50"></div>
                  <CardFooter className="flex justify-end">
                    {(() => {
                      const lastCell =
                        row.getVisibleCells()[row.getVisibleCells().length - 1];
                      return flexRender(
                        lastCell?.column.columnDef.cell,
                        lastCell?.getContext()
                      );
                    })()}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {backendPagination.loading ? "Loading..." : "No results."}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={`${id}-pagesize`} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            disabled={backendPagination.loading}
          >
            <SelectTrigger
              id={`${id}-pagesize`}
              className="w-fit whitespace-nowrap"
            >
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
  {[5, 10, 25, 50].map((size) => (
    <SelectItem key={size} value={size.toString()}>
      {size}
    </SelectItem>
  ))}
  {/* <SelectItem key="all" value={data.length.toString()}>
    All
  </SelectItem> */}
</SelectContent>
          </Select>
        </div>

        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {backendPagination.enabled && backendPagination.totalCount
                ? // Backend pagination calculation
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
                : // Frontend pagination calculation
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              -
              {backendPagination.enabled && backendPagination.totalCount
                ? // Backend pagination calculation
                  Math.min(
                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
                    backendPagination.totalCount
                  )
                : // Frontend pagination calculation
                  Math.min(
                    Math.max(
                      table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
                      0
                    ),
                    table.getRowCount()
                  )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {backendPagination.enabled && backendPagination.totalCount
                ? backendPagination.totalCount.toString()
                : table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage() || backendPagination.loading}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || backendPagination.loading}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || backendPagination.loading}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage() || backendPagination.loading}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
