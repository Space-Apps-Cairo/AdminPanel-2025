import { ColumnDef } from "@tanstack/react-table";

// Generic type for table data
export type DataTableRow = {
  id: number | string;
  [key: string]: unknown;
};

// Configuration for search filters
export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  searchKeys?: string[];
}

// Configuration for status filters
export interface StatusConfig {
  enabled: boolean;
  columnKey?: string;
  title?: string;
}

// Configuration for actions
export interface ActionConfig {
  enabled: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  onExport?: (type: "pdf" | "excel" | "csv") => void;
  customActions?: React.ReactNode;
}
export interface ColumnVisibilityConfig {
  enableColumnVisibility?: boolean;
  invisibleColumns?: string[];
}
// Props for the DataTable component
export interface DataTableProps<TData extends DataTableRow> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchConfig?: SearchConfig;
  statusConfig?: StatusConfig;
  actionConfig?: ActionConfig;
  // Legacy callback for backward compatibility
  onDeleteRows?: (data: TData[]) => void;
  // Single delete mutation hook for bulk operations
  bulkDeleteMutation?: any; // RTK Query mutation hook
  error?: string;
  pageSize?: number;
  columnVisibilityConfig?: ColumnVisibilityConfig;
  enableSorting?: boolean;
  enableSelection?: boolean;
  className?: string;
  allowTrigger?: boolean;
}
