"use client";

import { useRef, useId, useMemo, useState, useEffect } from "react";
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

export default function DataTable<TData extends DataTableRow>({
  data,
  columns: baseColumns,
  searchConfig = { enabled: false, searchKeys: [] },
  statusConfig = { enabled: false, columnKey: "" },
  actionConfig = { enabled: false },
  onDeleteRows,
  bulkDeleteMutation, // New: single delete mutation hook
  error,
  pageSize = 10,
  // enableColumnVisibility = true,
  enableSorting = true,
  enableSelection = true,
  allowTrigger = false,
  className,
  columnVisibilityConfig,
}: DataTableProps<TData>) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    //initialize hidden columns from config
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

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    const selectedCount = selectedIds.length;

    setIsDeleting(true);

    try {
      if (bulkDeleteMutation) {
        // Use Promise.all to execute multiple delete operations
        await Promise.all(
          selectedIds.map((id) => bulkDeleteMutation(id).unwrap())
        );
        
        // Show success toast
        toast.success(
          selectedCount === 1 
            ? "Item deleted successfully" 
            : `${selectedCount} items deleted successfully`
        );
      } else if (onDeleteRows) {
        // Legacy callback approach
        const updatedData = data.filter(
          (item) => !selectedRows.some((row) => row.original.id === item.id)
        );
        onDeleteRows(updatedData);
        
        // Show success toast
        toast.success(
          selectedCount === 1 
            ? "Item deleted successfully" 
            : `${selectedCount} items deleted successfully`
        );
      }
      
      table.resetRowSelection();
    } catch (error) {
      console.error("Bulk delete error:", error);
      
      // Show error toast
      toast.error(
        selectedCount === 1 
          ? "Failed to delete item. Please try again." 
          : `Failed to delete ${selectedCount} items. Please try again.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Create global filter function
  const globalFilterFn = useMemo<FilterFn<TData> | undefined>(() => {
    if (!searchConfig.enabled) return undefined;
    return createGlobalFilterFn(searchConfig.searchKeys ?? []);
  }, [searchConfig.enabled, searchConfig.searchKeys]);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
    enableSorting,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  //handle Export

  const handleExport = (type: string) => {
    const exportData = table.getFilteredRowModel().rows.map((r) => r.original);
    if (type === "excel") exportToExcel(exportData);
    else if (type === "pdf") exportToPDF(exportData);
    else if (type === "csv") exportToCSV(exportData);
  };

  // Get unique status values for status filter
  const uniqueStatusValues = useMemo(() => {
    if (!statusConfig.enabled || !statusConfig.columnKey) return [];
    const statusColumn = table.getColumn(statusConfig.columnKey);
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [statusConfig.enabled, statusConfig.columnKey, table]);

  const statusCounts = useMemo(() => {
    if (!statusConfig.enabled || !statusConfig.columnKey) return new Map();

    const statusColumn = table.getColumn(statusConfig.columnKey);
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [statusConfig.enabled, statusConfig.columnKey, table]);

  const selectedStatuses = useMemo(() => {
    if (!statusConfig.enabled || !statusConfig.columnKey) return [];

    const filterValue = table
      .getColumn(statusConfig.columnKey)
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [statusConfig.enabled, statusConfig.columnKey, table]);

  const handleStatusChange = (checked: boolean, value: string) => {
    if (!statusConfig.enabled || !statusConfig.columnKey) return;

    const filterValue = table
      .getColumn(statusConfig.columnKey)
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn(statusConfig.columnKey)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  // Handle auto scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { top, bottom, left, right } = container.getBoundingClientRect();
      const threshold = 70;
      const scrollSpeed = 30;

      // -------- Vertical scroll ----------
      // if (e.clientY < top + threshold) {
      //   container.scrollTop -= scrollSpeed;
      // } else if (e.clientY > bottom - threshold) {
      //   container.scrollTop += scrollSpeed;
      // }

      // -------- Horizontal scroll ----------
      if (e.clientX < left + threshold) {
        container.scrollLeft -= scrollSpeed;
        console.log("Scrolling left, scrollLeft:", container.scrollLeft);
      } else if (e.clientX > right - threshold) {
        container.scrollLeft += scrollSpeed;
        console.log("Scrolling right, scrollLeft:", container.scrollLeft);
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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search filter */}
          {searchConfig.enabled && (
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9",
                  Boolean(globalFilter) && "pe-9"
                )}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchConfig.placeholder || "Search..."}
                type="text"
                aria-label={searchConfig.placeholder || "Search"}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(globalFilter) && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear search"
                  onClick={() => {
                    setGlobalFilter("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Status filter */}
          {statusConfig.enabled && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {statusConfig.title || "Status"}
                  {selectedStatuses.length > 0 && (
                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    Filters
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="text-muted-foreground ms-2 text-xs">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Column visibility toggle */}
          {columnVisibilityConfig?.enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns3Icon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
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
                    <Button className="ml-auto" variant="outline">
                      <TrashIcon
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
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
                      <AlertDialogHeader>
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
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteRows}
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
              {/* Export Button */}
              {actionConfig?.showExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
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
                >
                  <PlusIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {actionConfig.addButtonText || "Add"}
                </Button>
              )}
            </div>

            {/* Custom actions */}
            {actionConfig.customActions}
          </div>
        )}
      </div>

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
            className="bg-background overflow-auto max-h-[500px] max-w-full rounded-md border"
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
                      className="h-24 text-center"
                    >
                      No results.
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
                No results.
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
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
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
                  disabled={!table.getCanPreviousPage()}
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
                  disabled={!table.getCanPreviousPage()}
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
                  disabled={!table.getCanNextPage()}
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
                  disabled={!table.getCanNextPage()}
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
