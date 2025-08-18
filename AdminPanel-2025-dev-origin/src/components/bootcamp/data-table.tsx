
"use client";

import { useRef, useId, useMemo, useState } from "react";
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
  VisibilityState,
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
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTableRow, DataTableProps } from "@/types/table";
import { exportToExcel, exportToPDF, exportToCSV } from "@/lib/exporter";

// ✅ BootcampType rows كلها عندها id
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
  onDataChange,
  error,
  pageSize = 10,
  enableColumnVisibility = true,
  enableSorting = true,
  enableSelection = true,
  allowTrigger = false,
  className,
}: DataTableProps<TData>) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Bootcamp: نضمن إن الـ id موجود عشان الـ selection يشتغل
  const columns: ColumnDef<TData>[] = useMemo(() => {
    const cols: ColumnDef<TData>[] = [];

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

    // ✅ Bootcamp fields (name, date, total_capacity) بتدخل من baseColumns
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

  const handleDeleteRows = () => {
    if (!onDataChange) return;
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    );
    onDataChange(updatedData);
    table.resetRowSelection();
  };

  // ✅ Search across Bootcamp fields (name, date)
  const globalFilterFn = useMemo<FilterFn<TData> | undefined>(() => {
  if (!searchConfig.enabled) return undefined;
  return createGlobalFilterFn(searchConfig.searchKeys || []);
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

  const handleExport = (type: string) => {
    const exportData = table.getFilteredRowModel().rows.map((r) => r.original);
    if (type === "excel") exportToExcel(exportData);
    else if (type === "pdf") exportToPDF(exportData);
    else if (type === "csv") exportToCSV(exportData);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* باقي الكود زي ما هو (filters, table, pagination...) */}
      {/*  متوافق مع BootcampType والـ rows-actions */}
    </div>
  );
}

