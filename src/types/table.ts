<<<<<<< HEAD
import { ColumnDef } from "@tanstack/react-table"

// Generic type for table data
export type DataTableRow = {
    id: number | string
    [key: string]: unknown
}

// Configuration for search filters
export interface SearchConfig {
    enabled: boolean
    placeholder?: string
    searchKeys?: string[]
}

// Configuration for status filters
export interface StatusConfig {
    enabled: boolean
    columnKey?: string
    title?: string
}

// Configuration for actions
export interface ActionConfig {
    enabled: boolean
    showAdd?: boolean
    showDelete?: boolean
    showExport?: boolean
    addButtonText?: string
    onAdd?: () => void
    onExport?:(type:"pdf"|"excel"|"csv")=> void
    customActions?: React.ReactNode
}

// Props for the DataTable component
export interface DataTableProps<TData extends DataTableRow> {
    columns: ColumnDef<TData>[]
    data: TData[]
    searchConfig?: SearchConfig
    statusConfig?: StatusConfig
    actionConfig?: ActionConfig
    onDataChange?: (data: TData[]) => void
    error?: string
    pageSize?: number
    enableColumnVisibility?: boolean
    enableSorting?: boolean
    enableSelection?: boolean
    className?: string,
    allowTrigger? : boolean
}
=======
// src/types/table.ts
import { ColumnDef } from "@tanstack/react-table";

export interface DataTableRow {
  id: number | string;
  [key: string]: any;
}

export interface Participant extends DataTableRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  status: "active" | "inactive";
  // 
}

export interface ActionConfig {
  enabled?: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  customActions?: React.ReactNode;
}

export interface DataTableProps<TData extends DataTableRow> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchConfig?: { enabled?: boolean; searchKeys?: string[]; placeholder?: string };
  statusConfig?: { enabled?: boolean; columnKey?: string; title?: string };
  actionConfig?: ActionConfig;
  onDataChange?: (data: TData[]) => void;
  error?: string | null;
  pageSize?: number;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableSelection?: boolean;
  className?: string;
  isLoading?: boolean;

}export interface StatusConfig {
  enabled?: boolean;
  columnKey?: string; // 
  title?: string;
}

export interface SearchConfig {
  enabled?: boolean;
  searchKeys?: string[]; // أي أعمدة نبحث فيها
  placeholder?: string;
}

>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623
